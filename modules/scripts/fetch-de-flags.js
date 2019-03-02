const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");
const manualData = require("../manual/ratio-adoption-de.json");

const validSections = ["Landesflagge"];
let bavariaUrl;
module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Flags_of_German_states"
  );

  const $ = cheerio.load(data);
  const sectionTitles = $("h2").toArray();
  const results = sectionTitles.reduce((results, title) => {
    const $title = $(title);
    const titleContent = $title.find(".mw-headline i").text();

    if (validSections.includes(titleContent)) {
      const $container = $($title.nextAll(".gallery").get(0));
      const flagContainers = $container.find("li.gallerybox").toArray();

      const flags = flagContainers.map(flagContainer => {
        const $flagContainer = $(flagContainer);
        const $link = $flagContainer.find(".gallerytext a:last-of-type");
        let country = $link
          .text()
          .replace(/\[(.)+\]/g, "")
          .trim();

        let id = generateId(country);

        let url = cleanUrl($link.attr("href") || "");
        if (id === "bavaria") {
          bavariaUrl = url;
          return;
        }
        if (!id) {
          id = "bavaria";
          country = "Bavaria";
          url = bavariaUrl;
        }
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
          belongsTo: "Germany",
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
