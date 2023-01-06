const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");

const validSections = [
  "Current state flags",
  "Current territory and federal district flags",
];

const fixSortAdoption = (id, adoptForSorting) => {
  switch (id) {
    case "mississippi":
      return new Date("November 1, 1897").toJSON();
    case "rhode-island":
      return new Date(" February 7, 2001").toJSON();
    default:
      return adoptForSorting;
  }
};

const getAdoptionText = ($flagContainer) =>
  $flagContainer
    .find(".gallerytext")
    .text()
    .replace(/\[(.)+\]/g, "")
    .trim()
    .match(/\([^(]+\){1}$/g)[0]
    .replace(/[()]/g, "")
    .replace("; see notes", "");

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_the_U.S._states_and_territories"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);
    const titleContent = $title.find(".mw-headline").text();
    if (validSections.includes(titleContent)) {
      const $container = $($title.nextAll(".mod-gallery").get(0));
      const flagContainers = $container.find("li.gallerybox").toArray();

      const flags = flagContainers.map((flagContainer) => {
        const $flagContainer = $(flagContainer);
        const $link = $flagContainer.find(".gallerytext a");
        let country = $link
          .text()
          .replace("Flag", "")
          .replace(/\[(.)+\]/g, "")
          .trim();

        const id = generateId(country).replace("georgia", "georgia-us");
        const url = cleanUrl($link.attr("href"));
        const adoptionText = getAdoptionText($flagContainer);

        const adoption = {
          sort: fixSortAdoption(id, new Date(adoptionText).toJSON()),
          text: adoptionText,
        };

        const image =
          "https:" +
          $flagContainer
            .find("img")
            .attr("src")
            .replace("thumb/", "")
            .replace(/\/([0-9]+)px-(.)+/gi, "")
            .trim();

        if (country === "Oregon") {
          const text = $flagContainer.find(".gallerytext").text();
          if (!text.includes("obverse")) {
            return;
          }
        }

        return {
          id,
          belongsTo: "United States",
          country,
          adoption,
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
