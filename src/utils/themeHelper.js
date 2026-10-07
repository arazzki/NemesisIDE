/**
 * Theme System for Nemesis IDE
 * Provides color palettes, styles, and Electron titleBarOverlay options
 * for all supported themes:
 * - nemesis-dark (Default Nemesis Dark Vivid)
 * - light (Clean Modern Light Mode)
 * - tokyo-night (Cyber Neon)
 * - vs-dark (Visual Studio Dark)
 * - hc-black (High Contrast Black)
 */

export const THEMES = {
  'nemesis-dark': {
    id: 'nemesis-dark',
    name: 'Nemesis Dark',
    isLight: false,
    isHighContrast: false,
    titleBarOverlay: {
      color: '#141418',
      symbolColor: '#a1a1aa',
      height: 32
    },
    app: {
      bg: '#101014',
      text: '#e4e4e7'
    },
    header: {
      bg: '#141418',
      border: '#262630',
      text: '#e4e4e7',
      titleText: '#a1a1aa',
      brandText: '#f4f4f5',
      badgeBg: '#1e1e26',
      badgeBorder: '#2e2e3a',
      badgeText: '#d4d4d8',
      badgeHover: 'hover:bg-[#262632] hover:text-white',
      webBadgeBg: '#1e1e26',
      webBadgeBorder: '#262630',
      webBadgeText: '#71717a'
    },
    activityBar: {
      bg: '#101014',
      border: '#262630',
      activeBg: '#262630',
      activeText: '#ffffff',
      inactiveText: '#a1a1aa',
      hoverBg: '#1a1a22',
      hoverText: '#ffffff',
      indicatorBg: 'bg-purple-500'
    },
    sidebar: {
      bg: '#141418',
      border: '#262630',
      text: '#d4d4d8',
      textMuted: '#71717a',
      headerText: '#a1a1aa',
      itemHover: 'hover:bg-[#1d1d24]',
      itemActive: 'bg-[#252532] text-purple-300 font-medium',
      cardBg: '#1c1c24',
      cardBorder: '#2e2e3a',
      inputBg: '#1c1c24',
      inputBorder: '#2e2e3a',
      inputText: '#e4e4e7',
      contextMenuBg: '#1c1c24',
      contextMenuBorder: '#2e2e3a',
      emptyText: '#71717a'
    },
    tabBar: {
      bg: '#121216',
      border: '#262630',
      activeTabBg: '#1a1a1f',
      activeTabText: '#ffffff',
      activeTabBorder: '#8b5cf6', // Nemesis purple top accent
      inactiveTabBg: '#121216',
      inactiveTabText: '#a1a1aa',
      inactiveTabHover: 'hover:bg-[#181820] hover:text-zinc-200',
      actionAreaBg: '#121216',
      actionAreaBorder: '#262630'
    },
    editor: {
      bg: '#1a1a1f',
      emptyBg: '#141418',
      emptyText: '#e4e4e7',
      emptyMuted: '#71717a',
      shortcutBadgeBg: '#1c1c24',
      shortcutBadgeBorder: '#2e2e3a'
    },
    terminal: {
      bg: '#101014',
      border: '#262630',
      headerBg: '#141418',
      headerBorder: '#262630',
      headerText: '#e4e4e7',
      outputBg: '#0e0e12',
      outputText: '#e4e4e7',
      inputBg: '#141418',
      inputText: '#e4e4e7',
      promptText: '#a855f7',
      buttonHover: 'hover:bg-[#262630] text-zinc-400 hover:text-white',
      scrollbarThumb: '#27272a'
    },
    statusBar: {
      bg: '#141418',
      border: '#262630',
      text: '#a1a1aa',
      branchColor: 'text-purple-400',
      activeLangColor: 'text-zinc-300'
    }
  },

  'light': {
    id: 'light',
    name: 'Light Mode',
    isLight: true,
    isHighContrast: false,
    titleBarOverlay: {
      color: '#f3f4f6',
      symbolColor: '#18181b',
      height: 32
    },
    app: {
      bg: '#f9fafb',
      text: '#18181b'
    },
    header: {
      bg: '#f3f4f6',
      border: '#e5e7eb',
      text: '#18181b',
      titleText: '#6b7280',
      brandText: '#111827',
      badgeBg: '#ffffff',
      badgeBorder: '#d1d5db',
      badgeText: '#374151',
      badgeHover: 'hover:bg-[#e5e7eb] hover:text-black',
      webBadgeBg: '#e5e7eb',
      webBadgeBorder: '#d1d5db',
      webBadgeText: '#4b5563'
    },
    activityBar: {
      bg: '#eaecef',
      border: '#d1d5db',
      activeBg: '#ffffff',
      activeText: '#18181b',
      inactiveText: '#6b7280',
      hoverBg: '#f3f4f6',
      hoverText: '#111827',
      indicatorBg: 'bg-blue-600'
    },
    sidebar: {
      bg: '#f8f9fa',
      border: '#e5e7eb',
      text: '#1f2937',
      textMuted: '#6b7280',
      headerText: '#4b5563',
      itemHover: 'hover:bg-[#e9ecef]',
      itemActive: 'bg-[#e0e7ff] text-blue-700 font-semibold',
      cardBg: '#ffffff',
      cardBorder: '#e5e7eb',
      inputBg: '#ffffff',
      inputBorder: '#d1d5db',
      inputText: '#111827',
      contextMenuBg: '#ffffff',
      contextMenuBorder: '#d1d5db',
      emptyText: '#6b7280'
    },
    tabBar: {
      bg: '#ebedf0',
      border: '#e5e7eb',
      activeTabBg: '#ffffff',
      activeTabText: '#111827',
      activeTabBorder: '#2563eb',
      inactiveTabBg: '#e2e4e8',
      inactiveTabText: '#6b7280',
      inactiveTabHover: 'hover:bg-[#ebedf0] hover:text-black',
      actionAreaBg: '#ebedf0',
      actionAreaBorder: '#e5e7eb'
    },
    editor: {
      bg: '#ffffff',
      emptyBg: '#f8f9fa',
      emptyText: '#1f2937',
      emptyMuted: '#6b7280',
      shortcutBadgeBg: '#ffffff',
      shortcutBadgeBorder: '#d1d5db'
    },
    terminal: {
      bg: '#ffffff',
      border: '#e5e7eb',
      headerBg: '#f3f4f6',
      headerBorder: '#e5e7eb',
      headerText: '#1f2937',
      outputBg: '#f9fafb',
      outputText: '#18181b',
      inputBg: '#f3f4f6',
      inputText: '#18181b',
      promptText: '#2563eb',
      buttonHover: 'hover:bg-[#e5e7eb] text-zinc-600 hover:text-black',
      scrollbarThumb: '#d1d5db'
    },
    statusBar: {
      bg: '#f3f4f6',
      border: '#e5e7eb',
      text: '#4b5563',
      branchColor: 'text-blue-600',
      activeLangColor: 'text-zinc-800'
    }
  },

  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    isLight: false,
    isHighContrast: false,
    titleBarOverlay: {
      color: '#16161e',
      symbolColor: '#7aa2f7',
      height: 32
    },
    app: {
      bg: '#13131a',
      text: '#c0caf5'
    },
    header: {
      bg: '#16161e',
      border: '#292e42',
      text: '#c0caf5',
      titleText: '#7aa2f7',
      brandText: '#c0caf5',
      badgeBg: '#1f2335',
      badgeBorder: '#292e42',
      badgeText: '#a9b1d6',
      badgeHover: 'hover:bg-[#283457] hover:text-white',
      webBadgeBg: '#1f2335',
      webBadgeBorder: '#292e42',
      webBadgeText: '#565f89'
    },
    activityBar: {
      bg: '#13131a',
      border: '#292e42',
      activeBg: '#24283b',
      activeText: '#7aa2f7',
      inactiveText: '#565f89',
      hoverBg: '#1f2335',
      hoverText: '#c0caf5',
      indicatorBg: 'bg-cyan-400'
    },
    sidebar: {
      bg: '#16161e',
      border: '#292e42',
      text: '#a9b1d6',
      textMuted: '#565f89',
      headerText: '#7aa2f7',
      itemHover: 'hover:bg-[#1f2335]',
      itemActive: 'bg-[#283457] text-[#7aa2f7] font-medium',
      cardBg: '#1a1b26',
      cardBorder: '#292e42',
      inputBg: '#1f2335',
      inputBorder: '#292e42',
      inputText: '#c0caf5',
      contextMenuBg: '#1a1b26',
      contextMenuBorder: '#292e42',
      emptyText: '#565f89'
    },
    tabBar: {
      bg: '#13131a',
      border: '#292e42',
      activeTabBg: '#16161e',
      activeTabText: '#c0caf5',
      activeTabBorder: '#7aa2f7',
      inactiveTabBg: '#13131a',
      inactiveTabText: '#565f89',
      inactiveTabHover: 'hover:bg-[#1a1b26] hover:text-[#a9b1d6]',
      actionAreaBg: '#13131a',
      actionAreaBorder: '#292e42'
    },
    editor: {
      bg: '#16161e',
      emptyBg: '#16161e',
      emptyText: '#c0caf5',
      emptyMuted: '#565f89',
      shortcutBadgeBg: '#1f2335',
      shortcutBadgeBorder: '#292e42'
    },
    terminal: {
      bg: '#13131a',
      border: '#292e42',
      headerBg: '#16161e',
      headerBorder: '#292e42',
      headerText: '#c0caf5',
      outputBg: '#101016',
      outputText: '#c0caf5',
      inputBg: '#16161e',
      inputText: '#c0caf5',
      promptText: '#bb9af7',
      buttonHover: 'hover:bg-[#24283b] text-[#565f89] hover:text-[#c0caf5]',
      scrollbarThumb: '#292e42'
    },
    statusBar: {
      bg: '#16161e',
      border: '#292e42',
      text: '#565f89',
      branchColor: 'text-[#7aa2f7]',
      activeLangColor: 'text-[#a9b1d6]'
    }
  },

  'vs-dark': {
    id: 'vs-dark',
    name: 'VS Dark',
    isLight: false,
    isHighContrast: false,
    titleBarOverlay: {
      color: '#181818',
      symbolColor: '#cccccc',
      height: 32
    },
    app: {
      bg: '#1e1e1e',
      text: '#cccccc'
    },
    header: {
      bg: '#181818',
      border: '#2d2d2d',
      text: '#cccccc',
      titleText: '#969696',
      brandText: '#ffffff',
      badgeBg: '#252526',
      badgeBorder: '#333333',
      badgeText: '#cccccc',
      badgeHover: 'hover:bg-[#333333] hover:text-white',
      webBadgeBg: '#252526',
      webBadgeBorder: '#333333',
      webBadgeText: '#858585'
    },
    activityBar: {
      bg: '#1e1e1e',
      border: '#2d2d2d',
      activeBg: '#2a2a2a',
      activeText: '#ffffff',
      inactiveText: '#858585',
      hoverBg: '#252526',
      hoverText: '#cccccc',
      indicatorBg: 'bg-blue-500'
    },
    sidebar: {
      bg: '#252526',
      border: '#2d2d2d',
      text: '#cccccc',
      textMuted: '#858585',
      headerText: '#969696',
      itemHover: 'hover:bg-[#2a2d2e]',
      itemActive: 'bg-[#094771] text-white font-medium',
      cardBg: '#2d2d30',
      cardBorder: '#3e3e42',
      inputBg: '#3c3c3c',
      inputBorder: '#3e3e42',
      inputText: '#cccccc',
      contextMenuBg: '#252526',
      contextMenuBorder: '#3e3e42',
      emptyText: '#858585'
    },
    tabBar: {
      bg: '#1e1e1e',
      border: '#2d2d2d',
      activeTabBg: '#1e1e1e',
      activeTabText: '#ffffff',
      activeTabBorder: '#007acc',
      inactiveTabBg: '#2d2d2d',
      inactiveTabText: '#969696',
      inactiveTabHover: 'hover:bg-[#242424] hover:text-white',
      actionAreaBg: '#1e1e1e',
      actionAreaBorder: '#2d2d2d'
    },
    editor: {
      bg: '#1e1e1e',
      emptyBg: '#1e1e1e',
      emptyText: '#cccccc',
      emptyMuted: '#858585',
      shortcutBadgeBg: '#2d2d30',
      shortcutBadgeBorder: '#3e3e42'
    },
    terminal: {
      bg: '#181818',
      border: '#2d2d2d',
      headerBg: '#252526',
      headerBorder: '#2d2d2d',
      headerText: '#cccccc',
      outputBg: '#1e1e1e',
      outputText: '#cccccc',
      inputBg: '#181818',
      inputText: '#cccccc',
      promptText: '#007acc',
      buttonHover: 'hover:bg-[#333333] text-[#858585] hover:text-[#cccccc]',
      scrollbarThumb: '#3e3e42'
    },
    statusBar: {
      bg: '#007acc',
      border: '#007acc',
      text: '#ffffff',
      branchColor: 'text-white',
      activeLangColor: 'text-white'
    }
  },

  'hc-black': {
    id: 'hc-black',
    name: 'High Contrast',
    isLight: false,
    isHighContrast: true,
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff',
      height: 32
    },
    app: {
      bg: '#000000',
      text: '#ffffff'
    },
    header: {
      bg: '#000000',
      border: '#6fc3df',
      text: '#ffffff',
      titleText: '#ffffff',
      brandText: '#ffffff',
      badgeBg: '#000000',
      badgeBorder: '#6fc3df',
      badgeText: '#ffffff',
      badgeHover: 'hover:bg-[#1a1a1a] hover:text-white',
      webBadgeBg: '#000000',
      webBadgeBorder: '#6fc3df',
      webBadgeText: '#ffffff'
    },
    activityBar: {
      bg: '#000000',
      border: '#6fc3df',
      activeBg: '#000000',
      activeText: '#ffffff',
      inactiveText: '#ffffff',
      hoverBg: '#1a1a1a',
      hoverText: '#ffffff',
      indicatorBg: 'bg-white'
    },
    sidebar: {
      bg: '#000000',
      border: '#6fc3df',
      text: '#ffffff',
      textMuted: '#a6a6a6',
      headerText: '#ffffff',
      itemHover: 'hover:bg-[#1a1a1a]',
      itemActive: 'bg-[#000000] border border-[#6fc3df] text-white font-bold',
      cardBg: '#000000',
      cardBorder: '#6fc3df',
      inputBg: '#000000',
      inputBorder: '#6fc3df',
      inputText: '#ffffff',
      contextMenuBg: '#000000',
      contextMenuBorder: '#6fc3df',
      emptyText: '#ffffff'
    },
    tabBar: {
      bg: '#000000',
      border: '#6fc3df',
      activeTabBg: '#000000',
      activeTabText: '#ffffff',
      activeTabBorder: '#6fc3df',
      inactiveTabBg: '#000000',
      inactiveTabText: '#a6a6a6',
      inactiveTabHover: 'hover:bg-[#1a1a1a] hover:text-white',
      actionAreaBg: '#000000',
      actionAreaBorder: '#6fc3df'
    },
    editor: {
      bg: '#000000',
      emptyBg: '#000000',
      emptyText: '#ffffff',
      emptyMuted: '#a6a6a6',
      shortcutBadgeBg: '#000000',
      shortcutBadgeBorder: '#6fc3df'
    },
    terminal: {
      bg: '#000000',
      border: '#6fc3df',
      headerBg: '#000000',
      headerBorder: '#6fc3df',
      headerText: '#ffffff',
      outputBg: '#000000',
      outputText: '#ffffff',
      inputBg: '#000000',
      inputText: '#ffffff',
      promptText: '#6fc3df',
      buttonHover: 'hover:bg-[#1a1a1a] text-white',
      scrollbarThumb: '#6fc3df'
    },
    statusBar: {
      bg: '#000000',
      border: '#6fc3df',
      text: '#ffffff',
      branchColor: 'text-[#6fc3df]',
      activeLangColor: 'text-white'
    }
  }
};

/**
 * Get active theme definition by ID with fallback to nemesis-dark
 */
export function getTheme(themeId) {
  return THEMES[themeId] || THEMES['nemesis-dark'];
}
