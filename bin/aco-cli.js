#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer').default;
const path = require('path');
const chalk = require('chalk');
const ora = require('ora').default;

// 导入模块
const config = require('../lib/config');
const template = require('../lib/template');
const file = require('../lib/file');

// 定义版本和描述
program
  .version('1.0.0', '--version', '显示版本信息')
  .description('Aco CLI 脚手架工具')
  .helpOption('--help', '显示帮助信息');

// 帮助信息
const showHelp = () => {
  console.log(chalk.green('Aco CLI 脚手架工具使用说明:'));
  console.log(chalk.blue('  aco-cli create <module-name>  - 创建新模块'));
  console.log(chalk.blue('  aco-cli --help                - 显示帮助信息'));
  console.log(chalk.blue('  aco-cli --version             - 显示版本信息'));
};

// create 命令
program
  .command('create <moduleName>')
  .description('创建新模块')
  .action((moduleName) => {
    // 显示操作提示信息
    console.log(chalk.yellow('操作提示：使用上下方向键选择选项，按回车键确认'));
    console.log('');

    // 获取模板列表
    const templateList = config.getTemplateList();

    // 交互式问答
    const prompts = [];

    // 如果有模板，让用户选择
    if (templateList.length > 0) {
      prompts.push({
        type: 'list',
        name: 'templateAction',
        message: '请选择操作:',
        choices: [
          { name: '使用已有模板', value: 'useExisting' },
          { name: '添加新模板', value: 'addNew' }
        ],
        default: 'useExisting'
      });

      // 如果选择使用已有模板，让用户选择模板
      prompts.push({
        type: 'list',
        name: 'selectedTemplate',
        message: '请选择模板:',
        choices: templateList.map((template) => ({ name: template.name, value: template.name })),
        when: (answers) => answers.templateAction === 'useExisting'
      });
    } else {
      // 如果没有模板，直接添加新模板
      prompts.push({
        type: 'input',
        name: 'templateUrl',
        message: '请输入模板仓库链接:',
        validate: (input) => {
          if (!input) {
            return '模板仓库链接不能为空！';
          }
          return true;
        }
      });
    }

    // 如果选择添加新模板，询问模板URL
    prompts.push({
      type: 'input',
      name: 'templateUrl',
      message: '请输入模板仓库链接:',
      when: (answers) => answers.templateAction === 'addNew',
      validate: (input) => {
        if (!input) {
          return '模板仓库链接不能为空！';
        }
        return true;
      }
    });

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
      let templatePath;
      let templateName;

      // 处理模板选择或添加
      if (answers.templateAction === 'useExisting' || (!answers.templateAction && templateList.length > 0)) {
        // 使用已有模板
        templateName = answers.selectedTemplate || templateList[0].name;
        templatePath = path.join(config.templateDir, templateName);
        console.log(chalk.blue(`正在使用模板: ${templateName}`));
        // 清理模板文件（包括.git目录）
        template.cleanTemplateFiles(templatePath);
      } else {
        // 添加新模板
        const { templateUrl } = answers;
        templateName = template.extractTemplateName(templateUrl);
        templatePath = template.downloadTemplate(templateUrl, templateName);

        // 更新模板配置
        const configData = config.readTemplateConfig();
        const existingTemplateIndex = configData.templates.findIndex(t => t.name === templateName);
        if (existingTemplateIndex >= 0) {
          configData.templates[existingTemplateIndex] = { name: templateName, url: templateUrl };
        } else {
          configData.templates.push({ name: templateName, url: templateUrl });
        }
        config.saveTemplateConfig(configData);
      }

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
        console.log(chalk.green(`模块创建成功！生成路径: ${path.join(targetDir, templateType === 'frontend' ? 'models' : 'Controllers', moduleName)}`));
      } catch (err) {
        processSpinner.fail('生成模块失败');
        console.log(chalk.red(`错误: ${err.message}`));
        process.exit(1);
      }
    });
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有传入命令，显示帮助信息
if (!program.args.length) {
  program.outputHelp();
}