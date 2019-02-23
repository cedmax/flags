const slugify = require("slugify");
const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const async = require("async");

const getTempFile = key => `${__dirname}/.cache/${key}.json`;
const generateId = string => slugify(string).toLowerCase();

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
  mergeData: (dataFetcher, cacheKey, group) => flags =>
    new Promise(resolve => {
      if (group) {
        cacheKey = `${cacheKey}-${group}`;
      }
      if (cacheKey) {
        const content = resolveCache(cacheKey);
        if (content) {
          console.log(cacheKey, "from cache");
          return resolve(merge(flags, content));
        }
      }

      dataFetcher(flags, results => {
        if (cacheKey) {
          saveCache(cacheKey, results);
          console.log(cacheKey, "done");
        }

        return resolve(merge(flags, results));
      });
    }),
  resolveCache,
  saveCache,
  generateId,
  cleanUrl: string => string.replace("_the_", "_").toLowerCase(),
  consolidate: group => flags =>
    new Promise(resolve => {
      const dataKey = group || "world";
      let data = { [dataKey]: flags };
      const html = fs.readFileSync(`${__dirname}/../public/index.html`);
      const $ = cheerio.load(html);
      const currentDataString = $("#data").html();

      if (currentDataString) {
        const currentData = JSON.parse(currentDataString);
        data = {
          ...currentData,
          ...data,
        };
      }
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
  validate: group => flags =>
    new Promise(resolve => {
      flags.forEach(flag => {
        if (!flag.ratio) {
          throw new Error(`${flag.id} doesn't have ratio`);
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

        if (!group) {
          if (!flag.continents) {
            throw new Error(`${flag.id} doesn't have continents`);
          }
          if (!flag.adoption) {
            throw new Error(`${flag.id} doesn't have adoption`);
          }
          if (!flag.anthem) {
            throw new Error(`${flag.id} doesn't have an anthem`);
          } else {
            if (flag.anthem.input.match(/[0-9]{4}/)) {
              throw new Error(`${flag.id} has the wrong anthem anthem`);
            }
            delete flag.anthem.input;
          }
        }
      });
      resolve(flags);
    }),

  saveFlagFiles: (flags, callback) =>
    async.mapLimit(
      flags,
      2,
      (flag, cb) => {
        const { id } = flag;
        const file = `${__dirname}/../src/data/flags/${id}.svg`;

        if (!fs.existsSync(file)) {
          axios
            .get(flag.image)
            .then(({ data: svg }) => {
              fs.writeFileSync(file, svg, "UTF-8");
              cb(null, flag);
            })
            .catch(() => console.log(flag.country, "failed"));
        } else {
          cb(null, flag);
        }
      },
      (e, result) => {
        callback(result);
      }
    ),
};
