const axios = require("axios");
const cheerio = require("cheerio");
const manualAdoption = require("./manual/adoption.json");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    const cacheKey = "adoption";
    const content = helpers.resolveCache(cacheKey);
    if (content) {
      console.log(cacheKey, "fetching year of adoption from cache");
      return resolve(helpers.merge(flags, content));
    }

    const result = {};
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
            .replace("micronesia", "federated-states-of-micronesia");

          const index = flags.findIndex(flag => {
            return flag.id === id;
          });

          if (index !== -1) {
            result[id] = { adoption };
          }
        });
        Object.keys(manualAdoption).forEach(id => {
          result[id] = { adoption: manualAdoption[id] };
        });
        console.log(cacheKey, "fetching year of adoption");
        helpers.saveCache(cacheKey, result);
        resolve(helpers.merge(flags, result));
      });
  });
