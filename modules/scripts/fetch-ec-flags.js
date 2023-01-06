const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");

const validSections = ["Provincial flags"];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_Ecuadorian_flags#Provincial_flags"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);

    const titleContent = $title.find(".mw-headline").text();
    if (validSections.includes(titleContent)) {
      const $container = $($title.nextAll("table").get(0));
      const flags = $container
        .find("tr")
        .toArray()
        .filter((row) => $(row).find("td").toArray().length)
        .map((row) => {
          const $row = $(row);

          const $flagContainer = $($row.find("td").get(0));
          const $provinceContainer = $($row.find("td").get(2));

          const province = $provinceContainer
            .text()
            .replace(/\[(.)+\]/g, "")
            .trim();

          const id = generateId(province);
          const url = cleanUrl($provinceContainer.find("a").attr("href"));

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
            belongsTo: "Ecuador",
            country: province,
            image,
            url,
          };
        });
      results = results.concat(flags).filter((item) => item);
    }
    return results;
  }, []);

  helpers.saveFlagFiles(results, callback);
};
