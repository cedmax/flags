const groups = {
  NORDIC: ["Denmark", "Finland", "Norway", "Sweden"],
  SAM: [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Peru",
    "Venezuela",
    "Ecuador",
  ],
  FIGS: ["Germany", "Italy", "Spain", "France"],
  CH: ["Switzerland"],
};

module.exports = (group) => (unused, callback) => {
  const cachedData = [
    ...require("../.cache/flags-ALL.json"),
    ...require("../.cache/flags-EC.json"),
  ];
  const cachedRatio = {
    ...require("../.cache/ratio-ALL.json"),
    ...require("../.cache/ratio-EC.json"),
  };
  const countries = cachedData
    .filter((flag) => groups[group].includes(flag.belongsTo))
    .map((flag) => ({
      ...flag,
      ...cachedRatio[flag.id],
    }));

  callback(countries);
};
