const async = require("async");
const helpers = require("./helpers");
const parse = require("pixelbank");
const { createCanvas, loadImage } = require("canvas");

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
    const cacheKey = "step5";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "retrieve colors from cache");
      return resolve(content);
    }

    async.mapLimit(
      flags,
      3,
      async flag => {
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
        return {
          ...flag,
          colors: data,
        };
      },
      (err, result) => {
        helpers.saveCache(cacheKey, result);
        console.log(cacheKey, "retrieve colors");
        resolve(result);
      }
    );
  });
