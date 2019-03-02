const scand = ["Denmark", "Finland", "Norway", "Sweden"];

module.exports = (unused, callback) => {
  const cachedData = require("../.cache/flags-ALL.json");
  const cachedRatio = require("../.cache/ratio-ALL.json");
  const scandinavian = cachedData
    .filter(flag => scand.includes(flag.belongsTo))
    .map(flag => ({
      ...flag,
      ...cachedRatio[flag.id],
    }));

  callback(scandinavian);
};
