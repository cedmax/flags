const fetchWorldFlags = require("./scripts/fetch-flags");
const fetchUsFlags = require("./scripts/fetch-us-flags");
const fetchJPFlags = require("./scripts/fetch-jp-flags");
const fetchRUFlags = require("./scripts/fetch-ru-flags");
const fetchAutonomist = require("./scripts/fetch-autonomist");
const fetchAllMissingFlags = require("./scripts/fetch-all-missing-flags");
const aggregate = require("./scripts/aggregate");

const fetchData = require("./fetch-data");
const config = require("./config");

(async () => {
  // await fetchData(fetchWorldFlags, config.world);
  // await fetchData(fetchUsFlags, config.US, "US");
  // await fetchData(fetchJPFlags, config.JP, "JP");
  await fetchData(fetchRUFlags, config.RU, "RU");
  // await fetchData(fetchAllMissingFlags, config.all, "ALL");
  // await fetchData(fetchAutonomist, config.autonomist, "AUTONOMIST");
  // await fetchData(aggregate("NORDIC"), config.NORDIC, "NORDIC");
  // await fetchData(aggregate("FIGS"), config.FIGS, "FIGS");
  // await fetchData(aggregate("SAM"), config.SAM, "SAM");
  // await fetchData(aggregate("CH"), config.CH, "CH");
})();
