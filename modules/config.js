const fetchUsMaps = require("./scripts/fetch-us-maps");
const fetchAdoption = require("./scripts/fetch-adoption");
const calculateUsRatio = require("./scripts/calculate-us-ratio");
const fetchRatio = require("./scripts/fetch-ratio");
const fetchName = require("./scripts/fetch-name");
const fetchMaps = require("./scripts/fetch-maps");
const addStateSongs = require("./scripts/add-state-songs");
const tagContinents = require("./scripts/fetch-continents");
const fetchYoutubeAnthems = require("./scripts/youtube-anthems");

module.exports = {
  world: {
    adoption: fetchAdoption,
    ratio: fetchRatio,
    name: fetchName,
    anthems: fetchYoutubeAnthems,
    continents: tagContinents,
    maps: fetchMaps,
  },
  US: {
    ratio: calculateUsRatio,
    maps: fetchUsMaps,
    "state-songs": addStateSongs,
  },
};
