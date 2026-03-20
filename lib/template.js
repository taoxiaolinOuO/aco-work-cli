const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { templateDir } = require('./config');

// 从仓库URL中提取模板名
function extractTemplateName(templateUrl) {
  // 从URL中提取仓库名
  const match = templateUrl.match(/([^/]+)\.git$/);
  if (match) {
    return match[1];
  }
  // 如果没有.git后缀，尝试从路径中提取
  const parts = templateUrl.split('/');
  return parts[parts.length - 1];
}

// 分析模板库，识别命名模式
function analyzeTemplatePattern(templatePath) {
  try {
    // 搜索TypeScript和C#文件
    const files = fs.readdirSync(templatePath, { recursive: true });
    const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.cs'));
    
    if (tsFiles.length === 0) {
      console.log(chalk.yellow('未找到TypeScript或C#文件，使用默认命名模式'));
      return {
        className: 'SupplierEvaluation',
        fileName: 'supplier-evaluation',
        camelCase: 'supplierEvaluation'
      };
    }
    
    // 读取第一个文件，分析命名模式
    const firstFile = tsFiles[0];
    const filePath = path.join(templatePath, firstFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 尝试匹配类名或接口名
    const classNameMatch = content.match(/(class|interface)\s+([A-Z][a-zA-Z0-9]+)/);
    let className = 'SupplierEvaluation';
    
    if (classNameMatch) {
      className = classNameMatch[2];
      // 提取基础类名（去除Controller、Service等后缀）
      className = className.replace(/(Controller|Service|Dto|Entity)$/, '');
      console.log(chalk.green(`识别到类名: ${className}`));
    }
    
    // 生成对应的文件名和驼峰命名
    const fileName = className.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    const camelCase = className.charAt(0).toLowerCase() + className.slice(1);
    
    return {
      className,
      fileName,
      camelCase
    };
  } catch (err) {
    console.log(chalk.red(`分析模板模式失败: ${err.message}`));
    // 返回默认值
    return {
      className: 'SupplierEvaluation',
      fileName: 'supplier-evaluation',
      camelCase: 'supplierEvaluation'
    };
  }
}

// 清理模板文件
function cleanTemplateFiles(templatePath) {
  try {
    const files = fs.readdirSync(templatePath);
    files.forEach((file) => {
      const filePath = path.join(templatePath, file);
      const stat = fs.statSync(filePath);
      
      // 删除不必要的文件和目录
      if ((!stat.isDirectory() && (file === '.gitignore' || file === 'LICENSE' || file === 'README.md')) || 
          (stat.isDirectory() && file === '.git')) {
        fs.removeSync(filePath);
        console.log(chalk.yellow(`已删除不必要的${stat.isDirectory() ? '目录' : '文件'}: ${file}`));
      }
    });
  } catch (err) {
    console.log(chalk.red(`清理模板文件失败: ${err.message}`));
  }
}

// 下载模板
function downloadTemplate(templateUrl, templateName) {
  const templatePath = path.join(templateDir, templateName);
  
  // 检查模板目录是否存在
  if (fs.existsSync(templatePath)) {
    console.log(chalk.yellow(`模板 ${templateName} 已存在，将覆盖更新`));
    // 确保目录被完全删除
    try {
      console.log(chalk.blue(`正在删除模板目录: ${templatePath}`));
      // 使用更可靠的方法删除目录
      const rimraf = require('rimraf');
      rimraf.sync(templatePath);
      console.log(chalk.green(`模板目录 ${templateName} 已删除`));
      // 验证目录是否真的被删除
      if (fs.existsSync(templatePath)) {
        console.log(chalk.red(`警告: 模板目录 ${templateName} 仍存在`));
      } else {
        console.log(chalk.green(`确认: 模板目录 ${templateName} 已完全删除`));
      }
    } catch (err) {
      console.log(chalk.red(`删除模板目录失败: ${err.message}`));
      process.exit(1);
    }
  }

  // 下载模板
  const downloadSpinner = require('ora')('正在下载模板...').start();
  console.log(chalk.blue(`正在从 ${templateUrl} 下载模板`));
  
  try {
    // 使用git clone命令直接克隆
    execSync(`git clone ${templateUrl} ${templatePath}`, { stdio: 'inherit' });
    downloadSpinner.succeed('模板下载成功');
    
    // 清理不必要的文件
    cleanTemplateFiles(templatePath);
    
    return templatePath;
  } catch (err) {
    downloadSpinner.fail('下载模板失败');
    console.log(chalk.red(`错误: ${err.message}`));
    console.log(chalk.yellow('提示: 请确保模板仓库链接正确，且您有访问权限'));
    console.log(chalk.yellow('提示: 尝试使用HTTPS格式的链接，例如: https://gitee.com/Eric_L/aco-code-templates.git'));
    process.exit(1);
  }
}

module.exports = {
  extractTemplateName,
  analyzeTemplatePattern,
  cleanTemplateFiles,
  downloadTemplate
};