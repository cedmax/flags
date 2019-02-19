const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");

module.exports = async (flags, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_flag_names"
  );
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
  callback(results);
};
