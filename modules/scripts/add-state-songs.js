const manualData = require("../manual/state-songs.json");

module.exports = (flags, callback) => {
  const anthems = flags.reduce((acc, { id }) => {
    acc[id] = { anthem: manualData[id] };
    return acc;
  }, {});

  callback(anthems);
};
