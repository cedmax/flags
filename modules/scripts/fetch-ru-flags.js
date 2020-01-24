const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");

const validSections = [
  "Republics",
  "Krais",
  "Oblasts",
  "Federal cities",
  "Autonomous oblasts",
  "Autonomous okrugs",
];

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_the_federal_subjects_of_Russia"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);

    const titleContent = $title.find(".mw-headline").text();
    if (validSections.includes(titleContent)) {
      const $container = $($title.nextAll("ul.gallery").get(0));

      const flagContainers = $container.find("li.gallerybox").toArray();

      const flags = flagContainers.map(flagContainer => {
        const $flagContainer = $(flagContainer);
        const $link = $flagContainer.find(".gallerytext a");
        let country = $link
          .text()
          .replace("Flag of", "")
          .replace("Flag", "")
          .replace(/\[(.)+\]/g, "")
          .trim();

        const id = generateId(country);
        const url = cleanUrl($link.attr("href"));

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
          belongsTo: "Russia",
          country,
          image,
          url,
        };
      });
      results = results.concat(flags).filter(item => item);
    }
    return results;
  }, []);

  helpers.saveFlagFiles(results, callback);
};
