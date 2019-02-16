const fetchFlags = require("./fetch-flags");
const fetchAdoption = require("./fetch-adoption");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const analyseColours = require("./analyse-colours");
const tagColours = require("./tag-colours");
const tagContinents = require("./fetch-continents");
const fetchAnthems = require("./fetch-anthems");
const { consolidate, validate, withCache } = require("./helpers");

const fetchFlagsCache = withCache(fetchFlags, "flags");

fetchFlagsCache()
  .then(withCache(fetchAdoption, "adoption"))
  .then(withCache(fetchRatio, "ratio"))
  .then(withCache(fetchName, "name"))
  .then(withCache(tagContinents, "continents"))
  .then(withCache(analyseColours, "color-analysis"))
  .then(withCache(tagColours, "color-tagging"))
  .then(withCache(fetchAnthems, "anthems"))
  .then(validate)
  .then(consolidate);
