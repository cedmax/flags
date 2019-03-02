const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/adoption-it.json");

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_regions_of_Italy"
  );

  const $ = cheerio.load(data);
  const rows = $(".wikitable tr").toArray();

  const results = rows.reduce((results, row) => {
    const tds = $(row)
      .find("td")
      .toArray();

    if (tds.length === 0) return results;
    const [flagContainer, adoptionContainer, regionContainer] = tds;

    const $regionContainer = $(regionContainer);
    const $link = $regionContainer.find("a:last-of-type");
    const country = $link.text().trim();

    const id = generateId(country).replace("georgia", "georgia-us");
    console.log($link.text());
    const url = cleanUrl($link.attr("href"));
    const adoptionText =
      manualData[id] ||
      $(adoptionContainer)
        .text()
        .trim();

    const adoption = {
      sort: parseInt(adoptionText, 10),
      text: adoptionText,
    };

    const image =
      "https:" +
      $(flagContainer)
        .find("img")
        .attr("src")
        .replace("thumb/", "")
        .replace(/\/([0-9]+)px-(.)+/gi, "")
        .trim();

    results.push({
      id,
      belongsTo: "Italy",
      country,
      adoption,
      image,
      ratio: "2:3",
      url,
    });
    return results;
  }, []);

  helpers.saveFlagFiles(results, callback);
};
