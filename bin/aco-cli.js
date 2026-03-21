#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

// 导入命令模块
const createModule = require('../lib/commands/create');
const addTemplate = require('../lib/commands/add');
const deleteTemplate = require('../lib/commands/delete');
const showTemplates = require('../lib/commands/show');
const updateTemplate = require('../lib/commands/update');

// 定义版本和描述
program.version('1.0.0', '--version', '显示版本信息').description('Aco CLI 脚手架工具');

// 自定义 --help 选项
program.option('--help', '显示帮助信息', () => {
  showHelp();
  process.exit(0);
});

// 帮助信息
const showHelp = () => {
  console.log(chalk.green('Aco CLI 脚手架工具使用说明:'));
  console.log(chalk.blue('  aco-cli create <module-name>  - 创建新模块（未提供时会提示输入）'));
  console.log(chalk.blue('  aco-cli add template [url]    - 添加新模板（未提供时会提示输入）'));
  console.log(chalk.blue('  aco-cli update template [name] - 更新模板（未提供时会提示选择）'));
  console.log(chalk.blue('  aco-cli delete template [name] - 删除模板（未提供时会提示选择）'));
  console.log(chalk.blue('  aco-cli show template         - 显示模板列表'));
  console.log(chalk.blue('  aco-cli --help                - 显示帮助信息'));
  console.log(chalk.blue('  aco-cli --version             - 显示版本信息'));
};

// create 命令
program
  .command('create [moduleName]')
  .description('创建新模块')
  .action((moduleName) => {
    createModule(moduleName);
  });

// add 命令
program
  .command('add')
  .description('添加新模板')
  .arguments('<template> [templateUrl]')
  .action((template, templateUrl) => {
    if (template === 'template') {
      addTemplate(templateUrl);
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli add template [url]'));
    }
  });

// delete 命令
program
  .command('delete')
  .description('删除模板')
  .arguments('<template> [templateName]')
  .action((template, templateName) => {
    if (template === 'template') {
      deleteTemplate(templateName);
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli delete template [name]'));
    }
  });

// show 命令
program
  .command('show')
  .description('显示模板列表')
  .arguments('<template>')
  .action((template) => {
    if (template === 'template') {
      showTemplates();
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli show template'));
    }
  });

// update 命令
program
  .command('update')
  .description('更新模板')
  .arguments('<template> [templateName]')
  .action((template, templateName) => {
    if (template === 'template') {
      updateTemplate(templateName);
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli update template [name]'));
    }
  });

// 检查是否没有传入命令
if (process.argv.length <= 2) {
  showHelp();
  process.exit(0);
}

// 解析命令行参数
program.parse(process.argv);
