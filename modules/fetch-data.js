const fetchFlags = require("./fetch-flags");
const fetchAdoption = require("./fetch-adoption");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const analyseColours = require("./analyse-colours");
const tagFlags = require("./tag-flags");

const { consolidate } = require("./helpers");

fetchFlags()
  .then(fetchAdoption)
  .then(fetchRatio)
  .then(fetchName)
  .then(analyseColours)
  .then(tagFlags)
  .then(consolidate);
