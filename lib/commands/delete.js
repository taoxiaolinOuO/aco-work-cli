const inquirer = require('inquirer').default;
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const config = require('../config');

// 语义化图标
const icons = {
  info: '[i]',
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  delete: '[-]'
};

function deleteTemplate(templateName) {
  // 获取模板列表
  const templateList = config.getTemplateList();

  if (templateName) {
    // 检查是否需要自动补全
    const matchedTemplates = templateList.filter((t) => t.name.toLowerCase().includes(templateName.toLowerCase()));
    if (matchedTemplates.length === 1) {
      // 自动补全
      console.log(chalk.green(`${icons.success} 自动补全模板名: ${matchedTemplates[0].name}`));
      processDelete([matchedTemplates[0].name]);
    } else if (matchedTemplates.length > 1) {
      // 多个匹配，让用户选择
      console.log(chalk.yellow(`${icons.warning} 多个模板匹配，请选择要删除的模板:`));
      const prompts = [
        {
          type: 'list',
          name: 'selectedTemplate',
          message: '请选择要删除的模板:',
          choices: matchedTemplates.map((template) => ({
            name: template.name,
            value: template.name
          }))
        }
      ];
      inquirer.prompt(prompts).then((answers) => {
        processDelete([answers.selectedTemplate]);
      });
    } else {
      // 无匹配，直接使用输入
      processDelete([templateName]);
    }
  } else {
    // 显示操作提示信息
    console.log(chalk.yellow(`${icons.info} 操作说明：`));
    console.log(chalk.yellow('  - 使用上下方向键移动选择项'));
    console.log(chalk.yellow('  - 按空格键选中/取消选中模板'));
    console.log(chalk.yellow('  - 按 a 键全选所有模板'));
    console.log(chalk.yellow('  - 按 i 键反选所有模板'));
    console.log(chalk.yellow('  - 按回车键确认选择并执行删除'));
    console.log('');

    if (templateList.length === 0) {
      console.log(chalk.red(`${icons.error} 当前没有模板，请先添加模板！`));
      return;
    }

    // 交互式问答 - 多选模板
    const prompts = [
      {
        type: 'checkbox',
        name: 'selectedTemplates',
        message: '请选择要删除的模板:',
        choices: templateList.map((template) => ({
          name: template.name,
          value: template.name
        })),
        validate: (input) => {
          if (input.length === 0) {
            return '至少选择一个模板！';
          }
          return true;
        }
      }
    ];

    inquirer.prompt(prompts).then((answers) => {
      const { selectedTemplates } = answers;

      if (selectedTemplates.length === 0) {
        console.log(chalk.red('没有选择模板，操作取消！'));
        return;
      }

      processDelete(selectedTemplates);
    });
  }
}

function processDelete(selectedTemplates) {
  // 读取模板配置
  const configData = config.readTemplateConfig();
  let deletedCount = 0;

  // 删除选中的模板
  selectedTemplates.forEach((templateName) => {
    // 检查模板是否存在于配置中
    const templateExists = configData.templates.some((t) => t.name === templateName);

    if (templateExists) {
      // 从配置中删除
      configData.templates = configData.templates.filter((t) => t.name !== templateName);

      // 删除模板目录
      const templatePath = path.join(config.templateDir, templateName);
      try {
        if (fs.existsSync(templatePath)) {
          fs.removeSync(templatePath);
          console.log(chalk.green(`${icons.success} 已删除模板目录: ${templateName}`));
        } else {
          console.log(chalk.yellow(`${icons.warning} 模板目录 ${templateName} 不存在`));
        }
        deletedCount++;
      } catch (err) {
        console.log(chalk.red(`${icons.error} 删除模板目录失败: ${err.message}`));
      }
    } else {
      console.log(chalk.red(`${icons.error} 模板 ${templateName} 不存在`));
    }
  });

  // 保存更新后的配置
  config.saveTemplateConfig(configData);

  if (deletedCount > 0) {
    console.log(chalk.green(`${icons.success} 模板删除成功！`));
    console.log(chalk.blue(`已删除 ${deletedCount} 个模板`));
  } else {
    console.log(chalk.red(`${icons.error} 没有删除任何模板！`));
  }
}

module.exports = deleteTemplate;
