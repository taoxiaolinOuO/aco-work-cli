#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const readline = require('readline');

// 导入命令模块
const createModule = require('../lib/commands/create');
const addTemplate = require('../lib/commands/add');
const deleteTemplate = require('../lib/commands/delete');
const showTemplates = require('../lib/commands/show');
const updateTemplate = require('../lib/commands/update');

// 导入配置模块，用于获取模板列表
const config = require('../lib/config');

// 定义版本和描述
program.version('1.0.0', '--version', '显示版本信息').description('Aco CLI 脚手架工具');

// 自定义 --help 选项
program.option('--help', '显示帮助信息', () => {
  showHelp();
  process.exit(0);
});

// 添加 h 作为 --help 的别名
program.command('h').action(() => {
  showHelp();
  process.exit(0);
});

// 添加 v 作为 --version 的别名
program.command('v').action(() => {
  console.log('1.0.0');
  process.exit(0);
});

// 语义化图标
const icons = {
  info: '[i]',
  success: '[✓]',
  warning: '[!]',
  error: '[✗]',
  create: '[+]',
  add: '[+]',
  update: '[↻]',
  delete: '[-]',
  show: '[*]',
  help: '[?]',
  version: '[v]'
};

// 帮助信息
const showHelp = () => {
  console.log(chalk.green(`${icons.info} Aco CLI 脚手架工具`));
  console.log('');
  console.log(chalk.yellow(`${icons.warning} 提示：直接输入 aco-cli 回车可选择命令`));
  console.log('');
  console.log(chalk.green('命令:'));
  console.log(chalk.blue(`  ${icons.create} aco-cli create <module-name>   - 创建新模块（未提供时会提示输入）`));
  console.log(chalk.blue(`  ${icons.add} aco-cli add [url]              - 添加新模板（未提供时会提示输入）`));
  console.log(chalk.blue(`  ${icons.update} aco-cli update [name]          - 更新模板（未提供时会提示选择）`));
  console.log(chalk.blue(`  ${icons.delete}  aco-cli delete [name]          - 删除模板（未提供时会提示选择）`));
  console.log(chalk.blue(`  ${icons.show} aco-cli show                   - 显示模板列表`));
  console.log(chalk.blue(`  ${icons.help} aco-cli --help                 - 显示帮助信息`));
  console.log(chalk.blue(`  ${icons.version} aco-cli --version              - 显示版本信息`));
  console.log('');
  console.log(chalk.green('别名:'));
  console.log(chalk.blue(`  c   - create 的简写（可使用 aco-cli c 代替 aco-cli create）`));
  console.log(chalk.blue(`  a   - add 的简写（可使用 aco-cli a 代替 aco-cli add）`));
  console.log(chalk.blue(`  u   - update 的简写（可使用 aco-cli u 代替 aco-cli update）`));
  console.log(chalk.blue(`  d   - delete 的简写（可使用 aco-cli d 代替 aco-cli delete）`));
  console.log(chalk.blue(`  s   - show 的简写（可使用 aco-cli s 代替 aco-cli show）`));
  console.log(chalk.blue(`  h   - --help 的简写（可使用 aco-cli h 代替 aco-cli --help）`));
  console.log(chalk.blue(`  v   - --version 的简写（可使用 aco-cli v 代替 aco-cli --version）`));
  console.log('');
  console.log(chalk.green('功能:'));
  console.log(chalk.blue(`  ${icons.success} 模板名自动补全`));
  console.log(chalk.blue(`  ${icons.success} 无需输入 template 子命令`));
  console.log(chalk.blue(`  ${icons.success} 支持交互式输入`));
  console.log(chalk.blue(`  ${icons.success} 多选时使用空格选中，回车确认`));
};

// create 命令
program
  .command('create [moduleName]')
  .description('创建新模块')
  .alias('c')
  .action((moduleName) => {
    createModule(moduleName);
  });

// add 命令
program
  .command('add')
  .description('添加新模板')
  .alias('a')
  .arguments('[templateOrUrl]')
  .action((templateOrUrl) => {
    if (!templateOrUrl || templateOrUrl === 'template') {
      addTemplate();
    } else if (templateOrUrl.startsWith('http') || templateOrUrl.includes('git@')) {
      // 直接传入了URL
      addTemplate(templateOrUrl);
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli add template [url]'));
    }
  });

// delete 命令
program
  .command('delete')
  .description('删除模板')
  .alias('d')
  .arguments('[templateOrName]')
  .action((templateOrName) => {
    if (!templateOrName || templateOrName === 'template') {
      deleteTemplate();
    } else {
      // 将输入视为模板名
      deleteTemplate(templateOrName);
    }
  });

// show 命令
program
  .command('show')
  .description('显示模板列表')
  .alias('s')
  .arguments('[template]')
  .action((template) => {
    if (!template || template === 'template') {
      showTemplates();
    } else {
      console.log(chalk.red('无效的子命令，请使用 aco-cli show template'));
    }
  });

// update 命令
program
  .command('update')
  .description('更新模板')
  .alias('u')
  .arguments('[templateOrName]')
  .action((templateOrName) => {
    if (!templateOrName || templateOrName === 'template') {
      updateTemplate();
    } else {
      // 将输入视为模板名
      updateTemplate(templateOrName);
    }
  });

// 脚手架命令列表
const scaffoldCommands = [
  { name: 'create', alias: 'c', description: '创建新模块' },
  { name: 'add', alias: 'a', description: '添加新模板' },
  { name: 'update', alias: 'u', description: '更新模板' },
  { name: 'delete', alias: 'd', description: '删除模板' },
  { name: 'show', alias: 's', description: '显示模板列表' },
  { name: 'help', alias: 'h', description: '显示帮助信息' },
  { name: 'version', alias: 'v', description: '显示版本信息' }
];

// 检查是否是直接执行命令（非交互式）
if (process.argv.length > 2) {
  // 直接执行命令
  program.parse(process.argv);
  // 不要立即退出，让命令执行完成
  // process.exit(0);
} else {
  // 交互式模式：显示命令列表供用户选择
  const inquirer = require('inquirer').default;

  console.log(chalk.green(`${icons.info} Aco CLI 脚手架工具`));
  console.log('');
  console.log(chalk.yellow(`${icons.warning} 请选择要执行的命令:`));
  console.log('');

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'command',
        message: '选择命令:',
        choices: scaffoldCommands.map((cmd) => ({
          name: `${icons[cmd.name]} ${cmd.name} (${cmd.alias}) - ${cmd.description}`,
          value: cmd.name
        }))
      }
    ])
    .then((answers) => {
      // 执行选中的命令
      if (answers.command === 'help') {
        // 直接调用showHelp函数显示带颜色的帮助信息
        showHelp();
      } else if (answers.command === 'version') {
        // 直接显示版本信息
        console.log('1.0.0');
      } else {
        const args = ['node', 'aco-cli.js', answers.command];
        try {
          program.parse(args);
        } catch (error) {
          console.error(chalk.red(`命令执行错误: ${error.message}`));
        }
      }
    });
}
