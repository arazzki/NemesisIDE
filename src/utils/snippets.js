/**
 * Default Code Snippets for Nemesis IDE
 * Supports IntelliJ/VS Code style shortcuts (e.g. sout + Tab in Java, clg + Tab in JS, pr + Tab in Python, etc.)
 */
import { syntaxSuggestions, getTriggerCharacters } from './syntaxSuggestions';

export const languageSnippets = {
  java: [
    // Output shortcuts
    {
      label: 'sout',
      detail: 'System.out.println(...)',
      insertText: 'System.out.println(${1});',
      documentation: 'Prints a line to standard output'
    },
    {
      label: 'soutv',
      detail: 'System.out.println("var = " + var)',
      insertText: 'System.out.println("${1:var} = " + ${1:var});',
      documentation: 'Prints a variable name and its value to standard output'
    },
    {
      label: 'soutm',
      detail: 'System.out.println("MethodName()")',
      insertText: 'System.out.println("${1:Method}()");',
      documentation: 'Prints method name'
    },
    {
      label: 'serr',
      detail: 'System.err.println(...)',
      insertText: 'System.err.println(${1});',
      documentation: 'Prints a line to standard error output'
    },

    // Method & Main declarations
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
      label: 'm',
      detail: 'public void methodName(...) { ... }',
      insertText: 'public ${1:void} ${2:methodName}(${3}) {\n\t${4}\n}',
      documentation: 'Public method declaration'
    },
    {
      label: 'pm',
      detail: 'private void methodName(...) { ... }',
      insertText: 'private ${1:void} ${2:methodName}(${3}) {\n\t${4}\n}',
      documentation: 'Private method declaration'
    },
    {
      label: 'ctor',
      detail: 'public ClassName(...) { ... }',
      insertText: 'public ${1:ClassName}(${2}) {\n\t${3}\n}',
      documentation: 'Constructor declaration'
    },

    // Conditionals
    {
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'elseif',
      detail: 'else if (condition) { ... }',
      insertText: 'else if (${1:condition}) {\n\t${2}\n}',
      documentation: 'Else-If clause'
    },
    {
      label: 'elif',
      detail: 'else if (condition) { ... }',
      insertText: 'else if (${1:condition}) {\n\t${2}\n}',
      documentation: 'Else-If clause (shorthand)'
    },
    {
      label: 'else',
      detail: 'else { ... }',
      insertText: 'else {\n\t${1}\n}',
      documentation: 'Else block'
    },
    {
      label: 'switch',
      detail: 'switch (key) { case ... }',
      insertText: 'switch (${1:key}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${4}\n\t\tbreak;\n}',
      documentation: 'Switch statement with default case'
    },
    {
      label: 'ifn',
      detail: 'if (var == null) { ... }',
      insertText: 'if (${1:var} == null) {\n\t${2}\n}',
      documentation: 'If null check'
    },
    {
      label: 'inn',
      detail: 'if (var != null) { ... }',
      insertText: 'if (${1:var} != null) {\n\t${2}\n}',
      documentation: 'If not null check'
    },

    // Loops
    {
      label: 'fori',
      detail: 'for (int i = 0; i < max; i++)',
      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:max}; ${1:i}++) {\n\t${3}\n}',
      documentation: 'Standard indexed for-loop'
    },
    {
      label: 'forr',
      detail: 'for (int i = max; i >= 0; i--)',
      insertText: 'for (int ${1:i} = ${2:max}; ${1:i} >= 0; ${1:i}--) {\n\t${3}\n}',
      documentation: 'Reverse indexed for-loop'
    },
    {
      label: 'fore',
      detail: 'for (Type item : collection)',
      insertText: 'for (${1:Object} ${2:item} : ${3:collection}) {\n\t${4}\n}',
      documentation: 'Enhanced for-each loop'
    },
    {
      label: 'iter',
      detail: 'for (Type item : collection)',
      insertText: 'for (${1:Object} ${2:item} : ${3:collection}) {\n\t${4}\n}',
      documentation: 'Enhanced for-each loop'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
    },
    {
      label: 'dowhile',
      detail: 'do { ... } while (condition);',
      insertText: 'do {\n\t${2}\n} while (${1:condition});',
      documentation: 'Do-while loop'
    },

    // Exception handling
    {
      label: 'trycatch',
      detail: 'try { ... } catch (Exception e) { ... }',
      insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${3:e}.printStackTrace();\n}',
      documentation: 'Try-catch block'
    },
    {
      label: 'tryf',
      detail: 'try { ... } catch (...) { ... } finally { ... }',
      insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${3:e}.printStackTrace();\n} finally {\n\t${4}\n}',
      documentation: 'Try-catch-finally block'
    },
    {
      label: 'thr',
      detail: 'throw new Exception(...)',
      insertText: 'throw new ${1:IllegalArgumentException}("${2:message}");',
      documentation: 'Throw exception'
    },

    // Common Java Objects & Utilities
    {
      label: 'sc',
      detail: 'Scanner scanner = new Scanner(System.in);',
      insertText: 'Scanner ${1:scanner} = new Scanner(System.in);',
      documentation: 'Scanner input initialization'
    },
    {
      label: 'scanner',
      detail: 'Scanner scanner = new Scanner(System.in);',
      insertText: 'Scanner ${1:scanner} = new Scanner(System.in);',
      documentation: 'Scanner input initialization'
    },
    {
      label: 'list',
      detail: 'List<Type> list = new ArrayList<>();',
      insertText: 'List<${1:String}> ${2:list} = new ArrayList<>();',
      documentation: 'ArrayList declaration'
    },
    {
      label: 'map',
      detail: 'Map<K, V> map = new HashMap<>();',
      insertText: 'Map<${1:String}, ${2:Object}> ${3:map} = new HashMap<>();',
      documentation: 'HashMap declaration'
    },

    // Constants & Modifiers
    {
      label: 'psfs',
      detail: 'public static final String ...',
      insertText: 'public static final String ${1:NAME} = "${2}";',
      documentation: 'Public static final String constant'
    },
    {
      label: 'psfi',
      detail: 'public static final int ...',
      insertText: 'public static final int ${1:NAME} = ${2:0};',
      documentation: 'Public static final int constant'
    },
    {
      label: 'prsf',
      detail: 'private static final ...',
      insertText: 'private static final ${1:String} ${2:NAME} = ${3};',
      documentation: 'Private static final constant'
    },

    // Structure declarations
    {
      label: 'class',
      detail: 'public class Name { ... }',
      insertText: 'public class ${1:ClassName} {\n\t${2}\n}',
      documentation: 'Class declaration'
    },
    {
      label: 'interface',
      detail: 'public interface Name { ... }',
      insertText: 'public interface ${1:InterfaceName} {\n\t${2}\n}',
      documentation: 'Interface declaration'
    },
    {
      label: 'enum',
      detail: 'public enum Name { ... }',
      insertText: 'public enum ${1:EnumName} {\n\t${2}\n}',
      documentation: 'Enum declaration'
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
      label: 'if',
      detail: 'if condition:',
      insertText: 'if ${1:condition}:\n\t${2:pass}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if condition: ... else: ...',
      insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
      documentation: 'If-Else statement'
    },
    {
      label: 'ife',
      detail: 'if condition: ... else: ...',
      insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
      documentation: 'If-Else statement (shorthand)'
    },
    {
      label: 'elif',
      detail: 'elif condition:',
      insertText: 'elif ${1:condition}:\n\t${2:pass}',
      documentation: 'Elif clause'
    },
    {
      label: 'while',
      detail: 'while condition:',
      insertText: 'while ${1:condition}:\n\t${2:pass}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'elseif',
      detail: 'else if (condition) { ... }',
      insertText: 'else if (${1:condition}) {\n\t${2}\n}',
      documentation: 'Else-If clause'
    },
    {
      label: 'switch',
      detail: 'switch (key) { case ... }',
      insertText: 'switch (${1:key}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}',
      documentation: 'Switch statement'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'switch',
      detail: 'switch (key) { case ... }',
      insertText: 'switch (${1:key}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}',
      documentation: 'Switch statement'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if (condition) { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block'
    },
    {
      label: 'ife',
      detail: 'if (condition) { ... } else { ... }',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else block (shorthand)'
    },
    {
      label: 'while',
      detail: 'while (condition) { ... }',
      insertText: 'while (${1:condition}) {\n\t${2}\n}',
      documentation: 'While loop'
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
      label: 'if',
      detail: 'if condition { ... }',
      insertText: 'if ${1:condition} {\n\t${2}\n}',
      documentation: 'If statement'
    },
    {
      label: 'ifelse',
      detail: 'if condition { ... } else { ... }',
      insertText: 'if ${1:condition} {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else statement'
    },
    {
      label: 'ife',
      detail: 'if condition { ... } else { ... }',
      insertText: 'if ${1:condition} {\n\t${2}\n} else {\n\t${3}\n}',
      documentation: 'If-Else statement (shorthand)'
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
      insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Document}</title>\n</head>\n<body>\n\t${2}\n</body>\n</html>',
      documentation: 'HTML5 Boilerplate'
    },
    {
      label: 'bs5',
      detail: 'Bootstrap 5 Starter Template (CDN)',
      insertText: '<!DOCTYPE html>\n<html lang="id">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Bootstrap 5 Project}</title>\n\t<!-- Bootstrap 5 CSS -->\n\t<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">\n</head>\n<body>\n\t<div class="container py-5">\n\t\t<h1 class="text-primary mb-3">${2:Halo, Bootstrap 5!}</h1>\n\t\t<p class="lead text-muted">${3:Dibuat di Nemesis IDE}</p>\n\t\t<button class="btn btn-primary">${4:Tombol Contoh}</button>\n\t</div>\n\n\t<!-- Bootstrap 5 JS Bundle -->\n\t<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>\n</body>\n</html>',
      documentation: 'Complete Bootstrap 5 Starter Template with CDN links'
    },
    {
      label: 'bs5-card',
      detail: 'Bootstrap 5 Card',
      insertText: '<div class="card shadow-sm">\n\t<div class="card-body">\n\t\t<h5 class="card-title">${1:Card Title}</h5>\n\t\t<p class="card-text">${2:Isi deskripsi kartu...}</p>\n\t\t<a href="#" class="btn btn-primary">${3:Aksi}</a>\n\t</div>\n</div>',
      documentation: 'Bootstrap 5 Card Component'
    },
    {
      label: 'bs5-navbar',
      detail: 'Bootstrap 5 Navbar',
      insertText: '<nav class="navbar navbar-expand-lg bg-body-tertiary mb-4">\n\t<div class="container-fluid">\n\t\t<a class="navbar-brand" href="#">${1:Brand}</a>\n\t\t<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">\n\t\t\t<span class="navbar-toggler-icon"></span>\n\t\t</button>\n\t\t<div class="collapse navbar-collapse" id="navbarNav">\n\t\t\t<ul class="navbar-nav ms-auto">\n\t\t\t\t<li class="nav-item"><a class="nav-link active" href="#">Home</a></li>\n\t\t\t\t<li class="nav-item"><a class="nav-link" href="#">About</a></li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n</nav>',
      documentation: 'Bootstrap 5 Responsive Navbar'
    },
    {
      label: 'bs5-btn',
      detail: 'Bootstrap 5 Button',
      insertText: '<button type="button" class="btn btn-${1:primary}">${2:Tombol}</button>',
      documentation: 'Bootstrap 5 Button'
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
    },
    {
      label: 'class',
      detail: 'class="..."',
      insertText: 'class="${1}"',
      documentation: 'HTML class attribute'
    },
    {
      label: 'href',
      detail: 'href="..."',
      insertText: 'href="${1:#}"',
      documentation: 'HTML href attribute'
    },
    {
      label: 'src',
      detail: 'src="..."',
      insertText: 'src="${1}"',
      documentation: 'HTML src attribute'
    },
    {
      label: 'id',
      detail: 'id="..."',
      insertText: 'id="${1}"',
      documentation: 'HTML id attribute'
    },
    {
      label: 'style',
      detail: 'style="..."',
      insertText: 'style="${1}"',
      documentation: 'HTML style attribute'
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

function getCompletionKind(monaco, kindStr) {
  if (!monaco?.languages?.CompletionItemKind) return 15;
  if (!kindStr) return monaco.languages.CompletionItemKind.Snippet;

  const K = monaco.languages.CompletionItemKind;
  if (K[kindStr] !== undefined) {
    return K[kindStr];
  }

  switch (kindStr) {
    case 'Property': return K.Property;
    case 'Method': return K.Method;
    case 'Function': return K.Function;
    case 'Constructor': return K.Constructor;
    case 'Field': return K.Field;
    case 'Variable': return K.Variable;
    case 'Class': return K.Class;
    case 'Interface': return K.Interface;
    case 'Module': return K.Module;
    case 'Unit': return K.Unit;
    case 'Value': return K.Value;
    case 'Enum': return K.Enum;
    case 'Keyword': return K.Keyword;
    case 'Snippet': return K.Snippet;
    case 'Color': return K.Color;
    case 'File': return K.File;
    case 'Reference': return K.Reference;
    case 'Folder': return K.Folder;
    case 'EnumMember': return K.EnumMember;
    case 'Constant': return K.Constant;
    case 'Struct': return K.Struct;
    case 'Event': return K.Event;
    case 'Operator': return K.Operator;
    case 'TypeParameter': return K.TypeParameter;
    default: return K.Property;
  }
}

let snippetsRegistered = false;

/**
 * Registers all snippets and rich syntax autocomplete into Monaco's completion system
 * @param {any} monaco 
 */
export function registerAllSnippets(monaco) {
  if (snippetsRegistered || !monaco?.languages) return;
  snippetsRegistered = true;

  // Combine all language keys from languageSnippets and syntaxSuggestions
  const allLanguages = Array.from(new Set([
    ...Object.keys(languageSnippets),
    ...Object.keys(syntaxSuggestions)
  ]));

  allLanguages.forEach((lang) => {
    const syntaxList = syntaxSuggestions[lang] || [];
    const snippetList = languageSnippets[lang] || [];

    const seen = new Set();
    const combinedItems = [];

    // 1. Add syntax suggestions first (properties, methods, classes, keywords with rich metadata & filterText)
    for (const item of syntaxList) {
      const key = `${item.label}::${item.insertText}`;
      if (!seen.has(key)) {
        seen.add(key);
        combinedItems.push(item);
      }
    }

    // 2. Add shortcut snippets
    for (const s of snippetList) {
      const key = `${s.label}::${s.insertText}`;
      if (!seen.has(key)) {
        seen.add(key);
        combinedItems.push({
          ...s,
          kind: s.kind || 'Snippet',
          detail: s.detail ? (s.detail.startsWith('[Shortcut]') ? s.detail : `[Shortcut] ${s.detail}`) : `[Shortcut] ${s.label}`
        });
      }
    }

    if (combinedItems.length === 0) return;

    const triggers = getTriggerCharacters(lang);

    monaco.languages.registerCompletionItemProvider(lang, {
      triggerCharacters: triggers,
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilPosition = lineContent.substring(0, position.column - 1);

        // Compute token boundary so word prefixes (including CSS hyphens and PHP $) are fully replaced
        let startCol = word.startColumn;
        if (lang === 'css' || lang === 'scss' || lang === 'less') {
          const cssToken = textUntilPosition.match(/[@a-zA-Z0-9_-]+$/);
          if (cssToken) {
            startCol = position.column - cssToken[0].length;
          }
        } else if (lang === 'php') {
          const phpToken = textUntilPosition.match(/\$?[a-zA-Z0-9_]+$/);
          if (phpToken) {
            startCol = position.column - phpToken[0].length;
          }
        } else {
          const defaultToken = textUntilPosition.match(/[a-zA-Z0-9_]+$/);
          if (defaultToken) {
            startCol = position.column - defaultToken[0].length;
          }
        }

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: Math.max(1, startCol),
          endColumn: Math.max(position.column, word.endColumn)
        };

        const suggestions = combinedItems.map((s) => {
          const isSnippet = s.insertText && (s.insertText.includes('$') || s.kind === 'Snippet');
          return {
            label: s.label,
            kind: getCompletionKind(monaco, s.kind),
            detail: s.detail || (s.kind ? `[${s.kind}] ${s.label}` : s.label),
            documentation: s.documentation,
            insertTextRules: isSnippet
              ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
              : undefined,
            insertText: s.insertText || s.label,
            filterText: s.filterText || s.label,
            range: range,
            sortText: s.sortText || (s.kind === 'Snippet' ? `05_${s.label}` : `10_${s.label}`)
          };
        });

        return { suggestions };
      }
    });
  });
}

