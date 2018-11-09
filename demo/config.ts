export interface ConfigItem {
  title: string;
  type: string;
  path: string;
  max?: number;
  min?: number;
  step?: number;
  units?: string;
  placeholder?: string;
  description?: string;
}

export interface Config {
  title: string;
  items: ConfigItem[];
}

export const CONFIG: Config[] = [
  {
    title: 'General options',
    items: [
      {
        title: 'Use native scrollbar',
        type: 'checkbox',
        path: 'nativeScrollbars',
        description: 'Use native scrollbar',
      },
      {
        title: 'Hide download button',
        type: 'checkbox',
        path: 'hideDownloadButton',
        description: 'Use native scrollbar',
      },
      {
        title: 'Disable search',
        type: 'checkbox',
        path: 'disableSearch',
      },
      {
        title: 'Hide loading',
        type: 'checkbox',
        path: 'hideLoading',
        description: 'Use native scrollbar',
      },
      {
        title: 'Sort props alphabetically',
        type: 'checkbox',
        path: 'sortPropsAlphabetically',
      },
      {
        title: 'Expand responses',
        type: 'text-input',
        path: 'expandResponses',
        placeholder: 'e.g: 200,201',
      },
    ],
  },
  {
    title: 'Colors',
    items: [
      {
        title: 'Main theme color',
        type: 'colors',
        path: 'theme.colors.primary.main',
      },
      {
        title: 'Main text color',
        type: 'colors',
        path: 'theme.colors.text.primary',
      },
      {
        title: 'Links color',
        type: 'colors',
        path: 'theme.typography.links.color',
      },
    ],
  },
  {
    title: 'Typography',
    items: [
      {
        title: 'Font family',
        type: 'font-family',
        path: 'theme.typography.fontFamily',
      },
      {
        title: 'Headings font family',
        type: 'font-family',
        path: 'theme.typography.headings.fontFamily',
      },
      {
        title: 'Headings font weight',
        type: 'range',
        path: 'theme.typography.headings.fontWeight',
        max: 900,
        min: 100,
        step: 100,
        units: '',
      },
      {
        title: 'Font size',
        type: 'font-size',
        path: 'theme.typography.fontSize',
      },
      {
        title: 'Font weight',
        type: 'range',
        path: 'theme.typography.fontWeightRegular',
        max: 900,
        min: 100,
        step: 100,
        units: '',
      },
      {
        title: 'Line height',
        type: 'font-size',
        path: 'theme.typography.lineHeight',
      },
    ],
  },
  {
    title: 'Panels options',
    items: [
      {
        title: 'Left panel width',
        type: 'range',
        path: 'theme.menu.width',
        max: 400,
        min: 150,
        step: 10,
        units: 'px',
      },
      {
        title: 'Left panel background color',
        type: 'colors',
        path: 'theme.menu.backgroundColor',
      },
      {
        title: 'Left panel text color',
        type: 'colors',
        path: 'theme.menu.textColor',
      },
      {
        title: 'Left panel text transform',
        type: 'text-transform',
        path: 'theme.menu.groupItems.textTransform',
      },
      {
        title: 'Left panel text transform for level 1',
        type: 'text-transform',
        path: 'theme.menu.level1Items.textTransform',
      },
      {
        title: 'Right panel width',
        type: 'range',
        path: 'theme.rightPanel.width',
        max: 100,
        min: 0,
        step: 10,
        units: '%',
      },
      {
        title: 'Right panel background',
        type: 'colors',
        path: 'theme.rightPanel.backgroundColor',
      },
      {
        title: 'Right panel color',
        type: 'colors',
        path: 'theme.rightPanel.textColor',
      },
    ],
  },
  {
    title: 'Code options',
    items: [
      {
        title: 'Text color',
        type: 'colors',
        path: 'theme.typography.code.color',
      },
      {
        title: 'Background color',
        type: 'colors',
        path: 'theme.typography.code.backgroundColor',
      },
      {
        title: 'Text font family',
        type: 'font-family-mono',
        path: 'theme.typography.code.fontFamily',
      },
      {
        title: 'Text font size',
        type: 'font-size',
        path: 'theme.typography.code.fontSize',
      },
      {
        title: 'Text font weight',
        type: 'range',
        path: 'theme.typography.code.fontWeight',
        min: 100,
        max: 900,
        step: 100,
        units: '',
      },
    ],
  },
  {
    title: 'Other options',
    items: [
      {
        title: 'Nested background for tables',
        type: 'colors',
        path: 'theme.schema.nestedBackground',
      },
    ],
  },
];

export const presets = {
  Default: undefined,
  'Blue tones': {
    colors: {
      primary: {
        main: 'rgba(55, 76, 159, 1)',
      },
      text: {
        primary: 'rgba(34, 34, 34, 1)',
      },
    },
    menu: {
      backgroundColor: 'rgba(248, 249, 254, 1)',
      groupItems: {
        textTransform: 'lowercase',
      },
      level1Items: {
        textTransform: 'uppercase',
      },
      textColor: 'rgba(119, 119, 119, 1)',
    },
    typography: {
      fontFamily: 'Poppins',
      headings: {
        fontFamily: 'Poppins',
        fontWeight: '600',
      },
      fontWeightRegular: '400',
      code: {
        backgroundColor: 'rgba(248, 249, 254, 1)',
        color: 'rgba(68, 68, 68, 1)',
        fontFamily: 'Fira Mono',
        fontSize: '12px',
      },
    },
    rightPanel: {
      backgroundColor: 'rgba(34, 34, 34, 1)',
    },
  },
  Simple: {
    menu: {
      textColor: 'rgba(34, 34, 34, 1)',
      backgroundColor: 'rgba(232, 235, 241, 0.4)',
    },
    rightPanel: {
      backgroundColor: 'rgba(54, 71, 96, 1)',
    },
    colors: {
      text: {
        primary: 'rgba(102, 102, 102, 1)',
      },
      primary: {
        main: 'rgba(55, 54, 62, 1)',
      },
    },
    typography: {
      headings: {
        fontWeight: '600',
        fontFamily: 'Raleway',
      },
      fontFamily: 'Open Sans',
      code: {
        color: 'rgba(34, 34, 34, 1)',
        backgroundColor: 'rgba(237, 246, 255, 1)',
        fontFamily: 'Courier New',
        fontSize: '13px',
      },
    },
  },
  Monochrome: {
    colors: {
      primary: {
        main: 'rgba(34, 34, 34, 1)',
      },
      text: {
        primary: 'rgba(68, 68, 68, 1)',
      },
    },
    typography: {
      headings: {
        fontFamily: 'Oswald',
        fontWeight: '500',
      },
      code: {
        backgroundColor: 'rgba(252, 249, 246, 1)',
        fontFamily: 'Source Code Pro',
        color: 'rgba(34, 34, 34, 1)',
        fontSize: '12px',
      },
    },
    menu: {
      backgroundColor: 'rgba(252, 249, 246, 0.7)',
      groupItems: {
        textTransform: 'capitalize',
      },
      level1Items: {
        textTransform: 'uppercase',
      },
      width: '290px',
    },
    rightPanel: {
      backgroundColor: 'rgba(34, 34, 34, 1)',
    },
  },
};

export interface FontInfo {
  link: string;
  title: string;
}

export const CUSTOMIZE_FONTS: Dict<FontInfo> = {
  Verdana: { link: '', title: 'Verdana (system)' },
  Georgia: { link: '', title: 'Georgia (system)' },
  Helvetica: { link: '', title: 'Helvetica (system)' },
  'Times New Roman': { link: '', title: 'Times New Roman (system)' },
  Montserrat: {
    link: 'https://fonts.googleapis.com/css?family=Montserrat',
    title: 'Montserrat (Google fonts)',
  },
  Roboto: {
    link: 'https://fonts.googleapis.com/css?family=Roboto',
    title: 'Roboto (Google fonts)',
  },
  'Open Sans': {
    link: 'https://fonts.googleapis.com/css?family=Open+Sans',
    title: 'Open Sans (Google fonts)',
  },
  Lato: { link: 'https://fonts.googleapis.com/css?family=Lato', title: 'Lato (Google fonts)' },
  Poppins: {
    link: 'https://fonts.googleapis.com/css?family=Poppins',
    title: 'Poppins (Google fonts)',
  },
  Raleway: {
    link: 'https://fonts.googleapis.com/css?family=Raleway',
    title: 'Raleway (Google fonts)',
  },
  Oswald: {
    link: 'https://fonts.googleapis.com/css?family=Oswald',
    title: 'Oswald (Google fonts)',
  },
};

export const CUSTOMIZE_FONTS_MONO: Dict<FontInfo> = {
  'Courier New': { link: '', title: 'Courier New (system)' },
  Courier: { link: '', title: 'Courier (system)' },
  'Fira Mono': {
    link: 'https://fonts.googleapis.com/css?family=Fira+Mono',
    title: 'Fira Mono (Google fonts)',
  },
  'Source Code Pro': {
    link: 'https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet',
    title: 'Source Code Pro (Google fonts)',
  },
  'Ubuntu Mono': {
    link: 'https://fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet',
    title: 'Ubuntu Mono (Google fonts)',
  },
  Inconsolata: {
    link: 'https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet',
    title: 'Inconsolata (Google fonts)',
  },
};

export function getFontsByType(type: 'font-family' | 'font-family-mono') {
  return type === 'font-family-mono' ? CUSTOMIZE_FONTS_MONO : CUSTOMIZE_FONTS;
}
