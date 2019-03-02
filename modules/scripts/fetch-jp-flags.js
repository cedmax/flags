const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/adoption-country-jp.json");

const validSections = ["Prefectural flags"];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_Japanese_flags"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);
    const titleContent = $title.find(".mw-headline").text();

    if (validSections.includes(titleContent)) {
      const table = $title.nextAll(".wikitable").toArray();
      const rows = $(table[0])
        .find("tr")
        .toArray();

      const flags = rows.map(row => {
        const tds = $(row)
          .find("td")
          .toArray();

        if (tds.length === 0) return;
        const [flagContainer, countryContainer] = tds;
        const $flagContainer = $(flagContainer);
        let country = $(countryContainer)
          .text()
          .replace(/\[(.)+\]/g, "")
          .trim();

        if (country === "ŌitaŌita") {
          country = "Ōita";
        }

        if (
          country.startsWith("The symbol at") ||
          country.startsWith("Karafuto")
        ) {
          return;
        }

        let id = generateId(country);

        let url = cleanUrl(`/wiki/${country}_Prefecture`);
        const image =
          "https:" +
          $flagContainer
            .find("img")
            .attr("src")
            .replace("thumb/", "")
            .replace(/\/([0-9]+)px-(.)+/gi, "")
            .trim();

        const { country: countryInJapanese, adoption } = manualData[id];

        return {
          id,
          belongsTo: "Japan",
          country: `${country} (${countryInJapanese})`,
          image,
          url,
          adoption,
        };
      });
      results = results.concat(flags).filter(item => item);
    }
    return results;
  }, []);
  helpers.saveFlagFiles(results, callback);
};
