const fetchWorldFlags = require("./scripts/fetch-flags");
const fetchUsFlags = require("./scripts/fetch-us-flags");
const fetchData = require("./fetch-data");
const config = require("./config");

(async () => {
  await fetchData(fetchWorldFlags, config.world);
  await fetchData(fetchUsFlags, config.US, "US");
})();
