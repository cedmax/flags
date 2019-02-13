const fetchFlags = require("./fetch-flags");
const fetchAdoption = require("./fetch-adoption");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const analyseColours = require("./analyse-colours");
const tagColours = require("./tag-colours");
const tagContinents = require("./fetch-continents");

const { consolidate } = require("./helpers");

fetchFlags()
  .then(fetchAdoption)
  .then(fetchRatio)
  .then(fetchName)
  .then(analyseColours)
  .then(tagColours)
  .then(tagContinents)
  .then(consolidate);
