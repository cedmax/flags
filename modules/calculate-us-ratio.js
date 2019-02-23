const async = require("async");
const { loadImage } = require("canvas");
const manualRatio = require("./manual/ratio-us.json");

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
    (err, result) => {
      const results = result.reduce((acc, { id, ratio }) => {
        acc[id] = { ratio };
        return acc;
      }, {});
      callback(results);
    }
  );
