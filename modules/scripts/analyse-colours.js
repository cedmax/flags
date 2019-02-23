const async = require("async");
const fs = require("fs");
const helpers = require("./helpers");
const { convertToHex, getPixels } = require("./utilities");

const path = `${process.cwd()}/modules/.cache/flags`;

module.exports = (flags, callback) =>
  async.mapLimit(
    flags,
    3,
    async flag => {
      const { id } = flag;
      const cacheFile = `${path}/${id}.json`;
      if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, "UTF-8"));
      } else {
        const pixels = await getPixels(id);
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
            const hex = convertToHex(key.match(/([0-9]+)+/g));
            return !!percent && { hex, percent };
          })
          .filter(color => !!color)
          .sort((a, b) => (a.percent < b.percent ? 1 : -1));

        const result = { id, colors };
        fs.writeFileSync(cacheFile, JSON.stringify(result, null, 4), "UTF-8");
        return result;
      }
    },
    (err, results) => {
      const result = helpers.normaliseData(results, "colors");
      callback(result);
    }
  );
