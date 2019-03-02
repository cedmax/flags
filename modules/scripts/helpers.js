const cheerio = require("cheerio");
const fs = require("fs");
const axios = require("axios");
const async = require("async");
const utilities = require("./utilities");

const path = process.cwd();

const getTempFile = key => `${path}/modules/.cache/${key}.json`;
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

const generateHTML = (html, data) => {
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

  return {
    html: $.html(),
    data,
  };
};

const consolidate = group => flags =>
  new Promise(resolve => {
    if (group === "ALL") {
      return resolve();
    }
    const dataKey = group || "world";
    let data = { [dataKey]: flags };
    const html = fs.readFileSync(`${path}/public/index.html`);
    const { data: newData, html: newHTML } = generateHTML(html, data);

    fs.writeFileSync(
      `${path}/src/data/flags.json`,
      JSON.stringify(newData, null, 4),
      "UTF-8"
    );
    fs.writeFileSync(`${path}/public/index.html`, newHTML, "UTF-8");
    resolve();
  });

const required = reject => (obj, properties) => {
  properties.forEach(prop => {
    if (!obj[prop]) {
      reject(`${obj.id} doesn't have ${prop}`);
    }
  });
};

const validate = group => flags =>
  new Promise((resolve, reject) => {
    const validatePresent = required(reject);

    flags.forEach(flag => {
      validatePresent(flag, ["ratio", "colors", "tags"]);

      flag.colors.forEach(color => {
        validatePresent(color, ["tag"]);
      });

      if (!group) {
        validatePresent(flag, ["continents", "adoption", "anthem"]);
        if (flag.anthem.input.match(/[0-9]{4}/)) {
          reject(`${flag.id} has the wrong anthem`);
        }
        delete flag.anthem.input;
      }
    });
    resolve(flags);
  });

module.exports = {
  validate,
  resolveCache,
  saveCache,
  consolidate,
  mergeData: (dataFetcher, cacheKey, group) => flags =>
    new Promise(resolve => {
      cacheKey = cacheKey && group ? `${cacheKey}-${group}` : cacheKey;

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

  saveFlagFiles: (flags, callback) =>
    async.mapLimit(
      flags,
      2,
      (flag, cb) => {
        const { id, belongsTo } = flag;
        const fullPath = utilities.getPath(path, belongsTo);
        const file = `${fullPath}/${id}.svg`;
        if (!fs.existsSync(file)) {
          if (!fs.existsSync(`${fullPath}`)) {
            fs.mkdirSync(`${fullPath}`);
          }
          axios
            .get(flag.image)
            .then(({ data: svg }) => {
              fs.writeFileSync(file, svg, "UTF-8");
              delete flag.image;
              cb(null, flag);
            })
            .catch(() => console.log(flag.country, "failed"));
        } else {
          delete flag.image;
          cb(null, flag);
        }
      },
      (e, result) => {
        callback(result);
      }
    ),
  normaliseData: (arrayOfData, key, manualData) =>
    arrayOfData.reduce((acc, dataItem) => {
      const { id } = dataItem;
      delete dataItem.id;

      const value =
        manualData && manualData.hasOwnProperty(id)
          ? manualData[id]
          : dataItem[key] || dataItem;

      acc[id] = {
        [key]: value,
      };
      return acc;
    }, {}),
};
