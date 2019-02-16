const async = require("async");
const parse = require("pixelbank");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

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

module.exports = flags =>
  new Promise(resolve => {
    async.mapLimit(
      flags,
      3,
      async flag => {
        const cacheFile = `${__dirname}/.cache/flags/${flag.id}.json`;
        if (fs.existsSync(cacheFile)) {
          return JSON.parse(fs.readFileSync(cacheFile, "UTF-8"));
        } else {
          const imageData = {};

          const file = `${__dirname}/../src/data/flags/${flag.id}.svg`;

          const image = await loadImage(file);
          const canvas = createCanvas(image.width, image.height);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const pixels = parse(
            ctx.getImageData(0, 0, canvas.width, canvas.height)
          );
          pixels.forEach(p => {
            const key = `r${p.color.r}g${p.color.g}b${p.color.b}`;
            imageData[key] = (imageData[key] || 0) + 1;
          });
          let totalPx = pixels.length;

          if (flag.id === "nepal") {
            totalPx = totalPx - imageData[`r0g0b0`];
            delete imageData[`r0g0b0`];
          }

          const data = Object.keys(imageData)
            .map(key => {
              const percent = (imageData[key] * 100) / totalPx;

              if (percent < 0.74) {
                return null;
              } else {
                const hex = convertToHex(key);

                return {
                  hex,
                  percent: Math.round(percent),
                };
              }
            })
            .filter(color => !!color)
            .sort((a, b) => {
              if (a.percent < b.percent) {
                return 1;
              } else {
                return -1;
              }
            });
          console.log(flag.country);
          const result = {
            id: flag.id,
            colors: data,
          };
          fs.writeFileSync(cacheFile, JSON.stringify(result), "UTF-8");
          return result;
        }
      },
      (err, result) => {
        const results = result.reduce((acc, { id, colors }) => {
          acc[id] = { colors };
          return acc;
        }, {});
        resolve(results);
      }
    );
  });
