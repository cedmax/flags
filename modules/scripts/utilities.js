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

exports.classifyColor = ({ hue, sat, lgt }) => {
  hue = hue * 360;

  if (lgt < 0.1) return "black";
  if (lgt > 0.8) return "white";
  if (sat < 0.2) return "gray";
  if (hue < 30) return "red";
  if (hue < 90) return "yellow";
  if (hue < 180) return "green";
  if (hue < 210) return "cyan";
  if (hue < 270) return "blue";
  if (hue < 330) return "magenta";
  return "red";
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
