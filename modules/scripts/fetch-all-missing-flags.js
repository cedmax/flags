const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/ratio-adoption-name-es.json");

const skip = ["See also", "Footnotes"];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_country_subdivisions"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);
    const titleContent = $title.find(".mw-headline").text();
    if (!skip.includes(titleContent)) {
      let $container = $($title.nextAll("ul, .columns").get(0));
      const flagContainers = $container.find("li").toArray();
      const flagItems = $container.find('li a[href$=".svg"]').toArray();

      if (flagContainers.length !== flagItems.length) {
        return results;
      }

      const flags = flagContainers.map(flagContainer => {
        const $flagContainer = $(flagContainer);
        const $country = $flagContainer.find("a:last-of-type");
        let country = $country
          .text()
          .replace(/\[(.)+\]/g, "")
          .trim();

        let id = generateId(country);

        let url = cleanUrl($country.attr("href") || "");

        const image =
          "https:" +
          $flagContainer
            .find("img")
            .attr("src")
            .replace("thumb/", "")
            .replace(/\/([0-9]+)px-(.)+/gi, "")
            .trim();

        return {
          id,
          belongsTo: titleContent,
          country,
          image,
          url,
          ...manualData[id],
        };
      });
      results = results.concat(flags).filter(item => item);
    }
    return results;
  }, []);

  helpers.saveFlagFiles(results, callback);
};
