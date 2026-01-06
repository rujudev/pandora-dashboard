// find-unused-exported-interfaces.js
import fs from 'fs';
import path from 'path';

const validExtensions = ['.ts', '.tsx'];
const allFiles = [];
const interfaces = {};

// Recorre directorios recursivamente
function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (validExtensions.includes(path.extname(fullPath))) {
            allFiles.push(fullPath);
        }
    }
}

// Extrae interfaces exportadas del archivo
function extractInterfaces(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /export\s+interface\s+(\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        interfaces[name] = { file: filePath, usedInOtherFile: false };
    }
}

// Busca si las interfaces se usan en otros archivos
function detectUsage(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const name in interfaces) {
        const definitionFile = interfaces[name].file;
        if (filePath !== definitionFile && content.includes(name)) {
            interfaces[name].usedInOtherFile = true;
        }
    }
}

// Ejecutar script
function main() {
    const rootDir = process.argv[2] || '.';
    walk(rootDir);

    allFiles.forEach(extractInterfaces);
    allFiles.forEach(detectUsage);

    const unused = Object.entries(interfaces).filter(
        ([_, data]) => !data.usedInOtherFile
    );

    console.log(`Interfaces exportadas NO utilizadas en otros archivos (${unused.length}):\n`);
    unused.forEach(([name, data]) => {
        console.log(`- ${name} (definida en ${path.relative(rootDir, data.file)})`);
    });
}

main();
