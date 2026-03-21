# aco-cli

Aco CLI scaffolding tool for pulling template files from remote repositories and generating project modules.

## Features

- Support pulling template files from remote repositories
- Interactive command-line interface
- Automatic directory structure handling
- Intelligent file content replacement
- Support for frontend and backend templates
- Save template repository links for future use
- Automatic detection of template naming patterns
- Frontend uses kebab-case naming, backend uses PascalCase naming
- Support for uppercase underscore format database table name replacement
- Support template management (add, delete, update, view)
- All commands support colored output for better user experience
- Support direct parameter input or interactive operation

## Installation

1. Clone the project to your local machine
2. Enter the project directory
3. Run `npm install` to install dependencies
4. Run `npm link` to mount the command to the global environment

## About npm link

When you modify the CLI project code, you don't need to run `npm link` every time. `npm link` creates a symbolic link that points the global `aco-cli` command to your local project directory. Therefore, when you modify the local project code, the global command will automatically reflect these changes.

You only need to re-run `npm link` when you add new dependencies or modify the script configuration in `package.json`.

## Usage

### Basic Usage

```bash
# Create a new module
aco-cli create <module-name>

# Add a new template
aco-cli add template [url]

# Delete a template
aco-cli delete template [name]

# Show template list
aco-cli show template

# Update a template
aco-cli update template [name]

# View help information
aco-cli --help

# View version information
aco-cli --version
```

### Examples

1. Create a frontend module:
   ```bash
   aco-cli create aco-login
   ```

2. Create a backend module:
   ```bash
   aco-cli create aco-user
   ```

3. Add a new template (with direct URL):
   ```bash
   aco-cli add template https://gitee.com/Eric_L/aco-code-templates.git
   ```

4. Add a new template (interactive):
   ```bash
   aco-cli add template
   ```

5. Delete a template (with direct name):
   ```bash
   aco-cli delete template aco-code-templates
   ```

6. Delete a template (interactive, multi-select):
   ```bash
   aco-cli delete template
   ```

7. Show template list:
   ```bash
   aco-cli show template
   ```

8. Update a template (with direct name):
   ```bash
   aco-cli update template aco-code-templates
   ```

9. Update a template (interactive, multi-select):
   ```bash
   aco-cli update template
   ```

### Operation Instructions

1. **Create Module**:
   - Execute `aco-cli create <module-name>` command
   - If no module name is provided, you will be prompted to enter one
   - Select to use an existing template or add a new template
   - Select template type (frontend or backend)

2. **Add Template**:
   - Execute `aco-cli add template [url]` command
   - If a URL is provided, the template will be added directly
   - If no URL is provided, you will be prompted to enter the template repository link

3. **Delete Template**:
   - Execute `aco-cli delete template [name]` command
   - If a template name is provided, the template will be deleted directly
   - If no template name is provided, a template list will be displayed for multi-selection
   - Use up/down arrow keys to move selection
   - Press space to select/deselect templates
   - Press 'a' to select all templates
   - Press 'i' to invert selection
   - Press enter to confirm selection and execute deletion

4. **Show Template List**:
   - Execute `aco-cli show template` command
   - All added templates and their URLs will be displayed

5. **Update Template**:
   - Execute `aco-cli update template [name]` command
   - If a template name is provided, the template will be updated directly
   - If no template name is provided, a template list will be displayed for multi-selection
   - Use up/down arrow keys to move selection
   - Press space to select/deselect templates
   - Press 'a' to select all templates
   - Press 'i' to invert selection
   - Press enter to confirm selection and execute update

6. **General Operations**:
   - Use up/down arrow keys to select options, press enter to confirm
   - Loading effect will be displayed during download and generation
   - Success messages will be displayed in green
   - Error messages will be displayed in red
   - Prompt messages will be displayed in yellow

## Template Structure

### Frontend Template

The template directory structure should be as follows:

```
front-end/
├── models/
├── pages/
├── services/
└── ...
```

Generated module structure:

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

### Backend Template

The template directory structure should be as follows:

```
back-end/
├── Controllers/
├── Entities/
│   ├── Domains/
│   └── Dtos/
├── Services/
└── ...
```

Generated module structure:

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

## Naming Conventions

### Frontend Naming Conventions

- Directory name: Use kebab-case naming, such as `aco-login`
- File name: Use kebab-case naming, such as `aco-login-add.tsx`
- Variable name: Use camelCase naming, such as `acoLoginService`

### Backend Naming Conventions

- Directory name: Use PascalCase naming, such as `AcoUser`
- File name: Use PascalCase naming, such as `AcoUserController.cs`
- Class name: Use PascalCase naming, such as `AcoUserService`
- Database table name: Use uppercase underscore naming, such as `BAS_ACO_USER`

## Intelligent Replacement Function

The tool will automatically analyze template files, identify naming patterns, and then perform intelligent replacement:

1. Extract class names, file names, and camelCase names from template files
2. Convert the user-input module name (such as `aco-login`) to the corresponding format:
   - PascalCase: `AcoLogin`
   - kebab-case: `aco-login`
   - camelCase: `acoLogin`
   - uppercase underscore: `ACO_LOGIN`
3. Replace all relevant names in the file content

## Template Library Specifications

To ensure that the CLI tool can correctly process your template library, please follow these specifications:

1. **Directory Structure**:
   - The template library should have a clear directory structure
   - For best results, organize templates into `front-end` and `back-end` directories
   - Each directory should contain subdirectories for different types of files (e.g., models, pages, services for frontend; Controllers, Entities, Services for backend)

2. **Naming Conventions**:
   - Use consistent naming conventions throughout the template library
   - Frontend: Use kebab-case for directories and files, camelCase for variables
   - Backend: Use PascalCase for directories, files, and class names, uppercase underscore for database table names

3. **Template Files**:
   - Use clear, descriptive names for template files
   - Include example code that follows the naming conventions
   - Ensure that the template files contain enough context for the tool to identify naming patterns

4. **Example Names**:
   - Use consistent example names throughout the template library (e.g., `SupplierEvaluation` for class names, `supplier-evaluation` for file names)
   - This helps the tool identify and replace naming patterns more accurately

## Error Handling

- Template URL cannot be empty
- Module name cannot be empty
- Template name cannot be empty (when deleting or updating)
- Error messages will be displayed when template download fails
- Error messages will be displayed when directory creation fails
- Error messages will be displayed when template does not exist
- At least one template must be selected when selecting templates

## Notes

- The template repository must be public or the user must have access permissions
- The template directory structure should meet expectations, otherwise the generated module structure may be incorrect
- The tool will automatically clean up unrelated files in the template (such as .gitignore, LICENSE, README.md, etc.)
- Supports SSH and HTTPS format repository links