const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 模板存储目录
const templateDir = path.join(__dirname, '../template');
// 模板配置文件
const templateConfigFile = path.join(templateDir, 'template-config.json');

// 读取模板配置
function readTemplateConfig() {
  try {
    if (fs.existsSync(templateConfigFile)) {
      const data = fs.readFileSync(templateConfigFile, 'utf8');
      return JSON.parse(data);
    }
    return { templates: [] };
  } catch (err) {
    console.log(chalk.red(`读取模板配置文件失败: ${err.message}`));
    return { templates: [] };
  }
}

// 保存模板配置
function saveTemplateConfig(config) {
  try {
    fs.writeFileSync(templateConfigFile, JSON.stringify(config, null, 2));
  } catch (err) {
    console.log(chalk.red(`保存模板配置文件失败: ${err.message}`));
  }
}

// 获取模板列表
function getTemplateList() {
  const config = readTemplateConfig();
  return config.templates || [];
}

module.exports = {
  templateDir,
  templateConfigFile,
  readTemplateConfig,
  saveTemplateConfig,
  getTemplateList
};