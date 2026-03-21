# aco-cli

Aco CLI 脚手架工具，用于从远程仓库拉取模板文件并生成项目模块。

## 语言切换

- [中文文档](#aco-cli)
- [English Documentation](README.en.md)

## 功能特性

- 支持从远程仓库拉取模板文件
- 交互式命令行界面
- 自动处理目录结构
- 智能文件内容替换功能
- 支持前端和后端模板
- 保存模板仓库链接，下次使用无需重新输入
- 自动检测模板命名模式，无需硬编码
- 前端使用连字符命名，后端使用大驼峰命名
- 支持大写下划线格式的数据库表名替换
- 支持模板的添加、删除、更新和查看操作
- 所有命令都支持彩色输出，提供更好的用户体验
- 支持直接指定参数或交互式操作

## 安装

1. 克隆项目到本地
2. 进入项目目录
3. 运行 `npm install` 安装依赖
4. 运行 `npm link` 将命令挂载到全局环境

## 关于 npm link

当你修改了cli项目的代码后，不需要每次都运行 `npm link`。`npm link` 会创建一个符号链接，将全局的 `aco-cli` 命令指向你的本地项目目录。因此，当你修改本地项目代码后，全局命令会自动反映这些更改。

只有当你添加了新的依赖或者修改了 `package.json` 中的脚本配置时，才需要重新运行 `npm link`。

## 使用

### 基本用法

```bash
# 创建新模块
aco-cli create <module-name>

# 添加新模板
aco-cli add template [url]

# 删除模板
aco-cli delete template [name]

# 显示模板列表
aco-cli show template

# 更新模板
aco-cli update template [name]

# 查看帮助信息
aco-cli --help

# 查看版本信息
aco-cli --version
```

### 示例

1. 创建前端模块：
   ```bash
   aco-cli create aco-login
   ```

2. 创建后端模块：
   ```bash
   aco-cli create aco-user
   ```

3. 添加新模板（直接指定URL）：
   ```bash
   aco-cli add template https://gitee.com/Eric_L/aco-code-templates.git
   ```

4. 添加新模板（交互式）：
   ```bash
   aco-cli add template
   ```

5. 删除模板（直接指定模板名）：
   ```bash
   aco-cli delete template aco-code-templates
   ```

6. 删除模板（交互式，可多选）：
   ```bash
   aco-cli delete template
   ```

7. 显示模板列表：
   ```bash
   aco-cli show template
   ```

8. 更新模板（直接指定模板名）：
   ```bash
   aco-cli update template aco-code-templates
   ```

9. 更新模板（交互式，可多选）：
   ```bash
   aco-cli update template
   ```

### 操作说明

- **创建模块**：执行 `aco-cli create <module-name>`，未提供模块名时会提示输入，选择模板类型后生成模块
- **添加模板**：执行 `aco-cli add template [url]`，提供URL直接添加，否则会提示输入
- **删除模板**：执行 `aco-cli delete template [name]`，提供模板名直接删除，否则显示多选列表
- **显示模板**：执行 `aco-cli show template`，查看所有已添加的模板
- **更新模板**：执行 `aco-cli update template [name]`，提供模板名直接更新，否则显示多选列表
- **通用操作**：使用上下方向键选择，按回车键确认，支持空格键多选，a键全选，i键反选

## 模板结构

### 前端模板

模板目录结构应如下：

```
front-end/
├── models/
├── pages/
├── services/
└── ...
```

生成的模块结构：

```
frontend/
├── models/
│   └── aco-login/
├── pages/
│   └── aco-login/
│       ├── components/
│       │   └── aco-login-add.tsx
│       └── list.tsx
├── services/
│   └── aco-login/
│       └── aco-login.ts
└── ...
```

### 后端模板

模板目录结构应如下：

```
back-end/
├── Controllers/
├── Entities/
│   ├── Domains/
│   └── Dtos/
├── Services/
└── ...
```

生成的模块结构：

```
backend/
├── Controllers/
│   └── AcoUser/
│       └── AcoUserController.cs
├── Entities/
│   ├── Domains/
│   │   └── AcoUser/
│   │       └── AcoUserTable.cs
│   └── Dtos/
│       └── AcoUser/
│           ├── AcoUserDeleteInput.cs
│           ├── AcoUserGetDto.cs
│           └── ...
├── Services/
│   └── AcoUser/
│       ├── IAcoUserService.cs
│       └── AcoUserService.cs
└── ...
```

## 命名规范

### 前端命名规范

- 目录名：使用连字符命名（kebab-case），如 `aco-login`
- 文件名：使用连字符命名（kebab-case），如 `aco-login-add.tsx`
- 变量名：使用小驼峰命名（camelCase），如 `acoLoginService`

### 后端命名规范

- 目录名：使用大驼峰命名（PascalCase），如 `AcoUser`
- 文件名：使用大驼峰命名（PascalCase），如 `AcoUserController.cs`
- 类名：使用大驼峰命名（PascalCase），如 `AcoUserService`
- 数据库表名：使用大写下划线命名（SNAKE_CASE），如 `BAS_ACO_USER`

## 智能替换功能

工具会自动分析模板文件，识别命名模式，然后进行智能替换：

1. 从模板文件中提取类名、文件名和驼峰命名
2. 将用户输入的模块名（如 `aco-login`）转换为对应的格式：
   - 大驼峰：`AcoLogin`
   - 连字符：`aco-login`
   - 小驼峰：`acoLogin`
   - 大写下划线：`ACO_LOGIN`
3. 替换文件内容中的所有相关命名

## 模板库规范

为确保CLI工具能正确处理您的模板库，请遵循以下规范：

1. **目录结构**：
   - 模板库应具有清晰的目录结构
   - 建议将模板组织到 `front-end` 和 `back-end` 目录中
   - 每个目录应包含不同类型文件的子目录（如前端的 models、pages、services；后端的 Controllers、Entities、Services）

2. **命名规范**：
   - 在整个模板库中使用一致的命名规范
   - 前端：目录和文件使用连字符命名，变量使用小驼峰命名
   - 后端：目录、文件和类名使用大驼峰命名，数据库表名使用大写下划线命名

3. **模板文件**：
   - 使用清晰、描述性的模板文件名
   - 包含遵循命名规范的示例代码
   - 确保模板文件包含足够的上下文，以便工具识别命名模式

4. **示例名称**：
   - 在整个模板库中使用一致的示例名称（如类名使用 `SupplierEvaluation`，文件名使用 `supplier-evaluation`）
   - 这有助于工具更准确地识别和替换命名模式

## 示例模板文件

### 前端模板示例（TypeScript）

```typescript
// models/supplier-evaluation.d.ts
export interface SupplierEvaluation {
  id: string;
  name: string;
}

// pages/supplier-evaluation/list.tsx
import React from 'react';

const SupplierEvaluationList: React.FC = () => {
  return (
    <div>
      <h1>Supplier Evaluation List</h1>
    </div>
  );
};

export default SupplierEvaluationList;

// services/supplier-evaluation/supplierEvaluation.ts
export const supplierEvaluationService = {
  getSupplierEvaluation: () => {
    // 实现逻辑
  }
};
```

### 后端模板示例（C#）

```csharp
// Entities/Domains/SupplierEvaluation/SupplierEvaluationTable.cs
using SqlSugar;

namespace GuoKun.CPS.Entities
{
    [SugarTable("BAS_SUPPLIER_EVALUATION")]
    [SugarIndex("INDEX_BAS_SUPPLIER_EVALUATION_SCORE", nameof(Score), OrderByType.Desc)]
    public class SupplierEvaluationTable : OrganizationEntity<long>
    {
        [SugarColumn(ColumnName = "SUPPLIERCODE", IsNullable = false, Length = 100)]
        public string SupplierCode { get; set; } = string.Empty;
    }
}

// Controllers/SupplierEvaluation/SupplierEvaluationController.cs
using Microsoft.AspNetCore.Mvc;

namespace GuoKun.CPS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierEvaluationController : ControllerBase
    {
        // 实现逻辑
    }
}

// Services/SupplierEvaluation/SupplierEvaluationService.cs
namespace GuoKun.CPS.Services
{
    public class SupplierEvaluationService
    {
        // 实现逻辑
    }
}
```

## 错误处理

- 模板URL不能为空
- 模块名称不能为空
- 模板名称不能为空（删除或更新时）
- 下载模板失败时会显示错误信息
- 目录创建失败时会显示错误信息
- 模板不存在时会显示错误信息
- 选择模板时至少选择一个模板

## 注意事项

- 模板仓库必须是公开的，或者用户有访问权限
- 模板目录结构应符合预期，否则可能导致生成的模块结构不正确
- 工具会自动清理模板中的无关文件（如 .gitignore、LICENSE、README.md 等）
- 支持 SSH 和 HTTPS 格式的仓库链接