const chalk = require('chalk');
const config = require('../config');

// 语义化图标
const icons = {
  info: '[i]',
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  show: '[*]'
};

function showTemplates() {
  try {
    // 获取模板列表
    const templateList = config.getTemplateList();

    // 检查是否有模板
    if (templateList.length === 0) {
      console.log(chalk.yellow(`${icons.warning} 暂无模板，请使用 aco-cli add template 命令添加模板`));
      return;
    }

    // 显示模板列表
    console.log(chalk.green(`${icons.show} 当前模板列表:`));
    console.log('');

    templateList.forEach((template, index) => {
      console.log(chalk.blue(`${index + 1}. ${template.name}`));
      console.log(chalk.gray(`   地址: ${template.url}`));
      console.log('');
    });
  } catch (error) {
    console.error(chalk.red(`${icons.error} 读取模板列表失败:`, error.message));
  }
}

module.exports = showTemplates;
