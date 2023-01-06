const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/extra-data.json");

const validSections = ["Africa", "Asia", "Europe", "The Americas", "Oceania"];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://commons.wikimedia.org/wiki/Flags_of_active_autonomist_and_secessionist_movements"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);
    const titleContent = $title.find(".mw-headline").text();
    if (validSections.includes(titleContent)) {
      const table = $title.nextAll("table").toArray();
      const rows = $(table[0]).find(".image").toArray();

      const list = rows.map((image) => {
        let countryRgx = /(.+) \((.+)\)/i;
        let matches = $(image)
          .attr("title")
          .replace("Flag of ", "")
          .match(countryRgx);

        if (!matches) {
          countryRgx = /([A-Za-z\s])+/i;
          matches = $(image)
            .attr("title")
            .replace("Flag of ", "")
            .match(countryRgx);

          matches.unshift("");
        }
        let country = matches[1];
        if (country.toLowerCase().startsWith("the ")) {
          country = country.replace("the ", "");
        }

        let id = generateId(country);
        let belongsTo = matches[2];

        if (belongsTo.includes("associated with secession")) {
          return;
        }

        if (id === "taiwan-independence") {
          belongsTo = "People's Republic of China";
        }

        if (id === "rapanui-of-easter-island.") {
          id = "rapanui-of-easter-island";
          country = "Rapanui of Easter Island";
        }

        if (
          id === "unofficial-flag-of-cantonia" ||
          id === "karen-national-union" ||
          id === "puerto-rican-independence-movement"
        ) {
          return;
        }

        if (id === "ichkeria") {
          belongsTo = "Russia";
        }

        if (id === "bosnian-croats") {
          belongsTo = "Bosnia and Herzegovina";
        }

        if (
          id ===
          "caprivi-african-national-union-of-the-free-state-of-caprivi-stripitenge"
        ) {
          id = "caprivi-african-national-union";
          country = "Caprivi African National Union";
        }

        if (
          id ===
          "ikurrina-the-official-flag-of-the-basque-autonomous-community-also-used-to-represent-the-greater-basque-country-or-euskal-herria"
        ) {
          id = "ikurrina";
          country = "Ikurriña";
        }

        if (
          id ===
          "vojvodina-proposed-by-the-lsv-and-associated-with-the-vojvodina-autonomist-movement"
        ) {
          id = "vojvodina";
          country = "Vojvodina";
          belongsTo = "Serbia";
        }

        const img = $(image)
          .find("img")
          .attr("src")
          .replace("thumb/", "")
          .replace(/\/([0-9]+)px-(.)+/gi, "")
          .trim();

        let url = cleanUrl(`/wiki/${country}`);

        let continents = [titleContent];
        if (continents[0] === "The Americas") {
          if (
            [
              "magallanes-regionalism",
              "mapuche-consejo-de-todas-las-tierras",
              "magallanes-and-chilean-antarctica",
              "southern-independence-movement",
            ].includes(id) ||
            belongsTo === "Brazil"
          ) {
            continents = ["South America"];
          } else {
            continents = ["North America"];
          }
        }

        return {
          id,
          belongsTo,
          country,
          continents,
          image: img,
          url,
        };
      });
      results = results.concat(list).filter((item) => item);
    }
    return results;
  }, []);
  helpers.saveFlagFiles(results, callback);
};
