const axios = require("axios");
const cheerio = require("cheerio");
const manualAdoption = require("./manual/adoption.json");
const helpers = require("./helpers");

const validSections = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "continents";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching continents from cache");
      return resolve(helpers.merge(flags, content));
    }

    const results = {};
    axios
      .get(
        "https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent"
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const sectionTitles = $("h2").toArray();
        sectionTitles.forEach(title => {
          const $title = $(title);
          const titleContent = $title.find(".mw-headline").text();
          if (validSections.includes(titleContent)) {
            const $table = $($title.nextAll(".wikitable").get(0));
            const $tableRows = $table.find("tbody tr").toArray();

            $tableRows.forEach(row => {
              const data = $(row)
                .find("td")
                .toArray();

              const [tdCountry] = data;
              const country = $(tdCountry)
                .find("a[href*='/wiki/']")
                .text()
                .replace("North Macedonia", "Macedonia")
                .replace(
                  "Congo, Democratic Republic of the",
                  "Democratic Republic of the Congo"
                )
                .replace("Congo, Republic of the", "Republic of the Congo")
                .replace("Gambia, The", "Gambia")
                .replace("Bahamas, The", "Bahamas")
                .replace("Eswatini", "Swaziland")
                .replace("Korea, North", "North Korea")
                .replace("Korea, South", "South Korea")
                .replace("Palestine", "State of Palestine")
                .replace(
                  "Northern Cyprus",
                  "Turkish Republic of Northern Cyprus"
                )
                .replace("Micronesia", "Federated States of Micronesia");

              const id = helpers.generateId(country);
              const index = flags.findIndex(flag => flag.id === id);

              if (index !== -1) {
                results[id] = {
                  continents: (flags[index].continents || []).concat([
                    titleContent,
                  ]),
                };
              }
            });
          }
        });

        console.log(cacheKey, "fetching continents");
        helpers.saveCache(cacheKey, results);
        resolve(helpers.merge(flags, results));
      });
  });
