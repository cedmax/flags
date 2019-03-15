const async = require("async");
const fs = require("fs");
const helpers = require("./helpers");
const { convertToHex, getPixels } = require("./utilities");
const cliProgress = require("cli-progress");
const path = `${process.cwd()}/modules/.cache/flags`;

module.exports = (flags, callback) =>
  async.mapLimit(
    flags,
    3,
    async flag => {
      const { id, belongsTo } = flag;
      const cacheFile = `${path}/${id}.json`;
      if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, "UTF-8"));
      } else {
        const bar = new cliProgress.Bar(
          {
            format: `[{bar}]  {percentage}% | ${flag.country}${
              flag.belongsTo ? ` | ${flag.belongsTo}` : ""
            }`,
          },
          cliProgress.Presets.shades_classic
        );
        bar.start(1, 0);
        const pixels = await getPixels(id, belongsTo);
        bar.setTotal(pixels.length);
        const imageData = pixels.reduce((acc, p, i) => {
          const key = `r${p.color.r}g${p.color.g}b${p.color.b}`;
          acc[key] = (acc[key] || 0) + 1;
          bar.update(i);
          return acc;
        }, {});

        bar.stop();
        let totalPx = pixels.length;

        if (["nepal", "ohio", "northern-savonia", "satakunta"].includes(id)) {
          totalPx = totalPx - imageData[`r241g241b241`];
          delete imageData[`r241g241b241`];
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
