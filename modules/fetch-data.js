const fetchWorldFlags = require("./fetch-flags");
const fetchUsFlags = require("./fetch-us-flags");
const fetchUsMaps = require("./fetch-us-maps");
const fetchAdoption = require("./fetch-adoption");
const calculateUsRatio = require("./calculate-us-ratio");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const fetchMaps = require("./fetch-maps");
const addStateSongs = require("./add-state-songs");
const analyseColours = require("./analyse-colours");
const tagColours = require("./tag-colours");
const tagContinents = require("./fetch-continents");
const fetchYoutubeAnthems = require("./youtube-anthems");
const { consolidate, validate, mergeData } = require("./helpers");

const fetchAndAggregate = (fetchFlags, fetchers, group) => {
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

(async () => {
  await fetchAndAggregate(fetchWorldFlags, {
    adoption: fetchAdoption,
    ratio: fetchRatio,
    name: fetchName,
    anthems: fetchYoutubeAnthems,
    continents: tagContinents,
    maps: fetchMaps,
  });
  await fetchAndAggregate(
    fetchUsFlags,
    {
      ratio: calculateUsRatio,
      maps: fetchUsMaps,
      "state-songs": addStateSongs,
    },
    "US"
  );
})();
