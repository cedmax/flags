const axios = require("axios");
const async = require("async");
const cheerio = require("cheerio");
const mapEndPoints = require("./manual/maps.json");
const fs = require("fs");

module.exports = (flags, callback) => {
  async.mapLimit(
    flags,
    3,
    async flag => {
      const { id } = flag;

      const file = `${__dirname}/../src/data/maps/${id}.png`;
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
          console.log(flag.country, "failed");
        }
      }

      return {
        id,
        credits: mapEndPoints[id],
      };
    },
    (e, results) => {
      const result = results.reduce((acc, map) => {
        const { id } = map;
        delete map.id;
        acc[id] = { map };
        return acc;
      }, {});
      callback(result);
    }
  );
};
