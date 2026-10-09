/**
 * htmlHelper.js
 * 
 * Provides enhanced HTML development features for Monaco Editor in Nemesis IDE:
 * 1. Auto-closing HTML tags when typing '>' (e.g. <div> -> <div></div> with cursor in middle)
 * 2. Auto-closing matching tag when typing '</'
 * 3. Auto-inserting '=""' with cursor inside when typing '=' on attributes (e.g. class= -> class="")
 * 4. Rich HTML tag completions with standard expansions
 * 5. Rich HTML attribute completions (class, href, src, id, etc.) that automatically insert ='""'
 */

// Void elements in HTML5 that must not have closing tags
export const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// Common HTML attributes that expand with ='""'
export const HTML_ATTRIBUTES = [
  // Primary attributes (Top priority)
  { name: 'class', detail: 'CSS Class name(s)', defaultVal: '$1' },
  { name: 'href', detail: 'Hyperlink reference URL', defaultVal: '$1' },
  { name: 'src', detail: 'Source file URL or path', defaultVal: '$1' },
  { name: 'id', detail: 'Unique element identifier', defaultVal: '$1' },
  { name: 'style', detail: 'Inline CSS styles', defaultVal: '$1' },
  { name: 'type', detail: 'Element or input type', defaultVal: '${1:text}' },
  { name: 'name', detail: 'Form control name', defaultVal: '$1' },
  { name: 'value', detail: 'Element or input value', defaultVal: '$1' },
  { name: 'placeholder', detail: 'Input placeholder hint', defaultVal: '$1' },
  { name: 'alt', detail: 'Alternative image text', defaultVal: '$1' },
  { name: 'title', detail: 'Tooltip advisory title', defaultVal: '$1' },
  { name: 'target', detail: 'Browsing context target', defaultVal: '${1:_blank}' },
  { name: 'rel', detail: 'Relationship of linked document', defaultVal: '${1:noopener noreferrer}' },
  { name: 'action', detail: 'Form submission endpoint URL', defaultVal: '$1' },
  { name: 'method', detail: 'HTTP method for form submission', defaultVal: '${1:POST}' },
  { name: 'for', detail: 'Label associated form element ID', defaultVal: '$1' },
  { name: 'rows', detail: 'Textarea visible text lines', defaultVal: '${1:4}' },
  { name: 'cols', detail: 'Textarea visible text columns', defaultVal: '${1:50}' },
  { name: 'width', detail: 'Element width', defaultVal: '$1' },
  { name: 'height', detail: 'Element height', defaultVal: '$1' },
  { name: 'accept', detail: 'Accepted file types for file input', defaultVal: '$1' },
  { name: 'autocomplete', detail: 'Form control autocomplete state', defaultVal: '${1:on}' },
  { name: 'autofocus', detail: 'Automatically focus element on load', defaultVal: '' },
  { name: 'disabled', detail: 'Disable element', defaultVal: '' },
  { name: 'readonly', detail: 'Mark input as read-only', defaultVal: '' },
  { name: 'required', detail: 'Mark form input as required', defaultVal: '' },
  { name: 'checked', detail: 'Checkbox / radio checked state', defaultVal: '' },
  { name: 'multiple', detail: 'Allow multiple values or files', defaultVal: '' },
  { name: 'maxlength', detail: 'Maximum text length', defaultVal: '$1' },
  { name: 'minlength', detail: 'Minimum text length', defaultVal: '$1' },
  { name: 'min', detail: 'Minimum input value', defaultVal: '$1' },
  { name: 'max', detail: 'Maximum input value', defaultVal: '$1' },
  { name: 'step', detail: 'Number input step interval', defaultVal: '$1' },
  { name: 'pattern', detail: 'Regex pattern for input validation', defaultVal: '$1' },
  { name: 'role', detail: 'ARIA accessibility role', defaultVal: '$1' },
  { name: 'aria-label', detail: 'Accessible text label', defaultVal: '$1' },
  { name: 'aria-hidden', detail: 'Hide from assistive technology', defaultVal: '${1:true}' },
  { name: 'data-', detail: 'Custom data attribute', defaultVal: '$1' },
  { name: 'loading', detail: 'Image / iframe loading behavior', defaultVal: '${1:lazy}' },
  { name: 'download', detail: 'Download hyperlink target', defaultVal: '$1' },
  { name: 'onclick', detail: 'Click event handler', defaultVal: '$1' },
  { name: 'onchange', detail: 'Change event handler', defaultVal: '$1' },
  { name: 'onsubmit', detail: 'Form submit event handler', defaultVal: '$1' }
];

// Comprehensive list of standard HTML tags
export const HTML_TAGS = [
  { tag: 'div', snippet: '<div class="${1}">\n\t${2}\n</div>', detail: 'Block Container' },
  { tag: 'span', snippet: '<span class="${1}">${2}</span>', detail: 'Inline Container' },
  { tag: 'p', snippet: '<p>${1}</p>', detail: 'Paragraph' },
  { tag: 'a', snippet: '<a href="${1:#}">${2}</a>', detail: 'Hyperlink Anchor' },
  { tag: 'button', snippet: '<button type="${1:button}" class="${2}">${3}</button>', detail: 'Button' },
  { tag: 'input', snippet: '<input type="${1:text}" name="${2}" class="${3}" placeholder="${4}" />', detail: 'Input Field' },
  { tag: 'img', snippet: '<img src="${1}" alt="${2}" class="${3}" />', detail: 'Image' },
  { tag: 'form', snippet: '<form action="${1}" method="${2:POST}">\n\t${3}\n</form>', detail: 'Form' },
  { tag: 'label', snippet: '<label for="${1}">${2}</label>', detail: 'Form Label' },
  { tag: 'select', snippet: '<select name="${1}" id="${2}">\n\t<option value="${3}">${4}</option>\n</select>', detail: 'Select Dropdown' },
  { tag: 'option', snippet: '<option value="${1}">${2}</option>', detail: 'Select Option' },
  { tag: 'textarea', snippet: '<textarea name="${1}" rows="${2:4}" class="${3}" placeholder="${4}">${5}</textarea>', detail: 'Multi-line Textarea' },
  { tag: 'ul', snippet: '<ul>\n\t<li>${1}</li>\n</ul>', detail: 'Unordered List' },
  { tag: 'ol', snippet: '<ol>\n\t<li>${1}</li>\n</ol>', detail: 'Ordered List' },
  { tag: 'li', snippet: '<li>${1}</li>', detail: 'List Item' },
  { tag: 'table', snippet: '<table class="${1}">\n\t<thead>\n\t\t<tr>\n\t\t\t<th>${2}</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>${3}</td>\n\t\t</tr>\n\t</tbody>\n</table>', detail: 'Table' },
  { tag: 'tr', snippet: '<tr>\n\t<td>${1}</td>\n</tr>', detail: 'Table Row' },
  { tag: 'th', snippet: '<th>${1}</th>', detail: 'Table Header Cell' },
  { tag: 'td', snippet: '<td>${1}</td>', detail: 'Table Data Cell' },
  { tag: 'h1', snippet: '<h1>${1}</h1>', detail: 'Heading 1' },
  { tag: 'h2', snippet: '<h2>${1}</h2>', detail: 'Heading 2' },
  { tag: 'h3', snippet: '<h3>${1}</h3>', detail: 'Heading 3' },
  { tag: 'h4', snippet: '<h4>${1}</h4>', detail: 'Heading 4' },
  { tag: 'h5', snippet: '<h5>${1}</h5>', detail: 'Heading 5' },
  { tag: 'h6', snippet: '<h6>${1}</h6>', detail: 'Heading 6' },
  { tag: 'header', snippet: '<header class="${1}">\n\t${2}\n</header>', detail: 'Header' },
  { tag: 'footer', snippet: '<footer class="${1}">\n\t${2}\n</footer>', detail: 'Footer' },
  { tag: 'nav', snippet: '<nav class="${1}">\n\t${2}\n</nav>', detail: 'Navigation' },
  { tag: 'main', snippet: '<main class="${1}">\n\t${2}\n</main>', detail: 'Main Content' },
  { tag: 'section', snippet: '<section class="${1}">\n\t${2}\n</section>', detail: 'Section' },
  { tag: 'article', snippet: '<article class="${1}">\n\t${2}\n</article>', detail: 'Article' },
  { tag: 'aside', snippet: '<aside class="${1}">\n\t${2}\n</aside>', detail: 'Aside Sidebar' },
  { tag: 'script', snippet: '<script src="${1}"></script>', detail: 'Script Tag' },
  { tag: 'style', snippet: '<style>\n\t${1}\n</style>', detail: 'Style Tag' },
  { tag: 'link', snippet: '<link rel="${1:stylesheet}" href="${2}" />', detail: 'Link Tag' },
  { tag: 'meta', snippet: '<meta name="${1}" content="${2}" />', detail: 'Meta Tag' },
  { tag: 'hr', snippet: '<hr />', detail: 'Horizontal Rule' },
  { tag: 'br', snippet: '<br />', detail: 'Line Break' },
  { tag: 'strong', snippet: '<strong>${1}</strong>', detail: 'Bold / Strong Text' },
  { tag: 'em', snippet: '<em>${1}</em>', detail: 'Emphasized Text' },
  { tag: 'code', snippet: '<code>${1}</code>', detail: 'Inline Code' },
  { tag: 'pre', snippet: '<pre><code>${1}</code></pre>', detail: 'Preformatted Code Block' },
  { tag: 'blockquote', snippet: '<blockquote>${1}</blockquote>', detail: 'Blockquote' },
  { tag: 'iframe', snippet: '<iframe src="${1}" title="${2}" width="${3:100%}" height="${4:400}"></iframe>', detail: 'Inline Frame' },
  { tag: 'video', snippet: '<video src="${1}" controls width="${2:100%}">\n\t${3}\n</video>', detail: 'Video Player' },
  { tag: 'audio', snippet: '<audio src="${1}" controls></audio>', detail: 'Audio Player' },
  { tag: 'canvas', snippet: '<canvas id="${1}" width="${2:600}" height="${3:400}"></canvas>', detail: 'Canvas Graphics' },
  { tag: 'svg', snippet: '<svg viewBox="0 0 ${1:24} ${2:24}" fill="none" stroke="currentColor" width="${3:24}" height="${4:24}">\n\t${5}\n</svg>', detail: 'SVG Vector' }
];

let htmlProvidersRegistered = false;

/**
 * Registers rich HTML tag and attribute completion providers in Monaco
 * @param {any} monaco 
 */
export function registerHtmlCompletions(monaco) {
  if (htmlProvidersRegistered || !monaco?.languages) return;
  htmlProvidersRegistered = true;

  const supportedLanguages = ['html', 'php', 'xml'];

  supportedLanguages.forEach((lang) => {
    monaco.languages.registerCompletionItemProvider(lang, {
      triggerCharacters: ['<', ' ', '=', '/', 'c', 'h', 's', 'i', 'a', 't', 'p', 'd'],
      provideCompletionItems: (model, position) => {
        const textUntilPos = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [];

        // Check if cursor is inside an opening tag: `<tagname ... |`
        const lastOpenAngle = textUntilPos.lastIndexOf('<');
        const lastCloseAngle = textUntilPos.lastIndexOf('>');
        const isInsideTag = lastOpenAngle !== -1 && lastOpenAngle > lastCloseAngle;

        if (isInsideTag) {
          // Inside tag definition -> Prioritize HTML Attributes (class, href, src, id, etc.)
          HTML_ATTRIBUTES.forEach((attr, idx) => {
            const hasDefaultVal = attr.defaultVal !== '';
            const insertSnippet = hasDefaultVal ? `${attr.name}="${attr.defaultVal}"` : attr.name;
            const sortRank = (idx < 5 ? `0${idx}_` : `10_`) + attr.name;

            suggestions.push({
              label: attr.name,
              kind: monaco.languages.CompletionItemKind.Property,
              detail: `[Attr] ${attr.detail}`,
              documentation: `Menyisipkan atribut: ${attr.name}=""`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              insertText: insertSnippet,
              range: range,
              sortText: sortRank
            });
          });
        } else {
          // Outside tag definition -> Suggest HTML Tags
          HTML_TAGS.forEach((t, idx) => {
            // Suggest tag snippet (e.g. typing "div" -> <div>...</div>)
            suggestions.push({
              label: t.tag,
              kind: monaco.languages.CompletionItemKind.Snippet,
              detail: `[HTML Tag] ${t.detail}`,
              documentation: `Tag HTML <${t.tag}>`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              insertText: t.snippet,
              range: range,
              sortText: `01_${t.tag}`
            });

            // Also suggest '<tag' if user just typed '<'
            if (textUntilPos.endsWith('<')) {
              suggestions.push({
                label: `<${t.tag}>`,
                kind: monaco.languages.CompletionItemKind.Snippet,
                detail: `[Tag] <${t.tag}>...</${t.tag}>`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                insertText: `${t.tag}>\n\t$0\n</${t.tag}>`,
                range: range,
                sortText: `00_${t.tag}`
              });
            }
          });
        }

        return { suggestions };
      }
    });
  });
}

/**
 * Sets up listeners on the Monaco editor instance for:
 * 1. Auto-closing HTML tag on '>'
 * 2. Auto-closing matching tag on '</'
 * 3. Auto-inserting '=""' on attribute '='
 * 
 * @param {any} editor Monaco editor instance
 * @param {any} monaco Monaco namespace
 */
export function setupHtmlAutoCloseAndQuotes(editor, monaco) {
  if (!editor || !monaco) return;

  // Track if we are programmatically modifying content to prevent feedback loops
  let isExecutingAutoClose = false;

  const disposable = editor.onDidChangeModelContent((e) => {
    if (isExecutingAutoClose) return;

    const model = editor.getModel();
    if (!model) return;

    const lang = model.getLanguageId();
    if (lang !== 'html' && lang !== 'php' && lang !== 'xml') return;

    if (!e.changes || e.changes.length !== 1) return;
    const change = e.changes[0];

    // =========================================================================
    // 1. AUTO CLOSE TAG WHEN TYPING '>'
    // =========================================================================
    if (change.text === '>') {
      const line = change.range.startLineNumber;
      const col = change.range.startColumn + 1; // position right after '>'

      // Scan backwards up to 25 lines to find the opening '<'
      const startLine = Math.max(1, line - 25);
      const textBefore = model.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: line,
        endColumn: col
      });

      const lastOpenAngle = textBefore.lastIndexOf('<');
      if (lastOpenAngle === -1) return;

      const tagContent = textBefore.substring(lastOpenAngle);

      // Verify that this is an unclosed opening tag ending with '>'
      if (!tagContent.endsWith('>')) return;
      if (tagContent.startsWith('</')) return;       // Closing tag
      if (tagContent.startsWith('<!--')) return;     // Comment
      if (tagContent.startsWith('<!')) return;       // DOCTYPE
      if (tagContent.startsWith('<?')) return;       // Processing instruction / PHP
      if (tagContent.endsWith('/>')) return;         // Self-closing (e.g. <img />)

      // Ensure quotes are balanced (so '>' is not inside an attribute value like title=">")
      const doubleQuotes = (tagContent.match(/"/g) || []).length;
      const singleQuotes = (tagContent.match(/'/g) || []).length;
      if (doubleQuotes % 2 !== 0 || singleQuotes % 2 !== 0) return;

      // Extract tag name: <([a-zA-Z][a-zA-Z0-9-]*)
      const match = tagContent.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!match) return;
      const tagName = match[1];

      // Skip void / self-closing HTML tags
      if (VOID_TAGS.has(tagName.toLowerCase())) return;

      // Check if closing tag is already present immediately after cursor
      const lineMaxCol = model.getLineMaxColumn(line);
      const textAfter = model.getValueInRange({
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: Math.min(lineMaxCol, col + tagName.length + 3)
      });
      if (textAfter.toLowerCase().startsWith(`</${tagName.toLowerCase()}>`)) return;

      // Execute auto-close tag edit
      isExecutingAutoClose = true;
      try {
        const closeTag = `</${tagName}>`;
        editor.executeEdits('html-auto-close-tag', [
          {
            range: new monaco.Range(line, col, line, col),
            text: closeTag,
            forceMoveMarkers: false
          }
        ]);
        // Position cursor between opening and closing tags
        editor.setPosition({ lineNumber: line, column: col });
      } finally {
        isExecutingAutoClose = false;
      }
      return;
    }

    // =========================================================================
    // 2. AUTO COMPLETE CLOSING TAG WHEN TYPING '</'
    // =========================================================================
    if (change.text === '/') {
      const line = change.range.startLineNumber;
      const col = change.range.startColumn + 1;

      // Check if preceding two characters are '</'
      if (col >= 3) {
        const charBefore = model.getValueInRange({
          startLineNumber: line,
          startColumn: col - 2,
          endLineNumber: line,
          endColumn: col
        });

        if (charBefore === '</') {
          // Scan backwards to find the nearest unmatched opening tag
          const textBefore = model.getValueInRange({
            startLineNumber: Math.max(1, line - 50),
            startColumn: 1,
            endLineNumber: line,
            endColumn: col - 2
          });

          // Match tags backwards
          const tagRegex = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)(?:\s+[^>]*)?(\/)?>/g;
          const openTags = [];
          let m;
          while ((m = tagRegex.exec(textBefore)) !== null) {
            const isClosing = Boolean(m[1]);
            const isSelfClose = Boolean(m[3]);
            const name = m[2];

            if (isSelfClose || VOID_TAGS.has(name.toLowerCase())) continue;

            if (isClosing) {
              if (openTags.length > 0 && openTags[openTags.length - 1].toLowerCase() === name.toLowerCase()) {
                openTags.pop();
              }
            } else {
              openTags.push(name);
            }
          }

          if (openTags.length > 0) {
            const lastUnclosedTag = openTags[openTags.length - 1];
            isExecutingAutoClose = true;
            try {
              editor.executeEdits('html-auto-close-slash', [
                {
                  range: new monaco.Range(line, col, line, col),
                  text: `${lastUnclosedTag}>`,
                  forceMoveMarkers: false
                }
              ]);
              editor.setPosition({ lineNumber: line, column: col + lastUnclosedTag.length + 1 });
            } finally {
              isExecutingAutoClose = false;
            }
            return;
          }
        }
      }
    }

    // =========================================================================
    // 3. AUTO INSERT ="" ON ATTRIBUTES WHEN TYPING '='
    // =========================================================================
    if (change.text === '=') {
      const line = change.range.startLineNumber;
      const col = change.range.startColumn + 1; // position right after '='

      // Check line text before '='
      const lineTextBefore = model.getValueInRange({
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: col
      });

      // Verify that this is inside an opening tag: has '<' and no '>' between '<' and '='
      const lastOpenAngle = lineTextBefore.lastIndexOf('<');
      const lastCloseAngle = lineTextBefore.lastIndexOf('>');
      const isInsideTag = lastOpenAngle !== -1 && lastOpenAngle > lastCloseAngle;

      if (!isInsideTag) return;

      // Verify that text immediately preceding '=' is an attribute name (e.g. class=, href=, etc.)
      const attrMatch = lineTextBefore.match(/\b([a-zA-Z0-9-:]+)=$/);
      if (!attrMatch) return;

      // Check what follows the '='
      const lineMaxCol = model.getLineMaxColumn(line);
      const nextChar = col <= lineMaxCol ? model.getValueInRange({
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: col + 1
      }) : '';

      // If quotes already exist right after '=', don't insert duplicate quotes
      if (nextChar === '"' || nextChar === "'") return;

      isExecutingAutoClose = true;
      try {
        editor.executeEdits('html-auto-quote-attr', [
          {
            range: new monaco.Range(line, col, line, col),
            text: '""',
            forceMoveMarkers: false
          }
        ]);
        // Position cursor directly between the quotes: class="|"
        editor.setPosition({ lineNumber: line, column: col + 1 });
      } finally {
        isExecutingAutoClose = false;
      }
    }
  });

  return disposable;
}
