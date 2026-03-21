const inquirer = require('inquirer').default;
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const config = require('../config');
const template = require('../template');

function updateTemplate(templateName) {
  if (templateName) {
    // 直接使用命令行参数更新指定模板
    processUpdate([templateName]);
  } else {
    // 显示操作提示信息
    console.log(chalk.yellow('操作说明：'));
    console.log(chalk.yellow('  - 使用上下方向键移动选择项'));
    console.log(chalk.yellow('  - 按空格键选中/取消选中模板'));
    console.log(chalk.yellow('  - 按 a 键全选所有模板'));
    console.log(chalk.yellow('  - 按 i 键反选所有模板'));
    console.log(chalk.yellow('  - 按回车键确认选择并执行更新'));
    console.log('');

    // 获取模板列表
    const templateList = config.getTemplateList();

    if (templateList.length === 0) {
      console.log(chalk.red('当前没有模板，请先添加模板！'));
      return;
    }

    // 交互式问答 - 多选模板
    const prompts = [
      {
        type: 'checkbox',
        name: 'selectedTemplates',
        message: '请选择要更新的模板:',
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

      processUpdate(selectedTemplates);
    });
  }
}

function processUpdate(selectedTemplates) {
  // 读取模板配置
  const configData = config.readTemplateConfig();

  // 更新选中的模板
  selectedTemplates.forEach((templateName) => {
    // 查找模板配置
    const templateConfig = configData.templates.find((t) => t.name === templateName);
    if (!templateConfig) {
      console.log(chalk.red(`模板 ${templateName} 不存在`));
      return;
    }

    // 下载模板（会覆盖原有目录）
    console.log(chalk.blue(`正在更新模板: ${templateName}`));
    template.downloadTemplate(templateConfig.url, templateName);
    console.log(chalk.green(`模板 ${templateName} 更新成功`));
  });

  console.log(chalk.green('模板更新完成！'));
  console.log(chalk.blue(`已更新 ${selectedTemplates.length} 个模板`));
}

module.exports = updateTemplate;