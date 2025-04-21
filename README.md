## Configuración del Editor (Visual Studio Code)

Este proyecto utiliza **ESLint** configurado con las reglas de **StandardJS** para TypeScript. Para garantizar que ESLint funcione correctamente y que las correcciones automáticas se apliquen al guardar, es necesario configurar el archivo `settings.json` en Visual Studio Code.

### 1. Configuración de ESLint en Visual Studio Code
Sigue estos pasos para añadir la configuración:

#### En macOS:
1. Abre Visual Studio Code.
2. Presiona `Cmd + Shift + P` para abrir la paleta de comandos.
3. Busca y selecciona **"Preferences: Open Workspace Settings (JSON)"**.
4. Agrega la siguiente configuración al archivo `.vscode/settings.json`:

#### En Windows/Linux:
1. Abre Visual Studio Code.
2. Presiona `Ctrl + Shift + P` para abrir la paleta de comandos.
3. Busca y selecciona **"Preferences: Open Workspace Settings (JSON)"**.
4. Agrega la siguiente configuración al archivo `.vscode/settings.json`:

```json
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "always"
    },
    "editor.formatOnSave": true,
    "eslint.useFlatConfig": true
}