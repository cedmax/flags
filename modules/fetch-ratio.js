const axios = require("axios");
const cheerio = require("cheerio");
const helpers = require("./helpers");
const manualRatio = require("./manual/ratio.json");

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "step3";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching ratio from cache");
      return resolve(content);
    }

    axios
      .get(
        "https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags"
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const rows = $(".wikitable tr[id]").toArray();

        rows.forEach(row => {
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
            const countryIdx = flags.findIndex(flag => flag.url === linkUrl);
            if (countryIdx !== -1) {
              const ratio = $(tdRatio)
                .html()
                .replace(/<span(.)+<\/span>/, "")
                .replace(/ \((.)+/, "")
                .trim();

              flags.splice(countryIdx, 1, {
                ...flags[countryIdx],
                ratio,
              });
            }
          }
        });

        const allRatio = flags.map(flag => {
          return manualRatio[flag.id]
            ? {
                ...flag,
                ratio: manualRatio[flag.id],
              }
            : flag;
        });

        helpers.saveCache(cacheKey, allRatio);
        console.log(cacheKey, "fetching ratio");
        resolve(allRatio);
      });
  });
