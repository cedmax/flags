const Color = require("color-converter").default;
const { classifyColor } = require("./utilities");

module.exports = (flags, callback) => {
  const results = flags.reduce((results, flag) => {
    const tags = [];

    const colors = flag.colors.map((color) => {
      const { hue, saturation, lightness } = Color.fromCSS(color.hex);
      const tag = classifyColor({ hue, sat: saturation, lgt: lightness });
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

  callback(results);
};
