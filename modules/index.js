const fetchWorldFlags = require("./scripts/fetch-flags");
const fetchUsFlags = require("./scripts/fetch-us-flags");
const fetchItFlags = require("./scripts/fetch-it-flags");
const fetchDeFlags = require("./scripts/fetch-de-flags");
const fetchEsFlags = require("./scripts/fetch-es-flags");

const fetchData = require("./fetch-data");
const config = require("./config");

(async () => {
  await fetchData(fetchWorldFlags, config.world);
  await fetchData(fetchUsFlags, config.US, "US");
  await fetchData(fetchItFlags, config.IT, "IT");
  await fetchData(fetchDeFlags, config.DE, "DE");
  await fetchData(fetchEsFlags, config.ES, "ES");
})();
