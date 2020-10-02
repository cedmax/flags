const assets = require("../build/asset-manifest.json").files;
const isocodes = require("./iso.json");
const fs = require("fs");

let redirects = "";
const countryIds = Object.keys(isocodes);

countryIds.forEach(id => {
  const assetKey = `static/media/${id}.svg`;
  const asset = assets[assetKey];
  redirects += `\nhttps://flags.dsgn.it/assets/${isocodes[
    id
  ].toLowerCase()}.svg ${asset} 200`;
});

fs.appendFileSync("./build/_redirects", redirects, "utf-8");
