const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// 首字母大写并处理连字符
function capitalizeFirstLetter(string) {
  // 将连字符分割的单词转换为驼峰命名法
  const words = string.split('-');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join('');
}

// 处理单个文件
function processFile(sourcePath, targetPath, moduleName, pattern, templateType) {
  try {
    // 确保目标目录存在
    const targetDir = path.dirname(targetPath);
    fs.ensureDirSync(targetDir);

    // 读取文件内容
    let content = fs.readFileSync(sourcePath, 'utf8');

    // 替换内容中的示例名称为模块名
    const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
    // 生成驼峰命名的模块名（用于apiUrl属性）
    const moduleNameCamelCase = moduleName.split('-').map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
    // 生成大写下划线格式的模块名（用于数据库表名等）
    const moduleNameUpperCase = moduleName.split('-').map(word => word.toUpperCase()).join('_');
    // 生成示例的大写下划线格式
    const patternUpperCase = pattern.fileName.split('-').map(word => word.toUpperCase()).join('_');
    
    // 替换所有可能的示例名称变体
    content = content.replace(new RegExp(pattern.className, 'g'), moduleNameCapitalized);
    content = content.replace(new RegExp(pattern.fileName, 'g'), moduleName);
    content = content.replace(new RegExp(pattern.camelCase, 'g'), moduleNameCamelCase);
    // 替换大写下划线格式
    content = content.replace(new RegExp(patternUpperCase, 'g'), moduleNameUpperCase);
    // 替换带后缀的变体
    content = content.replace(new RegExp(pattern.camelCase + 'Paging', 'g'), moduleNameCamelCase + 'Paging');
    content = content.replace(new RegExp(pattern.camelCase + 'Batch', 'g'), moduleNameCamelCase + 'Batch');
    content = content.replace(new RegExp(pattern.camelCase + 'ExcelExport', 'g'), moduleNameCamelCase + 'ExcelExport');
    content = content.replace(new RegExp(pattern.camelCase + 'ExcelImportDescribe', 'g'), moduleNameCamelCase + 'ExcelImportDescribe');
    content = content.replace(new RegExp(pattern.camelCase + 'ExcelImport', 'g'), moduleNameCamelCase + 'ExcelImport');
    // 替换注释中的示例名称
    content = content.replace(new RegExp(pattern.className, 'g'), moduleNameCapitalized);

    // 写入文件
    fs.writeFileSync(targetPath, content);
  } catch (err) {
    console.log(chalk.red(`处理文件失败 ${sourcePath}: ${err.message}`));
  }
}

// 处理模板文件
function processTemplate(sourceDir, targetDir, moduleName, templateType, templatePattern) {
  // 遍历源目录
  const files = fs.readdirSync(sourceDir);
  
  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // 跳过.git目录
      if (file === '.git') {
        return;
      }
      
      // 检查是否是前端或后端目录
      const isTemplateTypeDir = (templateType === 'frontend' && file === 'front-end') || (templateType === 'backend' && file === 'back-end');
      
      if (isTemplateTypeDir) {
        // 处理模板类型目录
        const templateSourceDir = sourcePath;
        const templateFiles = fs.readdirSync(templateSourceDir);
        
        templateFiles.forEach((templateFile) => {
          const templateFilePath = path.join(templateSourceDir, templateFile);
          const templateFileStat = fs.statSync(templateFilePath);
          
          if (templateFileStat.isDirectory()) {
            // 处理子目录 (models, pages, services, Entities等)
            const moduleTargetDir = path.join(targetDir, templateFile);
            fs.ensureDirSync(moduleTargetDir);
            
            // 遍历子目录内容
            const subItems = fs.readdirSync(templateFilePath);
            subItems.forEach((subItem) => {
              const subItemPath = path.join(templateFilePath, subItem);
              const subItemStat = fs.statSync(subItemPath);
              
              if (subItemStat.isDirectory()) {
                // 检查是否是Domains或Dtos目录
                if (subItem === 'Domains' || subItem === 'Dtos') {
                  // 保持Domains和Dtos目录结构
                  const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
                  const domainsTargetDir = path.join(moduleTargetDir, subItem, moduleNameCapitalized);
                  fs.ensureDirSync(domainsTargetDir);
                  
                  // 遍历其中的文件并复制到模块目录
                  const domainFiles = fs.readdirSync(subItemPath);
                  domainFiles.forEach((domainFile) => {
                    const domainFilePath = path.join(subItemPath, domainFile);
                    const domainFileStat = fs.statSync(domainFilePath);
                    
                    if (domainFileStat.isDirectory()) {
                      // 这是一个示例目录
                      const exampleFiles = fs.readdirSync(domainFilePath);
                      exampleFiles.forEach((exampleFile) => {
                        const exampleFilePath = path.join(domainFilePath, exampleFile);
                        const exampleFileStat = fs.statSync(exampleFilePath);
                        
                        if (exampleFileStat.isFile()) {
                          // 处理文件，替换文件名中的示例名称
                          let newFileName = exampleFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
                          const fileTarget = path.join(domainsTargetDir, newFileName);
                          processFile(exampleFilePath, fileTarget, moduleName, templatePattern, templateType);
                        }
                      });
                    }
                  });
                } else {
                  // 这是一个示例目录
                  // 遍历其中的文件并复制到模块目录
                  const exampleFiles = fs.readdirSync(subItemPath);
                  exampleFiles.forEach((exampleFile) => {
                    const exampleFilePath = path.join(subItemPath, exampleFile);
                    const exampleFileStat = fs.statSync(exampleFilePath);
                    
                    if (exampleFileStat.isFile()) {
                      // 处理文件，替换文件名中的示例名称
                      const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
                      let newFileName = exampleFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
                      
                      if (templateType === 'frontend') {
                        // 前端使用连字符命名
                        newFileName = newFileName.replace(new RegExp(templatePattern.fileName, 'g'), moduleName);
                        // 处理驼峰命名的情况，确保生成正确的连字符命名
                        newFileName = newFileName.replace(new RegExp(templatePattern.camelCase + '([A-Z])', 'g'), (match, p1) => moduleName + '-' + p1.toLowerCase());
                        newFileName = newFileName.replace(new RegExp(templatePattern.camelCase, 'g'), moduleName);
                        const fileTarget = path.join(moduleTargetDir, moduleName, newFileName);
                        fs.ensureDirSync(path.dirname(fileTarget));
                        processFile(exampleFilePath, fileTarget, moduleName, templatePattern, templateType);
                      } else if (templateType === 'backend') {
                        // 后端使用大驼峰命名
                        const fileTarget = path.join(moduleTargetDir, moduleNameCapitalized, newFileName);
                        fs.ensureDirSync(path.dirname(fileTarget));
                        processFile(exampleFilePath, fileTarget, moduleName, templatePattern, templateType);
                      }
                    } else if (exampleFileStat.isDirectory()) {
                      // 处理子目录 (如 components)
                      const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
                      let subSubDirName = exampleFile;
                      
                      if (templateType === 'frontend') {
                        // 前端使用原始目录名
                        const subSubDirTarget = path.join(moduleTargetDir, moduleName, subSubDirName);
                        fs.ensureDirSync(subSubDirTarget);
                        
                        const subSubFiles = fs.readdirSync(exampleFilePath);
                        subSubFiles.forEach((subSubFile) => {
                          const subSubFilePath = path.join(exampleFilePath, subSubFile);
                          // 替换文件名中的示例名称
                          let newSubSubFileName = subSubFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
                          newSubSubFileName = newSubSubFileName.replace(new RegExp(templatePattern.fileName, 'g'), moduleName);
                          // 处理驼峰命名的情况，确保生成正确的连字符命名
                          newSubSubFileName = newSubSubFileName.replace(new RegExp(templatePattern.camelCase + '([A-Z])', 'g'), (match, p1) => moduleName + '-' + p1.toLowerCase());
                          newSubSubFileName = newSubSubFileName.replace(new RegExp(templatePattern.camelCase, 'g'), moduleName);
                          const subSubFileTarget = path.join(subSubDirTarget, newSubSubFileName);
                          processFile(subSubFilePath, subSubFileTarget, moduleName, templatePattern, templateType);
                        });
                      } else if (templateType === 'backend') {
                        // 后端使用原始目录名
                        const subSubDirTarget = path.join(moduleTargetDir, moduleNameCapitalized, subSubDirName);
                        fs.ensureDirSync(subSubDirTarget);
                        
                        const subSubFiles = fs.readdirSync(exampleFilePath);
                        subSubFiles.forEach((subSubFile) => {
                          const subSubFilePath = path.join(exampleFilePath, subSubFile);
                          // 替换文件名中的示例名称
                          let newSubSubFileName = subSubFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
                          const subSubFileTarget = path.join(subSubDirTarget, newSubSubFileName);
                          processFile(subSubFilePath, subSubFileTarget, moduleName, templatePattern, templateType);
                        });
                      }
                    }
                  });
                }
              } else {
                // 处理文件
                const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
                
                if (templateType === 'frontend') {
                  // 前端使用连字符命名
                  const fileTarget = path.join(moduleTargetDir, moduleName, subItem);
                  fs.ensureDirSync(path.dirname(fileTarget));
                  processFile(subItemPath, fileTarget, moduleName, templatePattern, templateType);
                } else if (templateType === 'backend') {
                  // 后端使用大驼峰命名
                  const fileTarget = path.join(moduleTargetDir, moduleNameCapitalized, subItem);
                  fs.ensureDirSync(path.dirname(fileTarget));
                  processFile(subItemPath, fileTarget, moduleName, templatePattern, templateType);
                }
              }
            });
          }
        });
      } else if (file !== 'front-end' && file !== 'back-end') {
        // 处理其他目录 - 通用模板结构
        const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
        let moduleDirName = moduleName;
        
        if (templateType === 'backend') {
          // 后端使用大驼峰命名
          moduleDirName = moduleNameCapitalized;
        }
        
        // 检查当前目录是否是示例目录（包含示例命名模式）
        const isExampleDir = file.includes(templatePattern.className) || file.includes(templatePattern.fileName) || file.includes(templatePattern.camelCase);
        
        if (isExampleDir) {
          // 这是一个示例目录，替换为模块目录
          const targetModuleDir = path.join(targetDir, moduleDirName);
          fs.ensureDirSync(targetModuleDir);
          
          // 遍历示例目录内容
          const exampleFiles = fs.readdirSync(sourcePath);
          exampleFiles.forEach((exampleFile) => {
            const exampleFilePath = path.join(sourcePath, exampleFile);
            const exampleFileStat = fs.statSync(exampleFilePath);
            
            if (exampleFileStat.isFile()) {
              // 处理文件，替换文件名中的示例名称
              let newFileName = exampleFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
              if (templateType === 'frontend') {
                newFileName = newFileName.replace(new RegExp(templatePattern.fileName, 'g'), moduleName);
                newFileName = newFileName.replace(new RegExp(templatePattern.camelCase + '([A-Z])', 'g'), (match, p1) => moduleName + '-' + p1.toLowerCase());
                newFileName = newFileName.replace(new RegExp(templatePattern.camelCase, 'g'), moduleName);
              }
              const fileTarget = path.join(targetModuleDir, newFileName);
              processFile(exampleFilePath, fileTarget, moduleName, templatePattern, templateType);
            } else if (exampleFileStat.isDirectory()) {
              // 处理子目录
              const subDirName = exampleFile.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
              const subDirTarget = path.join(targetModuleDir, subDirName);
              fs.ensureDirSync(subDirTarget);
              
              // 递归处理子目录
              processTemplate(exampleFilePath, subDirTarget, moduleName, templateType, templatePattern);
            }
          });
        } else {
          // 这是一个普通目录，保持结构
          const targetPath = path.join(targetDir, file);
          fs.ensureDirSync(targetPath);
          
          // 递归处理子目录
          processTemplate(sourcePath, targetPath, moduleName, templateType, templatePattern);
        }
      }
    } else {
      // 处理文件
      const moduleNameCapitalized = capitalizeFirstLetter(moduleName);
      let newFileName = file;
      
      // 替换文件名中的示例名称
      newFileName = newFileName.replace(new RegExp(templatePattern.className, 'g'), moduleNameCapitalized);
      if (templateType === 'frontend') {
        newFileName = newFileName.replace(new RegExp(templatePattern.fileName, 'g'), moduleName);
        newFileName = newFileName.replace(new RegExp(templatePattern.camelCase + '([A-Z])', 'g'), (match, p1) => moduleName + '-' + p1.toLowerCase());
        newFileName = newFileName.replace(new RegExp(templatePattern.camelCase, 'g'), moduleName);
      }
      
      const fileTarget = path.join(targetDir, newFileName);
      processFile(sourcePath, fileTarget, moduleName, templatePattern, templateType);
    }
  });
}

module.exports = {
  capitalizeFirstLetter,
  processFile,
  processTemplate
};