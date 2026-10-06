/**
 * Default Code Snippets for Nemesis IDE
 * Supports IntelliJ/VS Code style shortcuts (e.g. sout + Tab in Java, clg + Tab in JS, pr + Tab in Python, etc.)
 */

export const languageSnippets = {
  java: [
    {
      label: 'sout',
      detail: 'System.out.println(...)',
      insertText: 'System.out.println(${1});',
      documentation: 'Prints a line to standard output (Java shortcut)'
    },
    {
      label: 'serr',
      detail: 'System.err.println(...)',
      insertText: 'System.err.println(${1});',
      documentation: 'Prints a line to standard error output'
    },
    {
      label: 'psvm',
      detail: 'public static void main(...)',
      insertText: 'public static void main(String[] args) {\n\t${1}\n}',
      documentation: 'Main method declaration'
    },
    {
      label: 'main',
      detail: 'public static void main(...)',
      insertText: 'public static void main(String[] args) {\n\t${1}\n}',
      documentation: 'Main method declaration'
    },
    {
      label: 'fori',
      detail: 'for (int i = 0; i < max; i++)',
      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:max}; ${1:i}++) {\n\t${3}\n}',
      documentation: 'Standard indexed for-loop'
    },
    {
      label: 'fore',
      detail: 'for (Type item : collection)',
      insertText: 'for (${1:Object} ${2:item} : ${3:collection}) {\n\t${4}\n}',
      documentation: 'Enhanced for-each loop'
    },
    {
      label: 'trycatch',
      detail: 'try { ... } catch (Exception e) { ... }',
      insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${3:e}.printStackTrace();\n}',
      documentation: 'Try-catch block'
    }
  ],

  python: [
    {
      label: 'pr',
      detail: 'print(...)',
      insertText: 'print(${1})',
      documentation: 'Print expression or message'
    },
    {
      label: 'print',
      detail: 'print(...)',
      insertText: 'print(${1})',
      documentation: 'Print expression or message'
    },
    {
      label: 'ifmain',
      detail: 'if __name__ == "__main__":',
      insertText: 'if __name__ == "__main__":\n\t${1:main()}',
      documentation: 'Entry point guard'
    },
    {
      label: 'def',
      detail: 'def function_name(args):',
      insertText: 'def ${1:func_name}(${2:args}):\n\t${3:pass}',
      documentation: 'Define a function'
    },
    {
      label: 'for',
      detail: 'for item in iterable:',
      insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
      documentation: 'For loop'
    },
    {
      label: 'try',
      detail: 'try ... except ...',
      insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:print(e)}',
      documentation: 'Try-except block'
    },
    {
      label: 'class',
      detail: 'class ClassName:',
      insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, args}):\n\t\t${3:pass}',
      documentation: 'Class definition with __init__'
    }
  ],

  javascript: [
    {
      label: 'clg',
      detail: 'console.log(...)',
      insertText: 'console.log(${1});',
      documentation: 'Logs output to the console'
    },
    {
      label: 'log',
      detail: 'console.log(...)',
      insertText: 'console.log(${1});',
      documentation: 'Logs output to the console'
    },
    {
      label: 'cerr',
      detail: 'console.error(...)',
      insertText: 'console.error(${1});',
      documentation: 'Logs error to the console'
    },
    {
      label: 'fn',
      detail: 'function name(params) { ... }',
      insertText: 'function ${1:name}(${2:params}) {\n\t${3}\n}',
      documentation: 'Function declaration'
    },
    {
      label: 'afn',
      detail: 'const name = (params) => { ... }',
      insertText: 'const ${1:name} = (${2:params}) => {\n\t${3}\n};',
      documentation: 'Arrow function declaration'
    },
    {
      label: 'fori',
      detail: 'for (let i = 0; i < len; i++)',
      insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3}\n}',
      documentation: 'Standard indexed for-loop'
    },
    {
      label: 'prom',
      detail: 'new Promise(...)',
      insertText: 'new Promise((resolve, reject) => {\n\t${1}\n});',
      documentation: 'Promise wrapper'
    },
    {
      label: 'trycatch',
      detail: 'try { ... } catch (err) { ... }',
      insertText: 'try {\n\t${1}\n} catch (err) {\n\tconsole.error(err);\n}',
      documentation: 'Try-catch block'
    }
  ],

  typescript: [
    {
      label: 'clg',
      detail: 'console.log(...)',
      insertText: 'console.log(${1});',
      documentation: 'Logs output to the console'
    },
    {
      label: 'fn',
      detail: 'function name(params): ReturnType',
      insertText: 'function ${1:name}(${2:params}): ${3:void} {\n\t${4}\n}',
      documentation: 'Typed function declaration'
    },
    {
      label: 'intf',
      detail: 'interface Name { ... }',
      insertText: 'interface ${1:Name} {\n\t${2:id}: ${3:string};\n}',
      documentation: 'TypeScript Interface'
    },
    {
      label: 'type',
      detail: 'type Name = ...',
      insertText: 'type ${1:Name} = ${2:string};',
      documentation: 'TypeScript Type alias'
    }
  ],

  dart: [
    {
      label: 'pr',
      detail: 'print(...)',
      insertText: 'print(${1});',
      documentation: 'Print output in Dart'
    },
    {
      label: 'main',
      detail: 'void main() { ... }',
      insertText: 'void main() {\n\t${1}\n}',
      documentation: 'Dart main entry point'
    },
    {
      label: 'fori',
      detail: 'for (var i = 0; i < max; i++)',
      insertText: 'for (var ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t${3}\n}',
      documentation: 'Standard for loop'
    },
    {
      label: 'class',
      detail: 'class Name { ... }',
      insertText: 'class ${1:Name} {\n\t${1:Name}();\n}',
      documentation: 'Class declaration'
    }
  ],

  cpp: [
    {
      label: 'cout',
      detail: 'std::cout << ... << std::endl;',
      insertText: 'std::cout << ${1} << std::endl;',
      documentation: 'Standard C++ output'
    },
    {
      label: 'cin',
      detail: 'std::cin >> ...;',
      insertText: 'std::cin >> ${1};',
      documentation: 'Standard C++ input'
    },
    {
      label: 'main',
      detail: 'int main() { ... }',
      insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
      documentation: 'Main function entry'
    },
    {
      label: 'fori',
      detail: 'for (int i = 0; i < n; i++)',
      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}',
      documentation: 'C++ for loop'
    },
    {
      label: 'inc',
      detail: '#include <...>',
      insertText: '#include <${1:iostream}>',
      documentation: 'Include header'
    }
  ],

  c: [
    {
      label: 'pf',
      detail: 'printf("...", ...);',
      insertText: 'printf("${1}\\n"${2});',
      documentation: 'Print formatted output'
    },
    {
      label: 'main',
      detail: 'int main() { ... }',
      insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
      documentation: 'Main function entry'
    },
    {
      label: 'fori',
      detail: 'for (int i = 0; i < n; i++)',
      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}',
      documentation: 'C for loop'
    }
  ],

  go: [
    {
      label: 'pl',
      detail: 'fmt.Println(...)',
      insertText: 'fmt.Println(${1})',
      documentation: 'Print line in Go'
    },
    {
      label: 'pf',
      detail: 'fmt.Printf("...", ...)',
      insertText: 'fmt.Printf("${1}\\n", ${2})',
      documentation: 'Formatted print in Go'
    },
    {
      label: 'main',
      detail: 'func main() { ... }',
      insertText: 'func main() {\n\t${1}\n}',
      documentation: 'Go main function'
    },
    {
      label: 'fn',
      detail: 'func name(...) ...',
      insertText: 'func ${1:name}(${2}) ${3} {\n\t${4}\n}',
      documentation: 'Go function'
    },
    {
      label: 'iferr',
      detail: 'if err != nil { ... }',
      insertText: 'if err != nil {\n\t${1:return err}\n}',
      documentation: 'Go error handling idiom'
    }
  ],

  rust: [
    {
      label: 'pl',
      detail: 'println!(...)',
      insertText: 'println!("${1}");',
      documentation: 'Print line macro'
    },
    {
      label: 'main',
      detail: 'fn main() { ... }',
      insertText: 'fn main() {\n\t${1}\n}',
      documentation: 'Rust main entry'
    },
    {
      label: 'fn',
      detail: 'fn name(...) { ... }',
      insertText: 'fn ${1:name}(${2}) {\n\t${3}\n}',
      documentation: 'Rust function'
    }
  ],

  php: [
    {
      label: 'eco',
      detail: 'echo "...";',
      insertText: 'echo "${1}\\n";',
      documentation: 'Echo output'
    },
    {
      label: 'fn',
      detail: 'function name(...) { ... }',
      insertText: 'function ${1:name}(${2}) {\n\t${3}\n}',
      documentation: 'PHP function'
    }
  ],

  html: [
    {
      label: 'html5',
      detail: '<!DOCTYPE html>...',
      insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title>${1:Document}</title>\n</head>\n<body>\n\t${2}\n</body>\n</html>',
      documentation: 'HTML5 Boilerplate'
    },
    {
      label: 'div',
      detail: '<div class="...">...</div>',
      insertText: '<div class="${1}">\n\t${2}\n</div>',
      documentation: 'HTML Div container'
    },
    {
      label: 'btn',
      detail: '<button>...</button>',
      insertText: '<button type="${1:button}">${2:Click me}</button>',
      documentation: 'HTML Button'
    }
  ],

  powershell: [
    {
      label: 'wh',
      detail: 'Write-Host "..."',
      insertText: 'Write-Host "${1}" -ForegroundColor ${2:Cyan}',
      documentation: 'PowerShell Write-Host'
    },
    {
      label: 'fn',
      detail: 'function Name { ... }',
      insertText: 'function ${1:Name} {\n\t${2}\n}',
      documentation: 'PowerShell function'
    }
  ]
};

let snippetsRegistered = false;

/**
 * Registers all snippets into Monaco's completion system
 * @param {any} monaco 
 */
export function registerAllSnippets(monaco) {
  if (snippetsRegistered || !monaco?.languages) return;
  snippetsRegistered = true;

  Object.entries(languageSnippets).forEach(([lang, snippets]) => {
    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = snippets.map((s) => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          detail: `[Shortcut] ${s.detail}`,
          documentation: s.documentation,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          insertText: s.insertText,
          range: range,
          sortText: '00_' + s.label // ensure snippets rank higher than standard tokens
        }));

        return { suggestions };
      }
    });
  });
}
