const axios = require("axios");
const async = require("async");
const cheerio = require("cheerio");
const fs = require("fs");
const manualData = require("./manual/anthems.json");
const helpers = require("./helpers");

module.exports = (flags, callback) => {
  async.mapLimit(
    flags,
    2,
    async flag => {
      const cacheFile = `${__dirname}/.cache/anthems/${flag.id}.json`;
      if (fs.existsSync(cacheFile)) {
        return JSON.parse(fs.readFileSync(cacheFile, "UTF-8"));
      } else {
        try {
          const { data } = await axios.get(
            `https://www.youtube.com/user/DeroVolk/search?query=national+anthem+of+${flag.id.replace(
              /-/g,
              " "
            )}&pbj=1`
          );
          const $ = cheerio.load(data);
          const fullTitleContainer = $($(`.yt-lockup-title`).get(0));
          const videoId = fullTitleContainer
            .find("a")
            .attr("href")
            .replace("/watch?v=", "");
          let titleMatch = fullTitleContainer.text().match(/"(.*)"[)]?/);
          if (!titleMatch) {
            titleMatch = fullTitleContainer.text().match(/\((.*)\)/);
            titleMatch[0] = titleMatch[0].replace("(", "").replace(")", "");
          }

          console.log(flag.country);
          const result = {
            id: flag.id,
            title: titleMatch[0].replace(/"/g, ""),
            input: titleMatch.input,
            videoId,
          };
          fs.writeFileSync(cacheFile, JSON.stringify(result, null, 4), "UTF-8");
          return result;
        } catch (e) {
          console.log(flag.id, e);
          return;
        }
      }
    },
    (err, results) => {
      const result = helpers.normaliseData(results, "anthem", manualData);
      callback(result);
    }
  );
};
