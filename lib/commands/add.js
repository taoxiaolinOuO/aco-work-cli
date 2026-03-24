const inquirer = require('inquirer').default;
const chalk = require('chalk');
const config = require('../config');
const template = require('../template');

// 语义化图标
const icons = {
  info: '[i]',
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  add: '[+]'
};

function addTemplate(templateUrl) {
  if (templateUrl) {
    // 直接使用命令行参数
    processTemplate(templateUrl);
  } else {
    // 显示操作提示信息
    console.log(chalk.yellow(`${icons.info} 操作提示：请输入模板仓库链接`));
    console.log('');

    // 交互式问答
    const prompts = [
      {
        type: 'input',
        name: 'templateUrl',
        message: '请输入模板仓库链接:',
        validate: (input) => {
          if (!input) {
            return '模板仓库链接不能为空！';
          }
          return true;
        }
      }
    ];

    inquirer.prompt(prompts).then((answers) => {
      processTemplate(answers.templateUrl);
    });
  }
}

function processTemplate(templateUrl) {
  // 提取模板名
  const templateName = template.extractTemplateName(templateUrl);
  console.log(chalk.blue(`${icons.add} 正在添加模板: ${templateName}`));

  // 下载模板
  const templatePath = template.downloadTemplate(templateUrl, templateName);

  // 更新模板配置
  const configData = config.readTemplateConfig();
  const existingTemplateIndex = configData.templates.findIndex((t) => t.name === templateName);
  if (existingTemplateIndex >= 0) {
    configData.templates[existingTemplateIndex] = { name: templateName, url: templateUrl };
    console.log(chalk.yellow(`${icons.warning} 模板 ${templateName} 已存在，已更新配置`));
  } else {
    configData.templates.push({ name: templateName, url: templateUrl });
    console.log(chalk.green(`${icons.success} 模板 ${templateName} 添加成功`));
  }
  config.saveTemplateConfig(configData);

  console.log(chalk.green(`${icons.success} 模板添加完成！`));
}

module.exports = addTemplate;
