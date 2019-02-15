const slugify = require("slugify");
const fs = require("fs");

const getTempFile = key => `${__dirname}/.cache/${key}.json`;

module.exports = {
  merge: (flags, newInfo) =>
    flags.map(flag => ({
      ...flag,
      ...newInfo[flag.id],
    })),
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
        JSON.stringify(data, null, 4),
        "UTF-8"
      );
      resolve();
    }),
  validate: flags =>
    new Promise(resolve => {
      flags.forEach(flag => {
        if (!flag.continents) {
          throw new Error(`${flag.id} doesn't have continents`);
        }
        if (!flag.ratio) {
          throw new Error(`${flag.id} doesn't have ratio`);
        }
        if (!flag.adoption) {
          throw new Error(`${flag.id} doesn't have adoption`);
        }
        if (!flag.colors) {
          throw new Error(`${flag.id} doesn't have colors`);
        }
        if (!flag.tags) {
          throw new Error(`${flag.id} doesn't have tags`);
        }
        if (!flag.anthem) {
          console.log(`- ${flag.id} doesn't have anthem`);
        }
      });
      resolve(flags);
    }),
};
