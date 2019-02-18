const slugify = require("slugify");
const cheerio = require("cheerio");
const fs = require("fs");

const getTempFile = key => `${__dirname}/.cache/${key}.json`;
const resolveCache = key => {
  const tempFile = getTempFile(key);
  if (fs.existsSync(tempFile)) {
    return JSON.parse(fs.readFileSync(tempFile, "UTF-8"));
  }
};

const saveCache = (key, result) => {
  fs.writeFileSync(getTempFile(key), JSON.stringify(result), "UTF-8");
};
const merge = (flags, newInfo) =>
  !flags
    ? newInfo
    : flags.map(flag => ({
        ...flag,
        ...newInfo[flag.id],
      }));

module.exports = {
  withCache: (dataFetcher, cacheKey) => flags =>
    new Promise(async resolve => {
      const content = resolveCache(cacheKey);
      if (content) {
        return resolve(merge(flags, content));
      }
      const results = await dataFetcher(flags);
      saveCache(cacheKey, results);
      return resolve(merge(flags, results));
    }),
  merge,
  resolveCache,
  saveCache,
  generateId: string => slugify(string).toLowerCase(),
  cleanUrl: string => string.replace("_the_", "_").toLowerCase(),
  consolidate: data =>
    new Promise(resolve => {
      const html = fs.readFileSync(`${__dirname}/../public/index.html`);
      const $ = cheerio.load(html);
      $("#data").text(JSON.stringify(data));
      const newHTML = $.html();
      fs.writeFileSync(
        `${__dirname}/../src/data/flags.json`,
        JSON.stringify(data, null, 4),
        "UTF-8"
      );
      fs.writeFileSync(`${__dirname}/../public/index.html`, newHTML, "UTF-8");
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
        } else {
          flag.colors.forEach(color => {
            if (!color.tag) {
              throw new Error(`${flag.id} doesn't have color tags`);
            }
          });
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
