const axios = require("axios");
const async = require("async");
const cheerio = require("cheerio");
const fs = require("fs");
const helpers = require("./helpers");

const path = `${process.cwd()}/src/data/maps`;

module.exports = mapEndPoints => (flags, callback) => {
  async.mapLimit(
    flags,
    3,
    async flag => {
      const { id } = flag;

      const file = `${path}/${id}.png`;
      if (!fs.existsSync(file)) {
        try {
          const { data } = await axios.get(mapEndPoints[id]);
          const $ = cheerio.load(data);
          const fileUrls = $("#file img").attr("src");

          const { data: png } = await axios.get(fileUrls, {
            responseType: "arraybuffer",
            headers: {
              "Content-Type": "image/png",
            },
          });
          fs.writeFileSync(file, png);
        } catch (e) {
          console.log(flag.country, "fetching map failed");
        }
      }

      return {
        id,
        credits: mapEndPoints[id],
      };
    },
    (e, results) => {
      const result = helpers.normaliseData(results, "map");
      callback(result);
    }
  );
};
