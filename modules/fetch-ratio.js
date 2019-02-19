const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");
const manualRatio = require("./manual/ratio.json");

module.exports = async (flags, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags"
  );
  const $ = cheerio.load(data);
  const rows = $(".wikitable tr[id]").toArray();

  const results = rows.reduce((results, row) => {
    const tds = $(row)
      .find("td")
      .toArray();
    const [ignore, tdLink, tdRatio] = tds;

    const link = $(tdLink).find("a:first-of-type");
    const linkUrl = helpers.cleanUrl(link.attr("href"));
    const linkText = $(tdLink)
      .text()
      .trim();

    if (!linkText.includes("(")) {
      const found = flags.find(flag => flag.url === linkUrl);
      if (found) {
        const ratio = $(tdRatio)
          .html()
          .replace(/<span(.)+<\/span>/, "")
          .replace(/ \((.)+/, "")
          .trim();

        results[found.id] = { ratio };
      }
    }
    return results;
  }, {});

  Object.keys(manualRatio).forEach(key => {
    results[key] = { ratio: manualRatio[key] };
  });

  callback(results);
};
