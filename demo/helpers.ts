import { RedocRawOptions } from '../src';
import { CONFIG, getFontsByType } from './config';

export function setValue(obj, value, path) {
  const properties = Array.isArray(path) ? path : path.split('.');

  if (properties.length > 1) {
    if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== 'object') {
      obj[properties[0]] = {};
    }
    return setValue(obj[properties[0]], value, properties.slice(1));
  } else {
    obj[properties[0]] = value;
    return true;
  }
}

export function getValue(obj, path) {
  try {
    const parts = path.split('.');
    if (parts.length === 1) {
      return obj[parts[0]];
    }
    return getValue(obj[parts[0]], parts.slice(1).join('.'));
  } catch (e) {
    return undefined;
  }
}

export interface FontLinksInfo {
  fontName: string;
  html: ((id?: string) => string);
}

export function generateFonts(options: object): FontLinksInfo[] {
  const result: FontLinksInfo[] = [];
  const fontsAdded = {};
  for (const group of CONFIG) {
    for (const i of group.items) {
      if (i.type !== 'font-family' && i.type !== 'font-family-mono') {
        continue;
      }

      const fontsObject = getFontsByType(i.type);

      const fontName = getValue(options, i.path);
      const fontInfo = fontsObject[fontName];

      if (fontInfo && fontInfo.link === '') {
        continue;
      }

      if (fontInfo && !fontsAdded[fontName]) {
        fontsAdded[fontName] = true;
        result.push({
          fontName,
          html: (id?: string) =>
            `<link href="${fontInfo.link}"${id ? ` id="${id}"` : ''} rel="stylesheet"></link>`,
        });
      }
    }
  }

  return result;
}

export function getPageHtml(options: RedocRawOptions) {
  const jsonOptions = JSON.stringify(options, null, 2)
    .split('\n')
    .map((str, index) => (index === 0 ? str : '      ' + str))
    .join('\n');

  const fontsHtml = generateFonts(options)
    .map(font => font.html())
    .join('\n    ');

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    ${fontsHtml}
    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="redoc-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
    <script>
      Redoc.init('http://petstore.swagger.io/v2/swagger.json', ${jsonOptions}, document.getElementById('redoc-container'))
    </script>
  </body>
</html>
    `;
}
