const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "step4";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching flag names from cache");
      return resolve(content);
    }

    axios
      .get("https://en.wikipedia.org/wiki/List_of_flag_names")
      .then(({ data }) => {
        const $ = cheerio.load(data);

        const namedFlags = flags.map(flag => {
          const items = $(`a i`).toArray();
          const match = items.find(item => {
            const url = $(item)
              .parent()
              .attr("href");

            return helpers.cleanUrl(url) === flag.url;
          });

          return match ? { ...flag, name: $(match).text() } : flag;
        });

        const ukIdx = namedFlags.findIndex(({id}) => id ==='united-kingdom');
        namedFlags.splice(ukIdx, 1, {
          ...namedFlags[ukIdx],
          name: 'Union Jack',
        });

        helpers.saveCache(cacheKey, namedFlags);
        console.log(cacheKey, "fetching flag names");
        resolve(namedFlags);
      });
  });
