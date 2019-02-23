const axios = require("axios");
const async = require("async");
const cheerio = require("cheerio");
const fs = require("fs");
const { generateId } = require("./utilities");
const manualMaps = require("../manual/maps-us.json");

const path = `${process.cwd()}/src/data/maps`;

module.exports = async (flags, callback) => {
  const { data } = await axios.get(
    "https://commons.wikimedia.org/wiki/Locator_maps_for_U.S._states"
  );
  const $ = cheerio.load(data);
  const mapContainers = $("li.gallerybox").toArray();

  async.mapLimit(
    mapContainers,
    3,
    async mapContainer => {
      const text = $(mapContainer)
        .find(".gallerytext a")
        .text()
        .trim();

      const id = generateId(text).replace("georgia", "georgia-us");
      const file = `${path}/${id}.png`;
      if (!fs.existsSync(file)) {
        const imgUrl = $(mapContainer)
          .find("img")
          .attr("src")
          .replace("/120px-", "/640px-");
        try {
          const { data: png } = await axios.get(imgUrl, {
            responseType: "arraybuffer",
            headers: {
              "Content-Type": "image/png",
            },
          });
          fs.writeFileSync(file, png);
        } catch (e) {
          console.log(id, "failed");
        }
      }

      return id;
    },
    (e, results) => {
      const result = Object.keys(manualMaps).reduce((acc, country) => {
        acc[country] = {
          map: {
            credits: manualMaps[country],
          },
        };
        return acc;
      }, {});

      callback(result);
    }
  );
};
