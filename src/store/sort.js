const coverage = (filters, flag) =>
  filters.reduce((acc, filter) => {
    const { percent } = flag.colors.find(({ tag }) => tag === filter);
    acc += percent;
    return acc;
  }, 0);

exports.byColour = (filtered, filters) =>
  filtered.sort((flagA, flagB) => {
    const coverageA = coverage(filters, flagA);
    const coverageB = coverage(filters, flagB);

    if (coverageA < coverageB) {
      return 1;
    } else {
      return -1;
    }
  });

exports.byName = (filtered) =>
  filtered.sort((a, b) =>
    a.country.toLowerCase().localeCompare(b.country.toLowerCase())
  );

exports.byAdoption = (filtered) =>
  (filtered = filtered.sort((a, b) =>
    a.adoption.sort > b.adoption.sort ? 1 : -1
  ));

const ratio = (ratio) => {
  const parts = ratio.split(":");
  return parseFloat(parts[0]) / parseFloat(parts[1]);
};

exports.byRatio = (filtered) =>
  filtered.sort((a, b) => {
    const aRatio = ratio(a.ratio);
    const bRatio = ratio(b.ratio);

    return bRatio - aRatio;
  });
