exports.byColour = (filtered, filters) =>
  filtered.filter(({ tags }) => filters.every((tag) => tags.includes(tag)));

exports.byContinent = (filtered, continent) =>
  filtered.filter((flag) => flag.continents.includes(continent));

exports.bySearch = (filtered, q) => {
  const qF = q.toLowerCase();
  const matches = ["(", " "].map((sign) => sign + qF);

  return filtered.filter((flag) => {
    const country = flag.country.toLowerCase();
    const belongsTo = (flag.belongsTo && flag.belongsTo.toLowerCase()) || "";
    return (
      country.startsWith(qF) ||
      matches.some(
        (match) => country.includes(match) || belongsTo.includes(match)
      ) ||
      belongsTo.startsWith(qF)
    );
  });
};
