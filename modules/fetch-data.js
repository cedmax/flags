const analyseColours = require("./scripts/analyse-colours");
const tagColours = require("./scripts/tag-colours");
const { consolidate, validate, mergeData } = require("./scripts/helpers");

module.exports = (fetchFlags, fetchers = {}, group) => {
  const fetchWorldFlagsCache = mergeData(fetchFlags, "flags", group);
  return fetchWorldFlagsCache()
    .then(async flags => {
      for (const fetcherKey in fetchers) {
        const result = await mergeData(fetchers[fetcherKey], fetcherKey, group)(
          flags
        );
        flags = result;
      }
      return flags;
    })
    .then(mergeData(analyseColours))
    .then(mergeData(tagColours, "color-tagging", group))
    .then(validate(group))
    .then(consolidate(group));
};
