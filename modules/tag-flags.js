const helpers = require("./helpers");
const Color = require("color-converter").default;

const classify = ({ hue, sat, lgt }) => {
  hue = hue * 360;

  if (lgt < 0.1) return "black";
  if (lgt > 0.8) return "white";
  if (sat < 0.25) return "gray";
  if (hue < 30) return "red";
  if (hue < 90) return "yellow";
  if (hue < 180) return "green";
  if (hue < 210) return "cyan";
  if (hue < 270) return "blue";
  if (hue < 330) return "magenta";
  return "red";
};

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "step6";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "retrieve tags from cache");
      return resolve(content);
    }

    const flagsWithTags = flags.map(flag => {
      const tags = [];
      const average = Math.floor(
        flag.colors.reduce((sum, color) => {
          sum = sum + color.percent;
          return sum;
        }, 0) / flag.colors.length
      );

      const colors = flag.colors.map(color => {
        if (color.percent >= average) {
          const { hue, saturation, lightness } = Color.fromCSS(color.hex);
          const tag = classify({ hue, sat: saturation, lgt: lightness });
          tags.push(tag);
          return {
            ...color,
            tag,
          };
        } else {
          return color;
        }
      });

      return {
        ...flag,
        colors: colors,
        tags: [...new Set(tags)],
      };
    });

    helpers.saveCache(cacheKey, flagsWithTags);
    console.log(cacheKey, "retrieve tags");
    resolve(flagsWithTags);
  });
