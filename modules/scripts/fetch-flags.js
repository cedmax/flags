const cheerio = require("cheerio");
const helpers = require("./helpers");
const axios = require("axios");
const { cleanUrl, generateId } = require("./utilities");

module.exports = async (unused, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags"
  );

  const $ = cheerio.load(data);
  const flagContainers = $("li.gallerybox").toArray();
  const flags = flagContainers.map((flagContainer) => {
    const $flagContainer = $(flagContainer);
    const $link = $flagContainer.find(".gallerytext a");
    const country = $link
      .text()
      .replace("Flag of the", "")
      .replace("Flag of", "")
      .trim();

    const url = cleanUrl($link.attr("href"));

    const image =
      "https:" +
      $flagContainer
        .find("img")
        .attr("src")
        .replace("thumb/", "")
        .replace(/\/([0-9]+)px-(.)+/gi, "")
        .trim();

    const id = generateId(country)
      .replace("eswatini-(swaziland)", "swaziland")
      .replace("north-macedonia", "macedonia");

    return {
      id,
      country,
      image,
      url,
    };
  });

  helpers.saveFlagFiles(flags, callback);
};
