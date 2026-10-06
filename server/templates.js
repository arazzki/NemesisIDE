import path from 'path';

/**
 * Returns a starter boilerplate/template based on file extension and file name.
 * @param {string} fileName 
 * @returns {string}
 */
export function getTemplateForFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);
  
  // Format valid class/identifier name (e.g. main -> main, my-file -> MyFile)
  const cleanIdentifier = baseName
    .replace(/[^a-zA-Z0-9_$]/g, '_')
    .replace(/^([0-9])/, '_$1') || 'Main';

  switch (ext) {
    case '.java':
      return `public class ${cleanIdentifier} {\n    public static void main(String[] args) {\n        System.out.println("☕ Hello from ${cleanIdentifier}!");\n    }\n}\n`;

    case '.py':
      return `def main():\n    print("🐍 Hello from ${fileName}!")\n\nif __name__ == "__main__":\n    main()\n`;

    case '.js':
    case '.mjs':
      return `function main() {\n  console.log("🚀 Hello from ${fileName}!");\n}\n\nmain();\n`;

    case '.ts':
      return `interface AppConfig {\n  name: string;\n  active: boolean;\n}\n\nconst config: AppConfig = {\n  name: "${fileName}",\n  active: true\n};\n\nconsole.log(\`✨ Hello from \${config.name}!\`);\n`;

    case '.tsx':
      return `import React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nexport const ${cleanIdentifier}: React.FC<Props> = ({ title }) => {\n  return <h1>{title}</h1>;\n};\n\nconsole.log("⚛️ Hello from ${fileName} via tsx engine!");\n`;

    case '.jsx':
      return `import React from 'react';\n\nexport default function ${cleanIdentifier}() {\n  return <h1>Hello from ${cleanIdentifier}</h1>;\n}\n\nconsole.log("⚛️ Hello from ${fileName} via tsx engine!");\n`;

    case '.dart':
      return `void main() {\n  print('🎯 Hello from ${fileName}!');\n}\n`;

    case '.c':
      return `#include <stdio.h>\n\nint main() {\n    printf("⚡ Hello from ${fileName}!\\n");\n    return 0;\n}\n`;

    case '.cpp':
    case '.cc':
    case '.cxx':
      return `#include <iostream>\n\nint main() {\n    std::cout << "⚡ Hello from ${fileName}!" << std::endl;\n    return 0;\n}\n`;

    case '.cs':
      return `using System;\n\nnamespace App\n{\n    public class ${cleanIdentifier}\n    {\n        public static void Main(string[] args)\n        {\n            Console.WriteLine("Hello from ${cleanIdentifier}!");\n        }\n    }\n}\n`;

    case '.go':
      return `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("🐹 Hello from ${fileName}!")\n}\n`;

    case '.rs':
      return `fn main() {\n    println!("🦀 Hello from ${fileName}!");\n}\n`;

    case '.php':
      return `<?php\n\necho "🐘 Hello from ${fileName}!\\n";\n`;

    case '.html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${baseName}</title>\n</head>\n<body>\n  <h1>Welcome to ${baseName}</h1>\n</body>\n</html>\n`;

    case '.css':
      return `/* Styles for ${fileName} */\n:root {\n  --primary: #3b82f6;\n  --background: #18181b;\n  --text: #e4e4e7;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n`;

    case '.json':
      return `{\n  "name": "${baseName}",\n  "version": "1.0.0",\n  "description": ""\n}\n`;

    case '.md':
      return `# ${baseName}\n\nDokumentasi untuk file ini.\n\n### Fitur:\n- Poin 1\n- Poin 2\n`;

    case '.sh':
    case '.bash':
      return `#!/usr/bin/env bash\n\necho "🐚 Hello from ${fileName}!"\n`;

    case '.ps1':
      return `# PowerShell script\nWrite-Host "⚡ Hello from ${fileName}!" -ForegroundColor Cyan\n`;

    case '.bat':
    case '.cmd':
      return `@echo off\necho ======================================\necho   Hello from %~nx0!\necho ======================================\npause\n`;

    case '.sql':
      return `-- SQL script: ${baseName}\nSELECT 'Hello from SQL!' AS message;\n`;

    case '.yaml':
    case '.yml':
      return `version: '1.0'\nname: ${baseName}\nenabled: true\n`;

    default:
      return `// ${fileName}\n`;
  }
}
