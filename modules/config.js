const fetchUsMaps = require("./scripts/fetch-us-maps");
const fetchAdoption = require("./scripts/fetch-adoption");
const calculateRatio = require("./scripts/calculate-ratio");
const fetchRatio = require("./scripts/fetch-ratio");
const fetchName = require("./scripts/fetch-name");
const fetchMaps = require("./scripts/fetch-maps");
const addStateSongs = require("./scripts/add-state-songs");
const tagContinents = require("./scripts/fetch-continents");
const fetchYoutubeAnthems = require("./scripts/youtube-anthems");

const mapEndPoints = require("./manual/maps.json");
const extraMaps = require("./manual/extra-maps.json");

module.exports = {
  world: {
    adoption: fetchAdoption,
    ratio: fetchRatio,
    name: fetchName,
    anthems: fetchYoutubeAnthems,
    continents: tagContinents,
    maps: fetchMaps(mapEndPoints),
  },
  US: {
    ratio: calculateRatio,
    maps: fetchUsMaps,
    "state-songs": addStateSongs,
  },
  JP: {
    ratio: calculateRatio,
    maps: fetchMaps(extraMaps),
  },
  IT: {
    maps: fetchMaps(extraMaps),
  },
  DE: {
    maps: fetchMaps(extraMaps),
  },
  ES: {
    maps: fetchMaps(extraMaps),
  },
  all: {
    ratio: calculateRatio,
  },
};
