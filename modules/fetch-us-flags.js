const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");

const validSections = [
  "Current state flags",
  "Current territory and federal district flags",
];

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

      const flags = flagContainers.map(flagContainer => {
        const $flagContainer = $(flagContainer);
        const $link = $flagContainer.find(".gallerytext a");
        let country = $link
          .text()
          .replace("Flag", "")
          .replace(/\[(.)+\]/g, "")
          .trim();

        const url = helpers.cleanUrl($link.attr("href"));
        let adoption = $flagContainer
          .find(".gallerytext")
          .text()
          .replace(/\[(.)+\]/g, "")
          .trim()
          .match(/\([^(]+\){1}$/g)[0]
          .replace(/[()]/g, "")
          .replace("; see notes", "");

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

        const id = helpers.generateId(country).replace("georgia", "georgia-us");

        return {
          id,
          country,
          adoption,
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
