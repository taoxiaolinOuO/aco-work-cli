const inquirer = require('inquirer').default;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora').default;
const config = require('../config');
const template = require('../template');
const file = require('../file');

// 语义化图标
const icons = {
  info: '[i]',
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  create: '[+]'
};

function createModule(moduleName) {
  // 显示操作提示信息
  console.log(chalk.yellow(`${icons.info} 操作提示：使用上下方向键选择选项，按回车键确认`));
  console.log('');

  // 获取模板列表
  const templateList = config.getTemplateList();

  // 交互式问答
  const prompts = [];

  // 如果没有提供模块名，添加询问模块名的提示
  if (!moduleName) {
    prompts.push({
      type: 'input',
      name: 'moduleName',
      message: '请输入模块名称:',
      validate: (input) => {
        if (!input) {
          return '模块名称不能为空！';
        }
        return true;
      }
    });
  }

  // 检查是否有模板
  if (templateList.length === 0) {
    // 如果没有模板，提示用户去创建模板
    console.log(chalk.red(`${icons.error} 当前没有可用的模板，请先使用 aco-cli add 命令添加模板`));
    process.exit(1);
  } else {
    // 如果有模板，让用户选择模板
    prompts.push({
      type: 'list',
      name: 'selectedTemplate',
      message: '请选择模板:',
      choices: templateList.map((template) => ({ name: template.name, value: template.name }))
    });
  }

  // 询问模板类型
  prompts.push({
    type: 'list',
    name: 'templateType',
    message: '请选择模板类型:',
    choices: [
      { name: '前端模板', value: 'frontend' },
      { name: '后端模板', value: 'backend' }
    ]
  });

  inquirer.prompt(prompts).then((answers) => {
    // 如果没有提供模块名，使用用户输入的模块名
    if (!moduleName) {
      moduleName = answers.moduleName;
    }

    let templatePath;
    let templateName;

    // 使用选中的模板
    templateName = answers.selectedTemplate;
    templatePath = path.join(config.templateDir, templateName);
    console.log(chalk.blue(`${icons.create} 正在使用模板: ${templateName}`));
    // 清理模板文件（包括.git目录）
    template.cleanTemplateFiles(templatePath);

    const { templateType } = answers;
    // 使用当前工作目录作为目标目录
    const targetDir = path.join(process.cwd(), templateType === 'frontend' ? 'frontend' : 'backend');

    // 处理目录结构
    const processSpinner = ora('正在生成模块...').start();
    try {
      // 分析模板模式
      const templatePattern = template.analyzeTemplatePattern(templatePath);
      console.log(chalk.blue(`模板模式: ${JSON.stringify(templatePattern)}`));
      file.processTemplate(templatePath, targetDir, moduleName, templateType, templatePattern);
      processSpinner.succeed('模块生成成功');
      console.log(
        chalk.green(`${icons.success} 模块创建成功！生成路径: ${path.join(targetDir, templateType === 'frontend' ? 'models' : 'Controllers', moduleName)}`)
      );
    } catch (err) {
      processSpinner.fail('生成模块失败');
      console.log(chalk.red(`${icons.error} 错误: ${err.message}`));
      process.exit(1);
    }
  });
}

module.exports = createModule;
