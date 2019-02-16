const axios = require("axios");
const cheerio = require("cheerio");
const manualAdoption = require("./manual/adoption.json");
const helpers = require("./helpers");

module.exports = flags =>
  new Promise(resolve => {
    axios
      .get(
        "https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_current_flag_adoption"
      )
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const $tableRows = $(".wikitable")
          .find("tbody tr")
          .toArray();

        const result = $tableRows.reduce((result, row) => {
          const data = $(row)
            .find("td")
            .toArray();

          const [tdCountry, tdAdoption] = data;
          const country = $(tdCountry).text();

          if (country) {
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
          }
          return result;
        }, {});
        Object.keys(manualAdoption).forEach(id => {
          result[id] = { adoption: manualAdoption[id] };
        });
        resolve(result);
      });
  });
