const fetchWorldFlags = require("./scripts/fetch-flags");
const fetchUsFlags = require("./scripts/fetch-us-flags");
const fetchJPFlags = require("./scripts/fetch-jp-flags");
const fetchAllMissingFlags = require("./scripts/fetch-all-missing-flags");
const aggregate = require("./scripts/aggregate");

const fetchData = require("./fetch-data");
const config = require("./config");

(async () => {
  await fetchData(fetchWorldFlags, config.world);
  await fetchData(fetchUsFlags, config.US, "US");
  await fetchData(fetchJPFlags, config.JP, "JP");
  await fetchData(fetchAllMissingFlags, config.all, "ALL");
  await fetchData(aggregate("SCAND"), config.SCAND, "SCAND");
  await fetchData(aggregate("DE"), config.DE, "DE");
  await fetchData(aggregate("ES"), config.ES, "ES");
  await fetchData(aggregate("IT"), config.IT, "IT");
  await fetchData(aggregate("CH"), config.CH, "CH");
  await fetchData(aggregate("SAM"), config.SAM, "SAM");
})();
