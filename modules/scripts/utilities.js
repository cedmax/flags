const parse = require("pixelbank");
const { createCanvas, loadImage } = require("canvas");
const slugify = require("slugify");

exports.generateId = string => slugify(string).toLowerCase();
exports.cleanUrl = string => string.replace("_the_", "_").toLowerCase();

const rgbToHex = function(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

exports.convertToHex = rgbArray => {
  return `#${rgbArray.map(rgbToHex).join("")}`;
};

const colors = [
  { prop: "lgt", match: "min", threshold: 0.1, value: "black" },
  { prop: "lgt", match: "max", threshold: 0.8, value: "white" },
  { prop: "sat", match: "min", threshold: 0.2, value: "gray" },
  { prop: "hue", match: "min", threshold: 29, value: "red" },
  { prop: "hue", match: "min", threshold: 89, value: "yellow" },
  { prop: "hue", match: "min", threshold: 179, value: "green" },
  { prop: "hue", match: "min", threshold: 209, value: "cyan" },
  { prop: "hue", match: "min", threshold: 269, value: "blue" },
  { prop: "hue", match: "min", threshold: 329, value: "magenta" },
  { prop: "hue", match: "min", threshold: 360, value: "red" },
];

exports.classifyColor = hsv => {
  hsv.hue = Math.round(hsv.hue * 360);

  return colors.find(({ prop, match, threshold }) => {
    return Math[match](hsv[prop], threshold) === hsv[prop];
  }).value;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
exports.gcd = gcd;

const path = `${process.cwd()}/src/data/flags`;
exports.getPixels = async id => {
  const file = `${path}/${id}.svg`;
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return parse(ctx.getImageData(0, 0, canvas.width, canvas.height));
};
