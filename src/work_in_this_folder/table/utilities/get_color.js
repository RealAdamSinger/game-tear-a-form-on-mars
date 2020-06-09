
const md5 = require("md5");
const _ = require("lodash");

var tinycolor = require('tinycolor2')

const pallet = {
  f: "#FFF",
  e: "#EEE",
  d: "#DDD",
  c: "#CCC",
  b: "#BBB",
  a: "#AAA",
  8: "#888",
  6: "#666",
  4: "#444",
  2: "#222",
  0: "#000",
  grey: "rgb(170, 170, 170)",
  unknown: "rgb(170, 170, 170)",
  green: "#5CB85C",
  lightGreen: "#9FEC9F",
  blue: "#428BCA",
  cyan: "#5BC0DE",
  yellow: "#FFE600",
  orange: "#E4804E",
  red: "#d9534f",
  purple: "#9c27b0"
};

const colorMap = {
  unspecified: "a",
  unknown: "a",
  default: "a",
  success: "green",
  active: "green",
  primary: "blue",
  online: "blue",
  danger: "red",
  error: "red",
  down: "red",
  unplanned: "red",
  planned: "orange",
  blocked: "purple",
  starved: "cyan",
  info: "cyan",
  warning: "yellow",
  overcycle: "yellow",
  beware: "orange",
  white: "10",
  black: "0",
  active: "green",
  online: "blue",
  disabled: "grey",
  down: "red",
  details: "#6E33A4",
  //WO colors
  overProduced: 'purple',
  underProduced: 'orange',
  upcoming: 'cyan',
  complete: 'green',
  incomplete: 'grey',
  inProgress: 'blue',
  skipped: 'grey',
};

// check out https://www.npmjs.com/package/color at some point
const colorFunctions = {
  hexToRgb(hex) {
    if (_.isArray(hex)) return hex;
    if (hex.length === 3) {
      hex += hex;
    } else if (hex.length === 4) {
      hex = hex[0] + hex.substr(1, 3) + hex.substr(1, 3);
    }
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      result = hex.replace(/[^\d,]/g, "").split(",");
    } else {
      result = _.drop(result, 1);
    }
    // isrgb already
    return result
      ? [
        parseInt(result[0], 16),
        parseInt(result[1], 16),
        parseInt(result[2], 16)
      ]
      : null;
  },
  hexToRgbString(hex) {
    const rgb = this.hexToRgb(hex);
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  },
  hexToRgbaString(hex, opacity) {
    opacity = opacity || 0.6;
    const rgb = this.hexToRgb(hex);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
  },
  getOpacColor(color, opacity) {
    return this.hexToRgbaString(
      this[color] || color || this.color0,
      opacity || 0.6
    );
  },
  shadeRGBColor(rgb, percent) {
    const t = percent < 0 ? 0 : 255;

    const p = percent < 0 ? percent * -1 : percent;

    return [
      Math.round((t - rgb[0]) * p) + rgb[0],
      Math.round((t - rgb[1]) * p) + rgb[1],
      Math.round((t - rgb[2]) * p) + rgb[2]
    ];
  },
  blendRGBColors(c0, c1, p) {
    const f = c0.split(",");
    const t = c1.split(",");
    const R = parseInt(f[0].slice(4));
    const G = parseInt(f[1]);
    const B = parseInt(f[2]);
    return `rgb(${Math.round((parseInt(t[0].slice(4)) - R) * p) +
      R},${Math.round((parseInt(t[1]) - G) * p) + G},${Math.round(
        (parseInt(t[2]) - B) * p
      ) + B})`;
  }
};

function rgbToHex(rgbString) {
  if (typeof rgbString !== "string" || rgbString.slice(0, 3) !== "rgb") {
    console.error("rgbToHex requires type string of format rgb(num, num, num)");
    return;
  }

  const numbers = rgbString
    .split(/(\(|\))/)
    .slice(2, 3)
    .join("")
    .split(",")
    .slice(0, 3);

  const hexNums = numbers.map(num => Number(num).toString(16)).join("");

  return `#${hexNums}`;
}


function colorFromString(color) {
  color = md5(color);
  let hash = 0;
  for (let i = 0; i < color.length; i++) {
    hash = color.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hex =
    ((hash >> 24) & 0xff).toString(16) +
    ((hash >> 16) & 0xff).toString(16) +
    ((hash >> 8) & 0xff).toString(16) +
    (hash & 0xff).toString(16);

  return `#${hex.substring(0, 6)}`;
}

const Color = require("color");

const _colorCache = new Map();
// Hackfix: the 3rd parameter _fromString, is to allow us to get colors
// from a string while still being able to cache the result.
const getColor = function getColor(color, options, _fromString = false) {
  const originalColor = color;
  let shouldCache = false;

  if (!options) {
    if (_colorCache.has(originalColor)) {
      return _colorCache.get(originalColor);
    }

    shouldCache = true;
    options = {};
  }

  let parsedColor;

  if (colorMap[color]) {
    color = colorMap[color];
  }

  color = pallet[color] || color;

  if (!color) color = pallet.unknown;

  try {
    parsedColor = Color(color);
  } catch (err) {
    try {
      if (options.fromString || _fromString) {
        color = colorFromString(originalColor);
      }
      parsedColor = Color(color);
    } catch (err) {
      parsedColor = Color(pallet.unknown);
    }
  }

  if (options.hex) return parsedColor.hex();

  if (options.lighten !== undefined) {
    const lightenBy = options.lighten * 100;
    if (lightenBy > 0) {
      parsedColor = Color(tinycolor(parsedColor.rgb().toString()).lighten(lightenBy).toString());
    } else {
      parsedColor = Color(tinycolor(parsedColor.rgb().toString()).darken(Math.abs(lightenBy)).toString());
    }
  }

  if (options.opacity !== undefined) {
    // opaquer opeartes on the range of -1 and 1
    const opaquerBy = options.opacity - 1;
    parsedColor = parsedColor.opaquer(opaquerBy);
  }

  const colorString = parsedColor.rgb().toString();
  if (shouldCache) _colorCache.set(originalColor, colorString);

  return colorString;
};

const _contrastColorCache = new Map();
getColor.contrast = function (color, options) {
  if (!options && _contrastColorCache.has(color)) return _contrastColorCache.get(color);

  let baseColor = getColor(color);
  if (baseColor.slice(0, 4) === "rgba") {
    baseColor = baseColor.slice(5);
  } else {
    baseColor = baseColor.slice(4);
  }
  baseColor = _.split(baseColor, ",");

  // credit due to https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
  let r = baseColor[0];

  let g = baseColor[1];

  let b = baseColor[2];
  // removing the ')' at the end
  b = b.slice(0, b.length - 1);

  let contrastColor;
  if (_.get(options, ["type"]) === "color") {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    contrastColor = `rgb(${r}, ${g}, ${b})`;
  } else if (_.get(options, ["type"]) === "monochrome") {
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    g = Math.round((r + g + b) / 3);
    contrastColor = `rgb(${g}, ${g}, ${g})`;
  } else {
    // http://stackoverflow.com/a/3943023/112731
    contrastColor = r * 0.299 + g * 0.587 + b * 0.114 > 186
      ? "rgb(0, 0, 0)"
      : "rgb(255, 255, 255)";
  }

  if (!options) _contrastColorCache.set(color, contrastColor);

  // currently don't do anything to support opactiy
  return contrastColor;
};
export {
  getColor,
  rgbToHex
}