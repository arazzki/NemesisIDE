/**
 * syntaxSuggestions.js
 * Comprehensive Syntax Suggestions & Autocomplete for Nemesis IDE
 * Provides rich IntelliSense-like suggestions across CSS, Java, Python, JS/TS, C/C++, PHP, SQL, Go, Rust, Dart, and Shell.
 */

export const syntaxSuggestions = {
  // =========================================================================
  // CSS, SCSS, LESS
  // =========================================================================
  css: [
    // Colors & Backgrounds
    {
      label: 'color',
      kind: 'Property',
      detail: 'CSS: color: #value',
      documentation: 'Sets the color of text',
      insertText: 'color: ${1:#000000};',
      filterText: 'color text-color textColor col'
    },
    {
      label: 'background',
      kind: 'Property',
      detail: 'CSS: background: value',
      documentation: 'Shorthand property for all background properties',
      insertText: 'background: ${1:#ffffff};',
      filterText: 'background bg'
    },
    {
      label: 'background-color',
      kind: 'Property',
      detail: 'CSS: background-color: #value',
      documentation: 'Sets the background color of an element',
      insertText: 'background-color: ${1:#ffffff};',
      filterText: 'background-color color-background bgc bgcolor backgroundcolor col'
    },
    {
      label: 'background-image',
      kind: 'Property',
      detail: 'CSS: background-image: url(...)',
      documentation: 'Sets one or more background images on an element',
      insertText: "background-image: url('${1:image.png}');",
      filterText: 'background-image bgi bgimage url'
    },
    {
      label: 'background-size',
      kind: 'Property',
      detail: 'CSS: background-size: cover | contain',
      documentation: 'Specifies the size of the background images',
      insertText: 'background-size: ${1|cover,contain,auto,100% 100%|};',
      filterText: 'background-size bgs'
    },
    {
      label: 'background-position',
      kind: 'Property',
      detail: 'CSS: background-position: center',
      documentation: 'Sets the initial position for each background image',
      insertText: 'background-position: ${1|center,top,bottom,left,right|};',
      filterText: 'background-position bgp'
    },
    {
      label: 'background-repeat',
      kind: 'Property',
      detail: 'CSS: background-repeat: no-repeat',
      documentation: 'Sets how background images are repeated',
      insertText: 'background-repeat: ${1|no-repeat,repeat,repeat-x,repeat-y|};',
      filterText: 'background-repeat bgr'
    },
    {
      label: 'color-scheme',
      kind: 'Property',
      detail: 'CSS: color-scheme: dark | light',
      documentation: 'Specifies the operating system color scheme support',
      insertText: 'color-scheme: ${1|dark,light,dark light|};',
      filterText: 'color-scheme colorscheme col'
    },
    {
      label: 'accent-color',
      kind: 'Property',
      detail: 'CSS: accent-color: #color',
      documentation: 'Specifies the accent color for user-interface controls',
      insertText: 'accent-color: ${1:#2563eb};',
      filterText: 'accent-color accent col'
    },
    {
      label: 'caret-color',
      kind: 'Property',
      detail: 'CSS: caret-color: #color',
      documentation: 'Specifies the color of the insertion cursor in text inputs',
      insertText: 'caret-color: ${1:#000000};',
      filterText: 'caret-color cursor-color col'
    },

    // Column Properties
    {
      label: 'column-count',
      kind: 'Property',
      detail: 'CSS: column-count: number',
      documentation: 'Breaks an element content into the specified number of columns',
      insertText: 'column-count: ${1:2};',
      filterText: 'column-count colcount columns col'
    },
    {
      label: 'column-gap',
      kind: 'Property',
      detail: 'CSS: column-gap: length',
      documentation: 'Sets the size of the gap between element columns',
      insertText: 'column-gap: ${1:1.5rem};',
      filterText: 'column-gap colgap gap col'
    },
    {
      label: 'column-rule',
      kind: 'Property',
      detail: 'CSS: column-rule: 1px solid #ccc',
      documentation: 'Sets the width, style, and color of the rule between columns',
      insertText: 'column-rule: ${1:1px solid #e5e7eb};',
      filterText: 'column-rule colrule col'
    },
    {
      label: 'column-width',
      kind: 'Property',
      detail: 'CSS: column-width: length',
      documentation: 'Sets the minimum column width in multi-column layout',
      insertText: 'column-width: ${1:250px};',
      filterText: 'column-width colwidth col'
    },
    {
      label: 'columns',
      kind: 'Property',
      detail: 'CSS: columns: count width',
      documentation: 'Shorthand property for column-width and column-count',
      insertText: 'columns: ${1:2 250px};',
      filterText: 'columns col'
    },

    // Display & Flexbox
    {
      label: 'display',
      kind: 'Property',
      detail: 'CSS: display: flex | grid | block | none',
      documentation: 'Sets whether an element is treated as a block or inline box and its layout',
      insertText: 'display: ${1|flex,grid,block,inline-block,inline,none,inline-flex,inline-grid|};',
      filterText: 'display disp d'
    },
    {
      label: 'display-flex',
      kind: 'Snippet',
      detail: 'display: flex;',
      documentation: 'Quick display flex declaration',
      insertText: 'display: flex;',
      filterText: 'dflex flex d:f'
    },
    {
      label: 'display-grid',
      kind: 'Snippet',
      detail: 'display: grid;',
      documentation: 'Quick display grid declaration',
      insertText: 'display: grid;',
      filterText: 'dgrid grid d:g'
    },
    {
      label: 'display-block',
      kind: 'Snippet',
      detail: 'display: block;',
      documentation: 'Quick display block declaration',
      insertText: 'display: block;',
      filterText: 'dblock block d:b'
    },
    {
      label: 'display-none',
      kind: 'Snippet',
      detail: 'display: none;',
      documentation: 'Hides an element from display',
      insertText: 'display: none;',
      filterText: 'dnone none hidden d:n'
    },
    {
      label: 'flex',
      kind: 'Property',
      detail: 'CSS: flex: grow shrink basis',
      documentation: 'Shorthand for flex-grow, flex-shrink and flex-basis',
      insertText: 'flex: ${1:1};',
      filterText: 'flex'
    },
    {
      label: 'flex-direction',
      kind: 'Property',
      detail: 'CSS: flex-direction: row | column',
      documentation: 'Sets how flex items are placed in the flex container',
      insertText: 'flex-direction: ${1|row,column,row-reverse,column-reverse|};',
      filterText: 'flex-direction fld fdir direction'
    },
    {
      label: 'flex-wrap',
      kind: 'Property',
      detail: 'CSS: flex-wrap: wrap | nowrap',
      documentation: 'Sets whether flex items are forced onto one line or can wrap',
      insertText: 'flex-wrap: ${1|wrap,nowrap,wrap-reverse|};',
      filterText: 'flex-wrap flw wrap'
    },
    {
      label: 'justify-content',
      kind: 'Property',
      detail: 'CSS: justify-content: center | space-between',
      documentation: 'Defines how the browser distributes space between and around content items along the main axis',
      insertText: 'justify-content: ${1|center,space-between,space-around,space-evenly,flex-start,flex-end|};',
      filterText: 'justify-content jc justify jcontent'
    },
    {
      label: 'justify-items',
      kind: 'Property',
      detail: 'CSS: justify-items: center',
      documentation: 'Defines default justify-self for all items in a grid container',
      insertText: 'justify-items: ${1|center,start,end,stretch|};',
      filterText: 'justify-items ji'
    },
    {
      label: 'align-items',
      kind: 'Property',
      detail: 'CSS: align-items: center | stretch',
      documentation: 'Sets the align-self value on all direct children as a group',
      insertText: 'align-items: ${1|center,flex-start,flex-end,stretch,baseline|};',
      filterText: 'align-items ai align aitems'
    },
    {
      label: 'align-content',
      kind: 'Property',
      detail: 'CSS: align-content: center',
      documentation: 'Sets the distribution of space between and around content items along a flexbox cross-axis',
      insertText: 'align-content: ${1|center,space-between,space-around,stretch|};',
      filterText: 'align-content ac'
    },
    {
      label: 'align-self',
      kind: 'Property',
      detail: 'CSS: align-self: center',
      documentation: 'Overrides align-items value on an individual flex/grid item',
      insertText: 'align-self: ${1|center,flex-start,flex-end,stretch,auto|};',
      filterText: 'align-self as'
    },
    {
      label: 'gap',
      kind: 'Property',
      detail: 'CSS: gap: length',
      documentation: 'Sets the gaps (gutters) between rows and columns in flex and grid layouts',
      insertText: 'gap: ${1:1rem};',
      filterText: 'gap spacing space'
    },
    {
      label: 'row-gap',
      kind: 'Property',
      detail: 'CSS: row-gap: length',
      documentation: 'Sets the gap between element grid rows',
      insertText: 'row-gap: ${1:1rem};',
      filterText: 'row-gap rgap'
    },

    // Grid Properties
    {
      label: 'grid-template-columns',
      kind: 'Property',
      detail: 'CSS: grid-template-columns: repeat(3, 1fr)',
      documentation: 'Defines the line names and track sizing functions of the grid columns',
      insertText: 'grid-template-columns: ${1:repeat(3, 1fr)};',
      filterText: 'grid-template-columns gtc columns grid'
    },
    {
      label: 'grid-template-rows',
      kind: 'Property',
      detail: 'CSS: grid-template-rows: auto',
      documentation: 'Defines the line names and track sizing functions of the grid rows',
      insertText: 'grid-template-rows: ${1:auto};',
      filterText: 'grid-template-rows gtr rows grid'
    },
    {
      label: 'grid-column',
      kind: 'Property',
      detail: 'CSS: grid-column: 1 / -1',
      documentation: 'Shorthand property for grid-column-start and grid-column-end',
      insertText: 'grid-column: ${1:1 / -1};',
      filterText: 'grid-column gc span'
    },
    {
      label: 'grid-row',
      kind: 'Property',
      detail: 'CSS: grid-row: 1 / 3',
      documentation: 'Shorthand property for grid-row-start and grid-row-end',
      insertText: 'grid-row: ${1:1};',
      filterText: 'grid-row gr'
    },

    // Sizing & Box Model
    {
      label: 'width',
      kind: 'Property',
      detail: 'CSS: width: length | %',
      documentation: 'Sets an element width',
      insertText: 'width: ${1:100%};',
      filterText: 'width w'
    },
    {
      label: 'height',
      kind: 'Property',
      detail: 'CSS: height: length | %',
      documentation: 'Sets an element height',
      insertText: 'height: ${1:100%};',
      filterText: 'height h'
    },
    {
      label: 'min-width',
      kind: 'Property',
      detail: 'CSS: min-width: length',
      documentation: 'Sets the minimum width of an element',
      insertText: 'min-width: ${1:0};',
      filterText: 'min-width minw'
    },
    {
      label: 'max-width',
      kind: 'Property',
      detail: 'CSS: max-width: length',
      documentation: 'Sets the maximum width of an element',
      insertText: 'max-width: ${1:100%};',
      filterText: 'max-width maxw'
    },
    {
      label: 'min-height',
      kind: 'Property',
      detail: 'CSS: min-height: length',
      documentation: 'Sets the minimum height of an element',
      insertText: 'min-height: ${1:100vh};',
      filterText: 'min-height minh'
    },
    {
      label: 'max-height',
      kind: 'Property',
      detail: 'CSS: max-height: length',
      documentation: 'Sets the maximum height of an element',
      insertText: 'max-height: ${1:100%};',
      filterText: 'max-height maxh'
    },
    {
      label: 'box-sizing',
      kind: 'Property',
      detail: 'CSS: box-sizing: border-box',
      documentation: 'Sets how the total width and height of an element is calculated',
      insertText: 'box-sizing: ${1|border-box,content-box|};',
      filterText: 'box-sizing bsz border-box'
    },
    {
      label: 'aspect-ratio',
      kind: 'Property',
      detail: 'CSS: aspect-ratio: 16 / 9',
      documentation: 'Sets a preferred aspect ratio for the box',
      insertText: 'aspect-ratio: ${1:16 / 9};',
      filterText: 'aspect-ratio ratio'
    },

    // Spacing (Margin & Padding)
    {
      label: 'margin',
      kind: 'Property',
      detail: 'CSS: margin: 0',
      documentation: 'Sets the margin area on all four sides of an element',
      insertText: 'margin: ${1:0};',
      filterText: 'margin m'
    },
    {
      label: 'margin-top',
      kind: 'Property',
      detail: 'CSS: margin-top: length',
      documentation: 'Sets the margin area on the top of an element',
      insertText: 'margin-top: ${1:1rem};',
      filterText: 'margin-top mt'
    },
    {
      label: 'margin-bottom',
      kind: 'Property',
      detail: 'CSS: margin-bottom: length',
      documentation: 'Sets the margin area on the bottom of an element',
      insertText: 'margin-bottom: ${1:1rem};',
      filterText: 'margin-bottom mb'
    },
    {
      label: 'margin-left',
      kind: 'Property',
      detail: 'CSS: margin-left: length',
      documentation: 'Sets the margin area on the left of an element',
      insertText: 'margin-left: ${1:1rem};',
      filterText: 'margin-left ml'
    },
    {
      label: 'margin-right',
      kind: 'Property',
      detail: 'CSS: margin-right: length',
      documentation: 'Sets the margin area on the right of an element',
      insertText: 'margin-right: ${1:1rem};',
      filterText: 'margin-right mr'
    },
    {
      label: 'margin-auto',
      kind: 'Snippet',
      detail: 'margin: 0 auto;',
      documentation: 'Centers a block element horizontally',
      insertText: 'margin: 0 auto;',
      filterText: 'mauto center margin auto mx-auto'
    },
    {
      label: 'padding',
      kind: 'Property',
      detail: 'CSS: padding: 1rem',
      documentation: 'Sets the padding area on all four sides of an element',
      insertText: 'padding: ${1:1rem};',
      filterText: 'padding p'
    },
    {
      label: 'padding-top',
      kind: 'Property',
      detail: 'CSS: padding-top: length',
      documentation: 'Sets the padding area on the top of an element',
      insertText: 'padding-top: ${1:1rem};',
      filterText: 'padding-top pt'
    },
    {
      label: 'padding-bottom',
      kind: 'Property',
      detail: 'CSS: padding-bottom: length',
      documentation: 'Sets the padding area on the bottom of an element',
      insertText: 'padding-bottom: ${1:1rem};',
      filterText: 'padding-bottom pb'
    },
    {
      label: 'padding-left',
      kind: 'Property',
      detail: 'CSS: padding-left: length',
      documentation: 'Sets the padding area on the left of an element',
      insertText: 'padding-left: ${1:1rem};',
      filterText: 'padding-left pl'
    },
    {
      label: 'padding-right',
      kind: 'Property',
      detail: 'CSS: padding-right: length',
      documentation: 'Sets the padding area on the right of an element',
      insertText: 'padding-right: ${1:1rem};',
      filterText: 'padding-right pr'
    },

    // Borders & Shadows
    {
      label: 'border',
      kind: 'Property',
      detail: 'CSS: border: 1px solid #ccc',
      documentation: 'Sets width, style, and color of all four borders of an element',
      insertText: 'border: ${1:1px solid #e5e7eb};',
      filterText: 'border bd'
    },
    {
      label: 'border-radius',
      kind: 'Property',
      detail: 'CSS: border-radius: 0.5rem',
      documentation: 'Rounds the corners of an element outer border edge',
      insertText: 'border-radius: ${1:0.5rem};',
      filterText: 'border-radius br rounded radius'
    },
    {
      label: 'border-color',
      kind: 'Property',
      detail: 'CSS: border-color: #color',
      documentation: 'Sets the color of all four borders of an element',
      insertText: 'border-color: ${1:#e5e7eb};',
      filterText: 'border-color bdc col'
    },
    {
      label: 'border-top',
      kind: 'Property',
      detail: 'CSS: border-top: 1px solid #ccc',
      documentation: 'Sets the border on the top of an element',
      insertText: 'border-top: ${1:1px solid #e5e7eb};',
      filterText: 'border-top bdt'
    },
    {
      label: 'border-bottom',
      kind: 'Property',
      detail: 'CSS: border-bottom: 1px solid #ccc',
      documentation: 'Sets the border on the bottom of an element',
      insertText: 'border-bottom: ${1:1px solid #e5e7eb};',
      filterText: 'border-bottom bdb'
    },
    {
      label: 'box-shadow',
      kind: 'Property',
      detail: 'CSS: box-shadow: 0 4px 6px rgba(...)',
      documentation: 'Adds shadow effects around an element frame',
      insertText: 'box-shadow: ${1:0 4px 6px -1px rgba(0, 0, 0, 0.1)};',
      filterText: 'box-shadow bsh shadow'
    },
    {
      label: 'outline',
      kind: 'Property',
      detail: 'CSS: outline: none',
      documentation: 'Sets the outline drawn outside the border edge',
      insertText: 'outline: ${1:none};',
      filterText: 'outline out'
    },

    // Positioning
    {
      label: 'position',
      kind: 'Property',
      detail: 'CSS: position: relative | absolute | fixed | sticky',
      documentation: 'Sets how an element is positioned in a document',
      insertText: 'position: ${1|relative,absolute,fixed,sticky,static|};',
      filterText: 'position pos'
    },
    {
      label: 'top',
      kind: 'Property',
      detail: 'CSS: top: 0',
      documentation: 'Vertical position of a positioned element',
      insertText: 'top: ${1:0};',
      filterText: 'top'
    },
    {
      label: 'bottom',
      kind: 'Property',
      detail: 'CSS: bottom: 0',
      documentation: 'Bottom position of a positioned element',
      insertText: 'bottom: ${1:0};',
      filterText: 'bottom'
    },
    {
      label: 'left',
      kind: 'Property',
      detail: 'CSS: left: 0',
      documentation: 'Horizontal left position of a positioned element',
      insertText: 'left: ${1:0};',
      filterText: 'left'
    },
    {
      label: 'right',
      kind: 'Property',
      detail: 'CSS: right: 0',
      documentation: 'Horizontal right position of a positioned element',
      insertText: 'right: ${1:0};',
      filterText: 'right'
    },
    {
      label: 'inset',
      kind: 'Property',
      detail: 'CSS: inset: 0',
      documentation: 'Shorthand for top, right, bottom, and left',
      insertText: 'inset: ${1:0};',
      filterText: 'inset'
    },
    {
      label: 'z-index',
      kind: 'Property',
      detail: 'CSS: z-index: number',
      documentation: 'Sets the z-order of a positioned element',
      insertText: 'z-index: ${1:10};',
      filterText: 'z-index zindex z'
    },

    // Typography
    {
      label: 'font-size',
      kind: 'Property',
      detail: 'CSS: font-size: 1rem',
      documentation: 'Sets the size of the font',
      insertText: 'font-size: ${1:1rem};',
      filterText: 'font-size fsz fs font'
    },
    {
      label: 'font-family',
      kind: 'Property',
      detail: 'CSS: font-family: font-name',
      documentation: 'Specifies a prioritized list of font family names',
      insertText: "font-family: ${1:'Inter', system-ui, -apple-system, sans-serif};",
      filterText: 'font-family ff font'
    },
    {
      label: 'font-weight',
      kind: 'Property',
      detail: 'CSS: font-weight: bold | 600',
      documentation: 'Sets the weight (boldness) of the font',
      insertText: 'font-weight: ${1|bold,normal,600,700,500,400|};',
      filterText: 'font-weight fw bold font'
    },
    {
      label: 'line-height',
      kind: 'Property',
      detail: 'CSS: line-height: 1.5',
      documentation: 'Sets the distance between lines of text',
      insertText: 'line-height: ${1:1.5};',
      filterText: 'line-height lh'
    },
    {
      label: 'text-align',
      kind: 'Property',
      detail: 'CSS: text-align: center | left | right',
      documentation: 'Sets horizontal alignment of inline content in a block',
      insertText: 'text-align: ${1|center,left,right,justify|};',
      filterText: 'text-align ta align text'
    },
    {
      label: 'text-decoration',
      kind: 'Property',
      detail: 'CSS: text-decoration: none | underline',
      documentation: 'Sets the appearance of decorative lines on text',
      insertText: 'text-decoration: ${1|none,underline,line-through|};',
      filterText: 'text-decoration td underline text'
    },
    {
      label: 'text-transform',
      kind: 'Property',
      detail: 'CSS: text-transform: uppercase | capitalize',
      documentation: 'Specifies how to capitalize an element text',
      insertText: 'text-transform: ${1|uppercase,lowercase,capitalize,none|};',
      filterText: 'text-transform tt uppercase text'
    },
    {
      label: 'text-overflow',
      kind: 'Property',
      detail: 'CSS: text-overflow: ellipsis',
      documentation: 'Sets how hidden overflow content is signaled to users',
      insertText: 'text-overflow: ${1|ellipsis,clip|};',
      filterText: 'text-overflow to ellipsis text'
    },
    {
      label: 'white-space',
      kind: 'Property',
      detail: 'CSS: white-space: nowrap',
      documentation: 'Sets how white space inside an element is handled',
      insertText: 'white-space: ${1|nowrap,pre,pre-wrap,normal|};',
      filterText: 'white-space ws nowrap'
    },

    // Effects & Transitions
    {
      label: 'opacity',
      kind: 'Property',
      detail: 'CSS: opacity: 0.8',
      documentation: 'Sets the transparency of an element',
      insertText: 'opacity: ${1:0.8};',
      filterText: 'opacity op transparent'
    },
    {
      label: 'overflow',
      kind: 'Property',
      detail: 'CSS: overflow: hidden | auto | scroll',
      documentation: 'Sets the desired behavior for an element overflow',
      insertText: 'overflow: ${1|hidden,auto,scroll,visible|};',
      filterText: 'overflow ov scroll'
    },
    {
      label: 'cursor',
      kind: 'Property',
      detail: 'CSS: cursor: pointer',
      documentation: 'Sets the mouse cursor to display when mouse pointer is over an element',
      insertText: 'cursor: ${1|pointer,default,not-allowed,grab|};',
      filterText: 'cursor cur pointer'
    },
    {
      label: 'transition',
      kind: 'Property',
      detail: 'CSS: transition: all 0.3s ease',
      documentation: 'Shorthand property for transition properties',
      insertText: 'transition: ${1:all 0.3s ease-in-out};',
      filterText: 'transition tr ease'
    },
    {
      label: 'transform',
      kind: 'Property',
      detail: 'CSS: transform: scale(...) | translate(...)',
      documentation: 'Rotates, scales, skews, or translates an element',
      insertText: 'transform: ${1|scale(1.05),translate(-50%, -50%),rotate(45deg)|};',
      filterText: 'transform tf scale translate'
    },
    {
      label: 'animation',
      kind: 'Property',
      detail: 'CSS: animation: name duration ease infinite',
      documentation: 'Applies an animation between CSS styles',
      insertText: 'animation: ${1:fadeIn} ${2:0.3s} ${3:ease} ${4:forwards};',
      filterText: 'animation anim'
    },

    // At-Rules
    {
      label: '@media',
      kind: 'Snippet',
      detail: '@media (max-width: ...)',
      documentation: 'Responsive CSS Media Query',
      insertText: '@media (max-width: ${1:768px}) {\n\t${2}\n}',
      filterText: '@media media query responsive mobile'
    },
    {
      label: '@keyframes',
      kind: 'Snippet',
      detail: '@keyframes name { ... }',
      documentation: 'CSS Keyframe Animation Definition',
      insertText: '@keyframes ${1:animationName} {\n\t0% {\n\t\t${2:opacity: 0;}\n\t}\n\t100% {\n\t\t${3:opacity: 1;}\n\t}\n}',
      filterText: '@keyframes keyframes animation'
    }
  ],

  // =========================================================================
  // JAVA
  // =========================================================================
  java: [
    // Collections & Frameworks
    {
      label: 'ArrayList',
      kind: 'Class',
      detail: 'ArrayList<Type> list = new ArrayList<>();',
      documentation: 'Resizable-array implementation of the List interface (java.util.ArrayList)',
      insertText: 'ArrayList<${1:String}> ${2:list} = new ArrayList<>();',
      filterText: 'ArrayList arraylist list List'
    },
    {
      label: 'List',
      kind: 'Interface',
      detail: 'List<Type> list = new ArrayList<>();',
      documentation: 'Ordered collection (java.util.List)',
      insertText: 'List<${1:String}> ${2:list} = new ArrayList<>();',
      filterText: 'List list arraylist'
    },
    {
      label: 'HashMap',
      kind: 'Class',
      detail: 'HashMap<K, V> map = new HashMap<>();',
      documentation: 'Hash table based implementation of the Map interface (java.util.HashMap)',
      insertText: 'HashMap<${1:String}, ${2:Object}> ${3:map} = new HashMap<>();',
      filterText: 'HashMap hashmap map Map'
    },
    {
      label: 'Map',
      kind: 'Interface',
      detail: 'Map<K, V> map = new HashMap<>();',
      documentation: 'Object that maps keys to values (java.util.Map)',
      insertText: 'Map<${1:String}, ${2:Object}> ${3:map} = new HashMap<>();',
      filterText: 'Map map hashmap'
    },
    {
      label: 'HashSet',
      kind: 'Class',
      detail: 'HashSet<Type> set = new HashSet<>();',
      documentation: 'Set collection backed by a hash table (java.util.HashSet)',
      insertText: 'HashSet<${1:String}> ${2:set} = new HashSet<>();',
      filterText: 'HashSet hashset set Set'
    },
    {
      label: 'Set',
      kind: 'Interface',
      detail: 'Set<Type> set = new HashSet<>();',
      documentation: 'Collection that contains no duplicate elements (java.util.Set)',
      insertText: 'Set<${1:String}> ${2:set} = new HashSet<>();',
      filterText: 'Set set hashset'
    },
    {
      label: 'LinkedList',
      kind: 'Class',
      detail: 'LinkedList<Type> list = new LinkedList<>();',
      documentation: 'Doubly-linked list implementation of the List and Deque interfaces (java.util.LinkedList)',
      insertText: 'LinkedList<${1:String}> ${2:list} = new LinkedList<>();',
      filterText: 'LinkedList linkedlist'
    },
    {
      label: 'Scanner',
      kind: 'Class',
      detail: 'Scanner scanner = new Scanner(System.in);',
      documentation: 'Simple text scanner for console input (java.util.Scanner)',
      insertText: 'Scanner ${1:scanner} = new Scanner(System.in);',
      filterText: 'Scanner scanner scan sc System.in'
    },
    {
      label: 'StringBuilder',
      kind: 'Class',
      detail: 'StringBuilder sb = new StringBuilder();',
      documentation: 'A mutable sequence of characters (java.lang.StringBuilder)',
      insertText: 'StringBuilder ${1:sb} = new StringBuilder();',
      filterText: 'StringBuilder stringbuilder sb'
    },
    {
      label: 'Arrays',
      kind: 'Class',
      detail: 'Arrays.toString(array)',
      documentation: 'Utility methods for manipulating arrays (java.util.Arrays)',
      insertText: 'Arrays.toString(${1:arr})',
      filterText: 'Arrays arrays'
    },
    {
      label: 'Collections',
      kind: 'Class',
      detail: 'Collections.sort(list);',
      documentation: 'Utility methods for collections (java.util.Collections)',
      insertText: 'Collections.sort(${1:list});',
      filterText: 'Collections collections sort'
    },
    {
      label: 'Math',
      kind: 'Class',
      detail: 'Math.max(a, b)',
      documentation: 'Basic numeric mathematical functions (java.lang.Math)',
      insertText: 'Math.${1|max,min,sqrt,pow,abs,random,round,floor,ceil|}(${2});',
      filterText: 'Math math'
    },
    {
      label: 'System',
      kind: 'Class',
      detail: 'System.out.println(...)',
      documentation: 'Provides standard input, output, and error streams',
      insertText: 'System.out.println(${1});',
      filterText: 'System system sout'
    },

    // Java Imports
    {
      label: 'import java.util.*',
      kind: 'Module',
      detail: 'import java.util.*;',
      documentation: 'Imports all Java Utility classes (ArrayList, List, Scanner, HashMap, etc.)',
      insertText: 'import java.util.*;',
      filterText: 'import java.util.* util arraylist list scanner map collections'
    },
    {
      label: 'import java.util.ArrayList',
      kind: 'Module',
      detail: 'import java.util.ArrayList;',
      documentation: 'Imports java.util.ArrayList class',
      insertText: 'import java.util.ArrayList;',
      filterText: 'import java.util.ArrayList ArrayList arraylist'
    },
    {
      label: 'import java.util.List',
      kind: 'Module',
      detail: 'import java.util.List;',
      documentation: 'Imports java.util.List interface',
      insertText: 'import java.util.List;',
      filterText: 'import java.util.List List list'
    },
    {
      label: 'import java.util.Scanner',
      kind: 'Module',
      detail: 'import java.util.Scanner;',
      documentation: 'Imports java.util.Scanner class for console input',
      insertText: 'import java.util.Scanner;',
      filterText: 'import java.util.Scanner Scanner scanner'
    },
    {
      label: 'import java.util.HashMap',
      kind: 'Module',
      detail: 'import java.util.HashMap;',
      documentation: 'Imports java.util.HashMap class',
      insertText: 'import java.util.HashMap;',
      filterText: 'import java.util.HashMap HashMap hashmap'
    },
    {
      label: 'import java.io.*',
      kind: 'Module',
      detail: 'import java.io.*;',
      documentation: 'Imports Java I/O classes (File, BufferedReader, etc.)',
      insertText: 'import java.io.*;',
      filterText: 'import java.io.* io file'
    },

    // Method Calls & APIs
    {
      label: 'System.out.println',
      kind: 'Method',
      detail: 'System.out.println(...)',
      documentation: 'Prints argument to console output followed by a newline',
      insertText: 'System.out.println(${1});',
      filterText: 'System.out.println sout println print'
    },
    {
      label: 'System.out.print',
      kind: 'Method',
      detail: 'System.out.print(...)',
      documentation: 'Prints argument to console output without a newline',
      insertText: 'System.out.print(${1});',
      filterText: 'System.out.print print'
    },
    {
      label: 'System.out.printf',
      kind: 'Method',
      detail: 'System.out.printf("format", args)',
      documentation: 'Prints formatted string to console output',
      insertText: 'System.out.printf("${1:%s}\\n", ${2});',
      filterText: 'System.out.printf printf format'
    },
    {
      label: 'add()',
      kind: 'Method',
      detail: '.add(element)',
      documentation: 'Appends the specified element to the end of the collection',
      insertText: 'add(${1:element});',
      filterText: 'add append'
    },
    {
      label: 'get()',
      kind: 'Method',
      detail: '.get(index)',
      documentation: 'Returns the element at the specified position in this list',
      insertText: 'get(${1:index})',
      filterText: 'get'
    },
    {
      label: 'set()',
      kind: 'Method',
      detail: '.set(index, element)',
      documentation: 'Replaces the element at the specified position',
      insertText: 'set(${1:index}, ${2:element});',
      filterText: 'set'
    },
    {
      label: 'remove()',
      kind: 'Method',
      detail: '.remove(index / object)',
      documentation: 'Removes the element at the specified position or the specified object',
      insertText: 'remove(${1:index});',
      filterText: 'remove delete'
    },
    {
      label: 'size()',
      kind: 'Method',
      detail: '.size()',
      documentation: 'Returns the number of elements in this collection',
      insertText: 'size()',
      filterText: 'size count length'
    },
    {
      label: 'contains()',
      kind: 'Method',
      detail: '.contains(object)',
      documentation: 'Returns true if this collection contains the specified element',
      insertText: 'contains(${1:element})',
      filterText: 'contains has'
    },
    {
      label: 'isEmpty()',
      kind: 'Method',
      detail: '.isEmpty()',
      documentation: 'Returns true if this collection contains no elements',
      insertText: 'isEmpty()',
      filterText: 'isEmpty empty'
    },
    {
      label: 'clear()',
      kind: 'Method',
      detail: '.clear()',
      documentation: 'Removes all of the elements from this collection',
      insertText: 'clear();',
      filterText: 'clear reset'
    },
    {
      label: 'length()',
      kind: 'Method',
      detail: '.length()',
      documentation: 'Returns the length of this string',
      insertText: 'length()',
      filterText: 'length len'
    },
    {
      label: 'charAt()',
      kind: 'Method',
      detail: '.charAt(index)',
      documentation: 'Returns the char value at the specified index',
      insertText: 'charAt(${1:index})',
      filterText: 'charAt'
    },
    {
      label: 'substring()',
      kind: 'Method',
      detail: '.substring(beginIndex, endIndex)',
      documentation: 'Returns a substring of this string',
      insertText: 'substring(${1:beginIndex}${2:, endIndex})',
      filterText: 'substring sub'
    },
    {
      label: 'equals()',
      kind: 'Method',
      detail: '.equals(other)',
      documentation: 'Compares this object to the specified object for equality',
      insertText: 'equals(${1:other})',
      filterText: 'equals eq'
    },
    {
      label: 'equalsIgnoreCase()',
      kind: 'Method',
      detail: '.equalsIgnoreCase(other)',
      documentation: 'Compares this String to another String, ignoring case considerations',
      insertText: 'equalsIgnoreCase(${1:other})',
      filterText: 'equalsIgnoreCase'
    },
    {
      label: 'toString()',
      kind: 'Method',
      detail: '.toString()',
      documentation: 'Returns a string representation of the object',
      insertText: 'toString()',
      filterText: 'toString tostring'
    },
    {
      label: 'Integer.parseInt',
      kind: 'Method',
      detail: 'Integer.parseInt(string)',
      documentation: 'Parses the string argument as a signed decimal integer',
      insertText: 'Integer.parseInt(${1:str})',
      filterText: 'Integer.parseInt parseInt parse'
    },
    {
      label: 'Double.parseDouble',
      kind: 'Method',
      detail: 'Double.parseDouble(string)',
      documentation: 'Parses the string argument as a double value',
      insertText: 'Double.parseDouble(${1:str})',
      filterText: 'Double.parseDouble parseDouble parse'
    },
    {
      label: 'String.valueOf',
      kind: 'Method',
      detail: 'String.valueOf(val)',
      documentation: 'Returns the string representation of the argument',
      insertText: 'String.valueOf(${1:val})',
      filterText: 'String.valueOf valueOf'
    },
    {
      label: 'nextLine()',
      kind: 'Method',
      detail: 'scanner.nextLine()',
      documentation: 'Advances this scanner past the current line and returns the input',
      insertText: 'nextLine()',
      filterText: 'nextLine readLine input'
    },
    {
      label: 'nextInt()',
      kind: 'Method',
      detail: 'scanner.nextInt()',
      documentation: 'Scans the next token of the input as an int',
      insertText: 'nextInt()',
      filterText: 'nextInt'
    },

    // Keywords & Declarations
    {
      label: 'public static void main',
      kind: 'Snippet',
      detail: 'public static void main(String[] args)',
      documentation: 'Standard Java main method entry point',
      insertText: 'public static void main(String[] args) {\n\t${1}\n}',
      filterText: 'main psvm public static void main'
    },
    {
      label: 'public class',
      kind: 'Keyword',
      detail: 'public class Name { ... }',
      documentation: 'Declares a public Java class',
      insertText: 'public class ${1:ClassName} {\n\t${2}\n}',
      filterText: 'class public class'
    },
    {
      label: 'public interface',
      kind: 'Keyword',
      detail: 'public interface Name { ... }',
      documentation: 'Declares a Java interface',
      insertText: 'public interface ${1:InterfaceName} {\n\t${2}\n}',
      filterText: 'interface public interface'
    },
    {
      label: '@Override',
      kind: 'Snippet',
      detail: '@Override method',
      documentation: 'Indicates that a method declaration is intended to override a declaration in a supertype',
      insertText: '@Override\npublic ${1:void} ${2:methodName}(${3}) {\n\t${4}\n}',
      filterText: '@Override override'
    }
  ],

  // =========================================================================
  // PYTHON
  // =========================================================================
  python: [
    {
      label: 'print',
      kind: 'Function',
      detail: 'print(...)',
      documentation: 'Prints values to a stream, or to sys.stdout by default',
      insertText: 'print(${1})',
      filterText: 'print pr'
    },
    {
      label: 'len',
      kind: 'Function',
      detail: 'len(obj)',
      documentation: 'Return the number of items in a container',
      insertText: 'len(${1})',
      filterText: 'len length count'
    },
    {
      label: 'range',
      kind: 'Function',
      detail: 'range(stop) | range(start, stop, step)',
      documentation: 'Returns a sequence of numbers, starting from 0 by default',
      insertText: 'range(${1:stop})',
      filterText: 'range'
    },
    {
      label: 'enumerate',
      kind: 'Function',
      detail: 'enumerate(iterable, start=0)',
      documentation: 'Returns an enumerate object producing tuples containing a count and values',
      insertText: 'enumerate(${1:iterable})',
      filterText: 'enumerate enum'
    },
    {
      label: 'zip',
      kind: 'Function',
      detail: 'zip(*iterables)',
      documentation: 'Returns an iterator of tuples where the i-th tuple contains the i-th element from each argument',
      insertText: 'zip(${1:list1}, ${2:list2})',
      filterText: 'zip'
    },
    {
      label: 'input',
      kind: 'Function',
      detail: 'input(prompt)',
      documentation: 'Reads a string from standard input',
      insertText: 'input("${1:Enter value: }")',
      filterText: 'input in read'
    },
    {
      label: 'int',
      kind: 'Function',
      detail: 'int(x)',
      documentation: 'Convert a number or string to an integer',
      insertText: 'int(${1})',
      filterText: 'int parse'
    },
    {
      label: 'str',
      kind: 'Function',
      detail: 'str(object)',
      documentation: 'Create a new string object from the given object',
      insertText: 'str(${1})',
      filterText: 'str string'
    },
    {
      label: 'float',
      kind: 'Function',
      detail: 'float(x)',
      documentation: 'Convert a string or number to a floating point number',
      insertText: 'float(${1})',
      filterText: 'float'
    },
    {
      label: 'list',
      kind: 'Function',
      detail: 'list(iterable)',
      documentation: 'Built-in mutable sequence',
      insertText: 'list(${1})',
      filterText: 'list'
    },
    {
      label: 'dict',
      kind: 'Function',
      detail: 'dict()',
      documentation: 'Built-in dictionary mapping type',
      insertText: 'dict(${1})',
      filterText: 'dict dictionary map'
    },
    {
      label: 'set',
      kind: 'Function',
      detail: 'set(iterable)',
      documentation: 'Built-in unordered collection of unique elements',
      insertText: 'set(${1})',
      filterText: 'set'
    },
    {
      label: 'sum',
      kind: 'Function',
      detail: 'sum(iterable)',
      documentation: 'Sums the items of an iterable',
      insertText: 'sum(${1:iterable})',
      filterText: 'sum'
    },
    {
      label: 'min',
      kind: 'Function',
      detail: 'min(iterable)',
      documentation: 'Returns the smallest item in an iterable',
      insertText: 'min(${1:iterable})',
      filterText: 'min'
    },
    {
      label: 'max',
      kind: 'Function',
      detail: 'max(iterable)',
      documentation: 'Returns the largest item in an iterable',
      insertText: 'max(${1:iterable})',
      filterText: 'max'
    },
    {
      label: 'sorted',
      kind: 'Function',
      detail: 'sorted(iterable, key=None, reverse=False)',
      documentation: 'Returns a new sorted list from the items in iterable',
      insertText: 'sorted(${1:iterable})',
      filterText: 'sorted sort'
    },
    {
      label: 'isinstance',
      kind: 'Function',
      detail: 'isinstance(object, classinfo)',
      documentation: 'Return whether an object is an instance of a class or of a subclass thereof',
      insertText: 'isinstance(${1:obj}, ${2:class_name})',
      filterText: 'isinstance instance'
    },
    {
      label: 'with open',
      kind: 'Snippet',
      detail: "with open('filename', 'r') as f:",
      documentation: 'Safely opens a file with context manager',
      insertText: "with open('${1:file.txt}', '${2:r}', encoding='utf-8') as ${3:f}:\n\t${4:content = f.read()}",
      filterText: 'with open file read write'
    },
    {
      label: '.append()',
      kind: 'Method',
      detail: 'list.append(item)',
      documentation: 'Append object to the end of the list',
      insertText: 'append(${1:item})',
      filterText: 'append add push'
    },
    {
      label: '.extend()',
      kind: 'Method',
      detail: 'list.extend(iterable)',
      documentation: 'Extend list by appending elements from the iterable',
      insertText: 'extend(${1:iterable})',
      filterText: 'extend'
    },
    {
      label: '.pop()',
      kind: 'Method',
      detail: 'list.pop([index])',
      documentation: 'Remove and return item at index (default last)',
      insertText: 'pop(${1})',
      filterText: 'pop remove'
    },
    {
      label: '.keys()',
      kind: 'Method',
      detail: 'dict.keys()',
      documentation: 'Return a new view of the dictionary keys',
      insertText: 'keys()',
      filterText: 'keys'
    },
    {
      label: '.values()',
      kind: 'Method',
      detail: 'dict.values()',
      documentation: 'Return a new view of the dictionary values',
      insertText: 'values()',
      filterText: 'values'
    },
    {
      label: '.items()',
      kind: 'Method',
      detail: 'dict.items()',
      documentation: 'Return a new view of the dictionary items (key, value) pairs',
      insertText: 'items()',
      filterText: 'items'
    },
    {
      label: '.split()',
      kind: 'Method',
      detail: 'str.split(sep=None)',
      documentation: 'Return a list of the words in the string, using sep as the delimiter',
      insertText: "split('${1: }')",
      filterText: 'split'
    },
    {
      label: '.strip()',
      kind: 'Method',
      detail: 'str.strip([chars])',
      documentation: 'Return a copy of the string with leading and trailing whitespace removed',
      insertText: 'strip()',
      filterText: 'strip trim'
    },
    {
      label: '.join()',
      kind: 'Method',
      detail: 'separator.join(iterable)',
      documentation: 'Concatenate any number of strings with separator',
      insertText: "'${1:, }'.join(${2:iterable})",
      filterText: 'join'
    },
    {
      label: '.replace()',
      kind: 'Method',
      detail: 'str.replace(old, new)',
      documentation: 'Return a copy with all occurrences of substring old replaced by new',
      insertText: "replace('${1:old}', '${2:new}')",
      filterText: 'replace'
    },
    {
      label: 'def',
      kind: 'Keyword',
      detail: 'def function_name(args):',
      documentation: 'Defines a Python function',
      insertText: 'def ${1:func_name}(${2:args}):\n\t${3:pass}',
      filterText: 'def function fn'
    },
    {
      label: 'class',
      kind: 'Keyword',
      detail: 'class ClassName:',
      documentation: 'Defines a Python class with __init__ constructor',
      insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, args}):\n\t\t${3:pass}',
      filterText: 'class Class'
    },
    {
      label: 'if __name__ == "__main__"',
      kind: 'Snippet',
      detail: 'if __name__ == "__main__":',
      documentation: 'Standard Python script entry point guard',
      insertText: 'if __name__ == "__main__":\n\t${1:main()}',
      filterText: 'ifmain __main__ main entry'
    },
    {
      label: 'import math',
      kind: 'Module',
      detail: 'import math',
      documentation: 'Imports Python math standard module',
      insertText: 'import math',
      filterText: 'import math'
    },
    {
      label: 'import json',
      kind: 'Module',
      detail: 'import json',
      documentation: 'Imports Python JSON module',
      insertText: 'import json',
      filterText: 'import json'
    },
    {
      label: 'import os',
      kind: 'Module',
      detail: 'import os',
      documentation: 'Imports Python OS interface module',
      insertText: 'import os',
      filterText: 'import os'
    },
    {
      label: 'import random',
      kind: 'Module',
      detail: 'import random',
      documentation: 'Imports Python random numbers generator',
      insertText: 'import random',
      filterText: 'import random'
    }
  ],

  // =========================================================================
  // JAVASCRIPT & TYPESCRIPT
  // =========================================================================
  javascript: [
    {
      label: 'console.log',
      kind: 'Method',
      detail: 'console.log(...)',
      documentation: 'Prints message or values to debugging console',
      insertText: 'console.log(${1});',
      filterText: 'console.log clg log print'
    },
    {
      label: 'console.error',
      kind: 'Method',
      detail: 'console.error(...)',
      documentation: 'Outputs an error message to debugging console',
      insertText: 'console.error(${1});',
      filterText: 'console.error cerr error'
    },
    {
      label: 'console.warn',
      kind: 'Method',
      detail: 'console.warn(...)',
      documentation: 'Outputs a warning message to debugging console',
      insertText: 'console.warn(${1});',
      filterText: 'console.warn cwarn warn'
    },
    {
      label: 'console.table',
      kind: 'Method',
      detail: 'console.table(data)',
      documentation: 'Displays tabular data as a table',
      insertText: 'console.table(${1});',
      filterText: 'console.table ctab table'
    },
    {
      label: 'document.getElementById',
      kind: 'Method',
      detail: "document.getElementById('id')",
      documentation: 'Returns an element with matching ID attribute',
      insertText: "document.getElementById('${1:id}')",
      filterText: 'document.getElementById getElementById gid dgi'
    },
    {
      label: 'document.querySelector',
      kind: 'Method',
      detail: "document.querySelector('selector')",
      documentation: 'Returns the first element matching specified CSS selector',
      insertText: "document.querySelector('${1:selector}')",
      filterText: 'document.querySelector querySelector qs dqs'
    },
    {
      label: 'document.querySelectorAll',
      kind: 'Method',
      detail: "document.querySelectorAll('selector')",
      documentation: 'Returns all elements matching specified CSS selector',
      insertText: "document.querySelectorAll('${1:selector}')",
      filterText: 'document.querySelectorAll querySelectorAll qsa dqsa'
    },
    {
      label: 'document.createElement',
      kind: 'Method',
      detail: "document.createElement('div')",
      documentation: 'Creates the HTML element specified by tagName',
      insertText: "document.createElement('${1:div}')",
      filterText: 'document.createElement createElement dce'
    },
    {
      label: 'addEventListener',
      kind: 'Method',
      detail: "element.addEventListener('click', ...)",
      documentation: 'Sets up a function to be called when specified event is delivered',
      insertText: "${1:element}.addEventListener('${2:click}', (${3:e}) => {\n\t${4}\n});",
      filterText: 'addEventListener ael listener on click'
    },
    {
      label: '.map()',
      kind: 'Method',
      detail: 'array.map((item) => ...)',
      documentation: 'Creates a new array populated with the results of calling a provided function',
      insertText: 'map((${1:item}) => ${2:item})',
      filterText: 'map array map'
    },
    {
      label: '.filter()',
      kind: 'Method',
      detail: 'array.filter((item) => ...)',
      documentation: 'Creates a shallow copy of a portion of a given array filtered by condition',
      insertText: 'filter((${1:item}) => ${2:item})',
      filterText: 'filter array filter'
    },
    {
      label: '.reduce()',
      kind: 'Method',
      detail: 'array.reduce((acc, curr) => ..., initial)',
      documentation: 'Executes a user-supplied reducer callback function on each element',
      insertText: 'reduce((${1:acc}, ${2:curr}) => ${3:acc + curr}, ${4:0})',
      filterText: 'reduce array reduce'
    },
    {
      label: '.forEach()',
      kind: 'Method',
      detail: 'array.forEach((item) => { ... })',
      documentation: 'Executes a provided function once for each array element',
      insertText: 'forEach((${1:item}) => {\n\t${2}\n});',
      filterText: 'forEach foreach for'
    },
    {
      label: '.find()',
      kind: 'Method',
      detail: 'array.find((item) => ...)',
      documentation: 'Returns the first element in the provided array that satisfies testing function',
      insertText: 'find((${1:item}) => ${2:item.id === id})',
      filterText: 'find'
    },
    {
      label: '.includes()',
      kind: 'Method',
      detail: 'array.includes(value)',
      documentation: 'Determines whether an array includes a certain value among its entries',
      insertText: 'includes(${1:item})',
      filterText: 'includes contains'
    },
    {
      label: '.push()',
      kind: 'Method',
      detail: 'array.push(item)',
      documentation: 'Appends new elements to the end of an array',
      insertText: 'push(${1:item});',
      filterText: 'push append add'
    },
    {
      label: 'Object.keys',
      kind: 'Method',
      detail: 'Object.keys(obj)',
      documentation: 'Returns an array of a given object own enumerable property names',
      insertText: 'Object.keys(${1:obj})',
      filterText: 'Object.keys keys'
    },
    {
      label: 'Object.values',
      kind: 'Method',
      detail: 'Object.values(obj)',
      documentation: 'Returns an array of a given object own enumerable property values',
      insertText: 'Object.values(${1:obj})',
      filterText: 'Object.values values'
    },
    {
      label: 'Object.entries',
      kind: 'Method',
      detail: 'Object.entries(obj)',
      documentation: 'Returns an array of a given object own enumerable string-keyed property [key, value] pairs',
      insertText: 'Object.entries(${1:obj})',
      filterText: 'Object.entries entries'
    },
    {
      label: 'JSON.stringify',
      kind: 'Method',
      detail: 'JSON.stringify(data, null, 2)',
      documentation: 'Converts a JavaScript value to a JSON string',
      insertText: 'JSON.stringify(${1:data}, null, 2)',
      filterText: 'JSON.stringify stringify json'
    },
    {
      label: 'JSON.parse',
      kind: 'Method',
      detail: 'JSON.parse(text)',
      documentation: 'Parses a JSON string, constructing the JavaScript value described by the string',
      insertText: 'JSON.parse(${1:jsonString})',
      filterText: 'JSON.parse parse json'
    },
    {
      label: 'fetch',
      kind: 'Function',
      detail: "fetch(url).then(res => res.json())",
      documentation: 'Starts the process of fetching a resource from the network',
      insertText: "fetch('${1:url}')\n\t.then((res) => res.json())\n\t.then((data) => {\n\t\t${2:console.log(data);}\n\t});",
      filterText: 'fetch api http request'
    },
    {
      label: 'fetch-async',
      kind: 'Snippet',
      detail: 'const res = await fetch(url); const data = await res.json();',
      documentation: 'Async-await modern fetch pattern',
      insertText: "const res = await fetch('${1:url}');\nconst data = await res.json();\n${2}",
      filterText: 'fetch-async await fetch api'
    },
    {
      label: 'setTimeout',
      kind: 'Function',
      detail: 'setTimeout(() => { ... }, ms)',
      documentation: 'Sets a timer which executes a function once timer expires',
      insertText: 'setTimeout(() => {\n\t${1}\n}, ${2:1000});',
      filterText: 'setTimeout delay timer'
    },
    {
      label: 'setInterval',
      kind: 'Function',
      detail: 'setInterval(() => { ... }, ms)',
      documentation: 'Repeatedly calls a function with fixed time delay between each call',
      insertText: 'setInterval(() => {\n\t${1}\n}, ${2:1000});',
      filterText: 'setInterval timer'
    },
    {
      label: 'useState',
      kind: 'Snippet',
      detail: 'const [state, setState] = useState(initial);',
      documentation: 'React State Hook',
      insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initial});',
      filterText: 'useState hook react'
    },
    {
      label: 'useEffect',
      kind: 'Snippet',
      detail: 'useEffect(() => { ... }, [deps]);',
      documentation: 'React Effect Hook',
      insertText: 'useEffect(() => {\n\t${1}\n}, [${2}]);',
      filterText: 'useEffect hook react'
    },
    {
      label: 'const',
      kind: 'Keyword',
      detail: 'const name = value;',
      documentation: 'Declares a block-scoped, immutable variable reference',
      insertText: 'const ${1:name} = ${2:value};',
      filterText: 'const variable'
    },
    {
      label: 'let',
      kind: 'Keyword',
      detail: 'let name = value;',
      documentation: 'Declares a block-scoped, re-assignable local variable',
      insertText: 'let ${1:name} = ${2:value};',
      filterText: 'let variable'
    },
    {
      label: 'async function',
      kind: 'Snippet',
      detail: 'async function name(params) { ... }',
      documentation: 'Declares an asynchronous function',
      insertText: 'async function ${1:name}(${2:params}) {\n\t${3}\n}',
      filterText: 'async function afn'
    }
  ],

  // =========================================================================
  // C / C++
  // =========================================================================
  cpp: [
    {
      label: '#include <iostream>',
      kind: 'Module',
      detail: '#include <iostream>',
      documentation: 'Includes standard C++ I/O stream library',
      insertText: '#include <iostream>',
      filterText: '#include <iostream> iostream inc'
    },
    {
      label: '#include <vector>',
      kind: 'Module',
      detail: '#include <vector>',
      documentation: 'Includes standard C++ vector sequence container',
      insertText: '#include <vector>',
      filterText: '#include <vector> vector inc'
    },
    {
      label: '#include <string>',
      kind: 'Module',
      detail: '#include <string>',
      documentation: 'Includes standard C++ string class',
      insertText: '#include <string>',
      filterText: '#include <string> string inc'
    },
    {
      label: '#include <algorithm>',
      kind: 'Module',
      detail: '#include <algorithm>',
      documentation: 'Includes C++ standard algorithms (sort, find, min, max, etc.)',
      insertText: '#include <algorithm>',
      filterText: '#include <algorithm> algorithm sort inc'
    },
    {
      label: '#include <stdio.h>',
      kind: 'Module',
      detail: '#include <stdio.h>',
      documentation: 'Includes C standard input and output library',
      insertText: '#include <stdio.h>',
      filterText: '#include <stdio.h> stdio printf inc'
    },
    {
      label: '#include <stdlib.h>',
      kind: 'Module',
      detail: '#include <stdlib.h>',
      documentation: 'Includes C standard general utilities (malloc, free, rand, exit)',
      insertText: '#include <stdlib.h>',
      filterText: '#include <stdlib.h> stdlib malloc inc'
    },
    {
      label: '#include <string.h>',
      kind: 'Module',
      detail: '#include <string.h>',
      documentation: 'Includes C string handling functions (strlen, strcpy, strcmp)',
      insertText: '#include <string.h>',
      filterText: '#include <string.h> string.h strlen inc'
    },
    {
      label: 'std::cout',
      kind: 'Method',
      detail: 'std::cout << ... << std::endl;',
      documentation: 'Standard character output stream',
      insertText: 'std::cout << ${1} << std::endl;',
      filterText: 'std::cout cout print sout'
    },
    {
      label: 'std::cin',
      kind: 'Method',
      detail: 'std::cin >> ...;',
      documentation: 'Standard character input stream',
      insertText: 'std::cin >> ${1};',
      filterText: 'std::cin cin input'
    },
    {
      label: 'std::vector',
      kind: 'Class',
      detail: 'std::vector<Type> vec;',
      documentation: 'Sequence container representing array that can change in size',
      insertText: 'std::vector<${1:int}> ${2:vec};',
      filterText: 'std::vector vector list'
    },
    {
      label: 'std::string',
      kind: 'Class',
      detail: 'std::string str = "...";',
      documentation: 'Standard C++ string class',
      insertText: 'std::string ${1:str} = "${2}";',
      filterText: 'std::string string str'
    },
    {
      label: 'std::sort',
      kind: 'Function',
      detail: 'std::sort(v.begin(), v.end());',
      documentation: 'Sorts the elements in the range [first, last) in ascending order',
      insertText: 'std::sort(${1:vec}.begin(), ${1:vec}.end());',
      filterText: 'std::sort sort'
    },
    {
      label: 'printf',
      kind: 'Function',
      detail: 'printf("format\\n", args);',
      documentation: 'Writes the C string pointed by format to standard output',
      insertText: 'printf("${1:%s}\\n", ${2});',
      filterText: 'printf print pf'
    },
    {
      label: 'scanf',
      kind: 'Function',
      detail: 'scanf("format", &var);',
      documentation: 'Reads formatted data from standard input',
      insertText: 'scanf("${1:%d}", &${2:var});',
      filterText: 'scanf scan sf'
    },
    {
      label: 'malloc',
      kind: 'Function',
      detail: '(Type*)malloc(size);',
      documentation: 'Allocates uninitialized storage',
      insertText: '(${1:int*})malloc(sizeof(${2:int}) * ${3:n});',
      filterText: 'malloc allocate memory'
    },
    {
      label: 'free',
      kind: 'Function',
      detail: 'free(ptr);',
      documentation: 'Deallocates allocated memory block',
      insertText: 'free(${1:ptr});',
      filterText: 'free deallocate'
    },
    {
      label: 'main()',
      kind: 'Snippet',
      detail: 'int main() { ... }',
      documentation: 'Standard C/C++ main entry point',
      insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
      filterText: 'main int main'
    }
  ],

  // =========================================================================
  // PHP
  // =========================================================================
  php: [
    {
      label: 'echo',
      kind: 'Keyword',
      detail: 'echo "...";',
      documentation: 'Outputs one or more strings',
      insertText: 'echo "${1}\\n";',
      filterText: 'echo print'
    },
    {
      label: 'var_dump',
      kind: 'Function',
      detail: 'var_dump($var);',
      documentation: 'Dumps information about one or more variables',
      insertText: 'var_dump(${1});',
      filterText: 'var_dump vardump dump'
    },
    {
      label: 'print_r',
      kind: 'Function',
      detail: 'print_r($var);',
      documentation: 'Prints human-readable information about a variable',
      insertText: 'print_r(${1});',
      filterText: 'print_r printr'
    },
    {
      label: 'isset',
      kind: 'Function',
      detail: 'isset($var)',
      documentation: 'Determine if a variable is considered set and is not NULL',
      insertText: 'isset(${1:\\$var})',
      filterText: 'isset'
    },
    {
      label: 'empty',
      kind: 'Function',
      detail: 'empty($var)',
      documentation: 'Determine whether a variable is empty',
      insertText: 'empty(${1:\\$var})',
      filterText: 'empty'
    },
    {
      label: 'count',
      kind: 'Function',
      detail: 'count($array)',
      documentation: 'Counts all elements in an array or countable object',
      insertText: 'count(${1:\\$array})',
      filterText: 'count length'
    },
    {
      label: 'strlen',
      kind: 'Function',
      detail: 'strlen($string)',
      documentation: 'Get string length',
      insertText: 'strlen(${1:\\$str})',
      filterText: 'strlen length'
    },
    {
      label: 'str_replace',
      kind: 'Function',
      detail: 'str_replace(search, replace, subject)',
      documentation: 'Replace all occurrences of the search string with replacement',
      insertText: "str_replace('${1:search}', '${2:replace}', ${3:\\$subject})",
      filterText: 'str_replace replace'
    },
    {
      label: 'explode',
      kind: 'Function',
      detail: "explode(',', $string)",
      documentation: 'Split a string by a string',
      insertText: "explode('${1:,}', ${2:\\$string})",
      filterText: 'explode split'
    },
    {
      label: 'implode',
      kind: 'Function',
      detail: "implode(', ', $array)",
      documentation: 'Join array elements with a string',
      insertText: "implode('${1:, }', ${2:\\$array})",
      filterText: 'implode join'
    },
    {
      label: 'in_array',
      kind: 'Function',
      detail: 'in_array($needle, $haystack)',
      documentation: 'Checks if a value exists in an array',
      insertText: 'in_array(${1:\\$needle}, ${2:\\$haystack})',
      filterText: 'in_array contains'
    },
    {
      label: 'json_encode',
      kind: 'Function',
      detail: 'json_encode($data)',
      documentation: 'Returns the JSON representation of a value',
      insertText: 'json_encode(${1:\\$data})',
      filterText: 'json_encode json'
    },
    {
      label: 'json_decode',
      kind: 'Function',
      detail: 'json_decode($json, true)',
      documentation: 'Decodes a JSON string into PHP array or object',
      insertText: 'json_decode(${1:\\$json}, true)',
      filterText: 'json_decode json'
    },
    {
      label: '$_POST',
      kind: 'Variable',
      detail: "$_POST['key']",
      documentation: 'An associative array of variables passed via HTTP POST',
      insertText: "\\$_POST['${1:key}']",
      filterText: '$_POST post'
    },
    {
      label: '$_GET',
      kind: 'Variable',
      detail: "$_GET['key']",
      documentation: 'An associative array of variables passed via HTTP GET query parameters',
      insertText: "\\$_GET['${1:key}']",
      filterText: '$_GET get'
    },
    {
      label: '$_SESSION',
      kind: 'Variable',
      detail: "$_SESSION['key']",
      documentation: 'An associative array containing session variables',
      insertText: "\\$_SESSION['${1:key}']",
      filterText: '$_SESSION session'
    }
  ],

  // =========================================================================
  // SQL
  // =========================================================================
  sql: [
    {
      label: 'SELECT',
      kind: 'Keyword',
      detail: 'SELECT * FROM table;',
      documentation: 'Retrieves data from one or more tables in a database',
      insertText: 'SELECT ${1:*} FROM ${2:table_name};',
      filterText: 'SELECT select get find'
    },
    {
      label: 'SELECT WHERE',
      kind: 'Snippet',
      detail: 'SELECT * FROM table WHERE ...;',
      documentation: 'Selects rows satisfying a condition',
      insertText: 'SELECT ${1:*} FROM ${2:table_name} WHERE ${3:condition};',
      filterText: 'SELECT WHERE select where'
    },
    {
      label: 'INSERT INTO',
      kind: 'Keyword',
      detail: 'INSERT INTO table (...) VALUES (...);',
      documentation: 'Inserts new records into a table',
      insertText: 'INSERT INTO ${1:table_name} (${2:columns}) VALUES (${3:values});',
      filterText: 'INSERT INTO insert add'
    },
    {
      label: 'UPDATE',
      kind: 'Keyword',
      detail: 'UPDATE table SET col = val WHERE ...;',
      documentation: 'Modifies existing records in a table',
      insertText: 'UPDATE ${1:table_name} SET ${2:column} = ${3:value} WHERE ${4:condition};',
      filterText: 'UPDATE update set edit'
    },
    {
      label: 'DELETE FROM',
      kind: 'Keyword',
      detail: 'DELETE FROM table WHERE ...;',
      documentation: 'Deletes existing records from a table',
      insertText: 'DELETE FROM ${1:table_name} WHERE ${2:condition};',
      filterText: 'DELETE FROM delete remove'
    },
    {
      label: 'INNER JOIN',
      kind: 'Keyword',
      detail: 'INNER JOIN table ON ...',
      documentation: 'Selects records that have matching values in both tables',
      insertText: 'INNER JOIN ${1:table_b} ON ${1:table_b}.${2:id} = ${3:table_a}.${2:id}',
      filterText: 'INNER JOIN join table'
    },
    {
      label: 'LEFT JOIN',
      kind: 'Keyword',
      detail: 'LEFT JOIN table ON ...',
      documentation: 'Returns all records from the left table, and matched records from right',
      insertText: 'LEFT JOIN ${1:table_b} ON ${1:table_b}.${2:id} = ${3:table_a}.${2:id}',
      filterText: 'LEFT JOIN left join'
    },
    {
      label: 'ORDER BY',
      kind: 'Keyword',
      detail: 'ORDER BY column ASC/DESC',
      documentation: 'Sorts the result set in ascending or descending order',
      insertText: 'ORDER BY ${1:column} ${2|ASC,DESC|}',
      filterText: 'ORDER BY order sort asc desc'
    },
    {
      label: 'GROUP BY',
      kind: 'Keyword',
      detail: 'GROUP BY column',
      documentation: 'Groups rows that have the same values into summary rows',
      insertText: 'GROUP BY ${1:column}',
      filterText: 'GROUP BY group'
    },
    {
      label: 'CREATE TABLE',
      kind: 'Snippet',
      detail: 'CREATE TABLE name (...)',
      documentation: 'Creates a new database table structure',
      insertText: 'CREATE TABLE ${1:table_name} (\n\tid INT AUTO_INCREMENT PRIMARY KEY,\n\t${2:name} VARCHAR(255) NOT NULL,\n\tcreated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);',
      filterText: 'CREATE TABLE table create'
    },
    {
      label: 'COUNT()',
      kind: 'Function',
      detail: 'COUNT(*)',
      documentation: 'Returns the number of rows matching the query criteria',
      insertText: 'COUNT(${1:*})',
      filterText: 'COUNT count'
    }
  ]
};

// Map languages that share identical suggestions
syntaxSuggestions.scss = syntaxSuggestions.css;
syntaxSuggestions.less = syntaxSuggestions.css;
syntaxSuggestions.typescript = syntaxSuggestions.javascript;
syntaxSuggestions.c = syntaxSuggestions.cpp;

/**
 * Returns specific trigger characters for a given language
 * @param {string} lang 
 * @returns {string[]}
 */
export function getTriggerCharacters(lang) {
  switch (lang) {
    case 'css':
    case 'scss':
    case 'less':
      return [':', ' ', '-', '@', '.'];
    case 'java':
      return ['.', '@', ' '];
    case 'python':
      return ['.', ' '];
    case 'javascript':
    case 'typescript':
      return ['.', ' ', '/', '$'];
    case 'c':
    case 'cpp':
      return ['.', ':', '#', '>', ' '];
    case 'php':
      return ['$', '-', '>', ':', '\\', ' '];
    case 'sql':
      return [' ', '.', '('];
    case 'html':
      return ['<', ' ', '=', '/', '"', "'"];
    default:
      return ['.', ' '];
  }
}
