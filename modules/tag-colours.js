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
    const results = flags.reduce((results, flag) => {
      const tags = [];

      const colors = flag.colors.map(color => {
        const { hue, saturation, lightness } = Color.fromCSS(color.hex);
        const tag = classify({ hue, sat: saturation, lgt: lightness });
        tags.push(tag);
        return {
          ...color,
          tag,
        };
      });

      results[flag.id] = {
        tags: [...new Set(tags)],
        colors,
      };

      return results;
    }, {});

    resolve(results);
  });
