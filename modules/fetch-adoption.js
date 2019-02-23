const axios = require("axios");
const cheerio = require("cheerio");
const manualAdoption = require("./manual/adoption.json");
const helpers = require("./helpers");

const adoptionObj = adoption => ({
  adoption: {
    sort: parseInt(adoption, 10),
    text: adoption,
  },
});

const cleanId = id =>
  id
    .replace("people's-republic-of-china", "china")
    .replace("republic-of-china-(taiwan)", "taiwan")
    .replace("cote-d'ivoire", "ivory-coast")
    .replace("micronesia", "federated-states-of-micronesia");

module.exports = async (flags, callback) => {
  const { data } = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_current_flag_adoption"
  );

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

      const id = cleanId(helpers.generateId(country));

      const index = flags.findIndex(flag => {
        return flag.id === id;
      });

      if (index !== -1) {
        result[id] = adoptionObj(adoption);
      }
    }
    return result;
  }, {});

  Object.keys(manualAdoption).forEach(id => {
    result[id] = adoptionObj(manualAdoption[id]);
  });

  callback(result);
};
