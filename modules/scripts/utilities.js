const parse = require("pixelbank");
const { createCanvas, loadImage } = require("canvas");
const slugify = require("slugify");

const generateId = (string) =>
  slugify(
    string.replace("'", "-").replace("Ō", "o").replace("ō", "o")
  ).toLowerCase();

exports.generateId = generateId;
const getPath = (path, subfolder) =>
  subfolder
    ? `${path}/src/data/flags/${generateId(subfolder)}`
    : `${path}/src/data/flags`;
exports.getPath = getPath;
exports.cleanUrl = (string) => string.replace("_the_", "_").toLowerCase();

const rgbToHex = function (rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

exports.convertToHex = (rgbArray) => {
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

exports.classifyColor = (hsv) => {
  hsv.hue = Math.round(hsv.hue * 360);

  return colors.find(({ prop, match, threshold }) => {
    return Math[match](hsv[prop], threshold) === hsv[prop];
  }).value;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
exports.gcd = gcd;

exports.getPixels = async (id, subfolder) => {
  try {
    const file = `${getPath(process.cwd(), subfolder)}/${id}.svg`;
    const image = await loadImage(file);
    let { width, height } = image;
    if (width > 2500 || height > 2500) {
      height = height / 2;
      width = width / 2;
    }
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f1f1f1";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return parse(data);
  } catch (e) {
    console.log("PROBLEM WITH", id, subfolder);
    throw e;
  }
};
