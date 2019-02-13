const axios = require("axios");
const cheerio = require("cheerio");
const manualAdoption = require("./manual/adoption.json");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "step2";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching year of adoption from cache");
      return resolve(content);
    }

    axios
      .get(
        "https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_current_flag_adoption"
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const $tableRows = $(".wikitable")
          .find("tbody tr")
          .toArray();

        $tableRows.forEach(row => {
          const data = $(row)
            .find("td")
            .toArray();

          const [tdCountry, tdAdoption] = data;
          const country = $(tdCountry).text();
          if (!country) {
            return;
          }
          const adoption = $(tdAdoption)
            .text()
            .trim()
            .substr(0, 4);

          const id = helpers
            .generateId(country)
            .replace("people's-republic-of-china", "china")
            .replace("republic-of-china-(taiwan)", "taiwan")
            .replace("cote-d'ivoire", "ivory-coast")
            .replace("swaziland", "eswatini-(swaziland)")
            .replace("micronesia", "federated-states-of-micronesia");

          const index = flags.findIndex(flag => {
            return flag.id === id;
          });

          flags.splice(index, 1, {
            ...flags[index],
            adoption,
          });
        });

        return flags;
      })
      .then(flags => {
        flags = flags.map(flag => {
          if (flag.adoption) {
            return flag;
          }
          const adoption = manualAdoption[flag.id];
          return {
            ...flag,
            adoption,
          };
        });
        console.log(cacheKey, "fetching year of adoption");
        helpers.saveCache(cacheKey, flags);
        resolve(flags);
      });
  });
