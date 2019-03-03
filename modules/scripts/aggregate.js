const groups = {
  SCAND: ["Denmark", "Finland", "Norway", "Sweden"],
  IT: ["Italy"],
  DE: ["Germany"],
  ES: ["Spain"],
  CH: ["Switzerland"]
}

module.exports = (group) => (unused, callback) => {
  const cachedData = require("../.cache/flags-ALL.json");
  const cachedRatio = require("../.cache/ratio-ALL.json");
  const countries = cachedData
    .filter(flag => groups[group].includes(flag.belongsTo))
    .map(flag => ({
      ...flag,
      ...cachedRatio[flag.id],
    }));

  callback(countries);
};
