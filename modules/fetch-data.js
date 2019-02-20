const fetchFlags = require("./fetch-flags");
const fetchAdoption = require("./fetch-adoption");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const analyseColours = require("./analyse-colours");
const tagColours = require("./tag-colours");
const tagContinents = require("./fetch-continents");
const fetchYoutubeAnthems = require("./youtube-anthems");
const { consolidate, validate, mergeData } = require("./helpers");

const fetchFlagsCache = mergeData(fetchFlags, "flags");

fetchFlagsCache()
  .then(mergeData(fetchAdoption, "adoption"))
  .then(mergeData(fetchRatio, "ratio"))
  .then(mergeData(fetchName, "name"))
  .then(mergeData(tagContinents, "continents"))
  .then(mergeData(analyseColours))
  .then(mergeData(tagColours, "color-tagging"))
  .then(mergeData(fetchYoutubeAnthems, "anthems"))
  .then(validate)
  .then(consolidate);
