const async = require("async");
const { loadImage } = require("canvas");
const manualRatio = require("./manual/ratio-us.json");
const helpers = require("./helpers");

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
module.exports = (flags, callback) =>
  async.mapLimit(
    flags,
    3,
    async flag => {
      if (manualRatio[flag.id]) {
        return {
          ...flag,
          ratio: manualRatio[flag.id],
        };
      }

      const file = `${__dirname}/../src/data/flags/${flag.id}.svg`;
      const { width, height } = await loadImage(file);
      const d = gcd(width, height);
      return {
        id: flag.id,
        ratio: `${height / d}:${width / d}`,
      };
    },
    (err, results) => {
      const result = helpers.normaliseData(results, "ratio");
      callback(result);
    }
  );
