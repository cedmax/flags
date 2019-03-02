const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/extra-data.json");
const extraFlags = require("../manual/extra-flags.json");

const skip = [
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Brunei",
  "Comoros",
  "Georgia",
  "India",
  "Iraq",
  "Japan",
  "Mexico",
  "New Zealand",
  "Palestine",
  "People's Republic of China",
  "Portugal",
  "Russia",
  "Saint Kitts and Nevis",
  "Saudi Arabia",
  "Serbia",
  "Singapore",
  "Slovakia",
  "South Africa",
  "Tanzania",
  "Thailand",
  "United States",
  "Uzbekistan",
  "See also",
  "Footnotes",
];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_country_subdivisions"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles
    .reduce((results, title) => {
      const $title = $(title);
      const titleContent = $title
        .find(".mw-headline")
        .text()
        .trim();

      if (!skip.includes(titleContent)) {
        let $container = $($title.nextAll("ul, .columns").get(0));
        const flagContainers = $container.find("li").toArray();
        const flagItems = $container.find('li a[href$=".svg"]').toArray();

        if (flagContainers.length !== flagItems.length) {
          return results;
        }

        const flags = flagContainers.map(flagContainer => {
          const $flagContainer = $(flagContainer);
          const $country = $flagContainer.find("a").last();
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
            ...(manualData[id] || {}),
          };
        });
        results = results.concat(flags).filter(item => item);
      }
      return results;
    }, [])
    .concat(
      extraFlags.map(flag => {
        const id = generateId(flag.country);
        return {
          id,
          ...flag,
          ...(manualData[id] || {}),
        };
      })
    )
    .sort((flagA, flagB) => {
      if (flagA.belongsTo === flagB.belongsTo) {
        return flagA.country > flagB.country ? 1 : -1;
      }
      return flagA.belongsTo > flagB.belongsTo ? 1 : -1;
    })
    .filter(flag => !!flag.id);

  helpers.saveFlagFiles(results, callback);
};
