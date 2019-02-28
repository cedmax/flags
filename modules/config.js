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
const mapITEndPoints = require("./manual/maps-it.json");
const mapDEEndPoints = require("./manual/maps-de.json");
const mapESEndPoints = require("./manual/maps-es.json");
const mapJPEndPoints = require("./manual/maps-jp.json");

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
  IT: {
    maps: fetchMaps(mapITEndPoints),
  },
  DE: {
    maps: fetchMaps(mapDEEndPoints),
  },
  ES: {
    maps: fetchMaps(mapESEndPoints),
  },
  JP: {
    ratio: calculateRatio,
    maps: fetchMaps(mapJPEndPoints),
  },
};
