const axios = require("axios");
const async = require("async");
const helpers = require("./helpers");

const tracks = [];
let next =
  "https://api.spotify.com/v1/playlists/7w2g4N2CWWeyysqaxWyLTU/tracks?offset=0&limit=100&market=GB";

const associateAnthemsToFlags = (flags, tracks, resolve) => {
  const results = {};
  tracks.forEach(track => {
    const name = track.name.match(/^[^:[]+/)[0].trim();
    const id = helpers
      .generateId(name)
      .replace("china-people's-republic-of", "china")
      .replace("congo-kinshasa", "democratic-republic-of-the-congo")
      .replace("congo-brazzaville", "republic-of-the-congo")
      .replace("korea-north", "north-korea")
      .replace("korea-south", "south-korea")
      .replace("gabon-la-concorde", "gabon")
      .replace("micronesia", "federated-states-of-micronesia")
      .replace("palestine", "state-of-palestine")
      .replace("united-states-of-america", "united-states")
      .replace("north-cyprus", "turkish-republic-of-northern-cyprus");

    const index = flags.findIndex(flag => flag.id === id);

    if (flags[index] && !flags[index].anthem) {
      results[id] = {
        anthem: track.uri,
      };
    }
  });

  resolve(results);
};

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "spotify";
    const spotifyTracks = helpers.resolveCache(cacheKey);

    if (!spotifyTracks) {
      async.whilst(
        () => {
          return !!next;
        },
        async () => {
          const { data } = await axios.get(next, {
            headers: {
              Referer:
                "https://open.spotify.com/playlist/7w2g4N2CWWeyysqaxWyLTU?si=nDXDfJT5SAyCDbrTzxtu3g",
              origin: "https://open.spotify.com",
              authorization:
                "Bearer BQBt3tDmS79WcOCLf96yvnM_osplblF02k4EuSgYAmxY-6dIusU5nrK0D-x6QMpc2r9bPn6ZnLIxJmHAI78",
              authority: "api.spotify.com",
            },
          });
          next = data.next;
          data.items.forEach(item => tracks.push(item.track));
        },
        () => {
          console.log(cacheKey, "fetching spotify anthems");
          helpers.saveCache(cacheKey, tracks);
          associateAnthemsToFlags(flags, tracks, resolve);
        }
      );
    } else {
      console.log(cacheKey, "fetching spotify anthems from cache");

      associateAnthemsToFlags(flags, spotifyTracks, resolve);
    }
  });
