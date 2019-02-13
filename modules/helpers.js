const slugify = require("slugify");
const fs = require("fs");

const getTempFile = key => `${__dirname}/.cache/${key}.json`;

module.exports = {
  resolveCache: key => {
    const tempFile = getTempFile(key);
    if (fs.existsSync(tempFile)) {
      return JSON.parse(fs.readFileSync(tempFile, "UTF-8"));
    }
  },
  saveCache: (key, result) => {
    fs.writeFileSync(getTempFile(key), JSON.stringify(result), "UTF-8");
  },
  generateId: string => slugify(string).toLowerCase(),
  cleanUrl: string => string.replace("_the_", "_").toLowerCase(),
  consolidate: data =>
    new Promise(resolve => {
      fs.writeFileSync(
        `${__dirname}/../src/data/flags.json`,
        JSON.stringify(data),
        "UTF-8"
      );
      resolve();
    }),
};
