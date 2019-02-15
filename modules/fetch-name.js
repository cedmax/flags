const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "name";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching flag names from cache");
      return resolve(helpers.merge(flags, content));
    }

    const results = {};
    axios
      .get("https://en.wikipedia.org/wiki/List_of_flag_names")
      .then(({ data }) => {
        const $ = cheerio.load(data);

        flags.forEach(flag => {
          const items = $(`a i`).toArray();
          const match = items.find(item => {
            const url = $(item)
              .parent()
              .attr("href");

            return helpers.cleanUrl(url) === flag.url;
          });

          if (match) {
            results[flag.id] = { name: $(match).text() };
          }
        });

        results["united-kingdom"] = "Union Jack";

        helpers.saveCache(cacheKey, results);
        console.log(cacheKey, "fetching flag names");
        resolve(helpers.merge(flags, results));
      });
  });
