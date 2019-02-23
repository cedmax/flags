const async = require("async");
const parse = require("pixelbank");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const helpers = require("./helpers");

const rgbToHex = function(rgb) {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

const convertToHex = function(rgb) {
  const hex = `#${rgb
    .match(/([0-9]+)+/g)
    .map(rgbToHex)
    .join("")}`;
  return hex;
};

const getPixels = async id => {
  const file = `${__dirname}/../src/data/flags/${id}.svg`;
  const image = await loadImage(file);
  const canvas = createCanvas(image.width, image.height);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return parse(ctx.getImageData(0, 0, canvas.width, canvas.height));
};

module.exports = (flags, callback) =>
  async.mapLimit(
    flags,
    3,
    async flag => {
      const { id } = flag;
      const cacheFile = `${__dirname}/.cache/flags/${id}.json`;
      if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, "UTF-8"));
      } else {
        const pixels = getPixels(id);
        const imageData = pixels.reduce((acc, p) => {
          const key = `r${p.color.r}g${p.color.g}b${p.color.b}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        let totalPx = pixels.length;
        if (id === "nepal") {
          totalPx = totalPx - imageData[`r0g0b0`];
          delete imageData[`r0g0b0`];
        }

        const colors = Object.keys(imageData)
          .map(key => {
            const percent = Math.round((imageData[key] * 100) / totalPx);
            const hex = convertToHex(key);
            return !!percent && { hex, percent };
          })
          .filter(color => !!color)
          .sort((a, b) => (a.percent < b.percent ? 1 : -1));

        const result = { id, ...colors };
        fs.writeFileSync(cacheFile, JSON.stringify(result, null, 4), "UTF-8");
        return result;
      }
    },
    (err, results) => {
      const result = helpers.normaliseData(results, "colors");
      callback(result);
    }
  );
