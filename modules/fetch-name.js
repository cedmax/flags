const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    axios
      .get("https://en.wikipedia.org/wiki/List_of_flag_names")
      .then(({ data }) => {
        const $ = cheerio.load(data);

        const results = flags.reduce((results, flag) => {
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
          return results;
        }, {});

        results["united-kingdom"] = "Union Jack";
        resolve(results);
      });
  });
