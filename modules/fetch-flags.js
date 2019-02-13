const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const helpers = require("./helpers");
const async = require("async");
let map;

module.exports = () =>
  new Promise(resolve => {
    const cacheKey = "step1";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching flags from cache");
      return resolve(content);
    }

    axios
      .get("https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags")
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const flagContainers = $("li.gallerybox").toArray();
        map = flagContainers.map(flagContainer => {
          const $flagContainer = $(flagContainer);
          const $link = $flagContainer.find(".gallerytext a");
          const country = $link
            .text()
            .replace("Flag of the", "")
            .replace("Flag of", "")
            .trim();

          const url = helpers.cleanUrl($link.attr("href"));

          const image =
            "https:" +
            $flagContainer
              .find("img")
              .attr("src")
              .replace("thumb/", "")
              .replace(/\/([0-9]+)px-(.)+/gi, "")
              .trim();

          return {
            country,
            image,
            url,
          };
        });

        async.mapLimit(
          map,
          2,
          (flag, cb) => {
            const { country, url } = flag;
            const id = helpers.generateId(country);
            const file = `${__dirname}/../src/data/flags/${id}.svg`;

            if (!fs.existsSync(file)) {
              axios
                .get(flag.image)
                .then(({ data: svg }) => {
                  fs.writeFileSync(file, svg, "UTF-8");

                  cb(null, {
                    id,
                    country,
                    url,
                  });
                })
                .catch(() => console.log(flag.country, "failed"));
            } else {
              cb(null, {
                id,
                country,
                url,
              });
            }
          },
          (e, result) => {
            console.log(cacheKey, "fetching flags");
            helpers.saveCache(cacheKey, result);
            resolve(result);
          }
        );
      });
  });
