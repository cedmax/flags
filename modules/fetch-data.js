const fetchFlags = require("./fetch-flags");
const fetchAdoption = require("./fetch-adoption");
const fetchRatio = require("./fetch-ratio");
const fetchName = require("./fetch-name");
const analyseColours = require("./analyse-colours");
const tagColours = require("./tag-colours");
const tagContinents = require("./fetch-continents");
const fetchAnthems = require("./fetch-anthems");

const { consolidate, validate } = require("./helpers");

fetchFlags()
  .then(fetchAdoption)
  .then(fetchRatio)
  .then(fetchName)
  .then(tagContinents)
  .then(analyseColours)
  .then(tagColours)
  .then(fetchAnthems)
  .then(validate)
  .then(consolidate);
