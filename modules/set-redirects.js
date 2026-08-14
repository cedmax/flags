// Vite (unlike CRA/webpack) writes its build manifest to build/.vite/manifest.json
// to avoid colliding with the PWA manifest.json that's copied over from public/,
// and keys each entry by the *source* path it was built from.
const manifest = require("../build/.vite/manifest.json");
const isocodes = require("./iso.json");
const fs = require("fs");

let redirects = "";
const countryIds = Object.keys(isocodes);

countryIds.forEach((id) => {
  const manifestKey = `src/data/flags/${id}.svg`;
  const asset = manifest[manifestKey] && manifest[manifestKey].file;
  if (!asset) {
    console.warn(`No built asset found for ${manifestKey}`);
    return;
  }
  redirects += `\nhttps://flags.dsgn.it/assets/${isocodes[
    id
  ].toLowerCase()}.svg /${asset} 200`;
});

redirects += "\n/* /index.html 200";

fs.appendFileSync("./build/_redirects", redirects, "utf-8");
