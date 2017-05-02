"use strict";

const fs = Plugin.fs;
const path = Plugin.path;

const npmManifestFileName = path.resolve(process.cwd(), 'package.json');

loadPackageJson = () => {
  let content = null;
  // Analyse user's package.json for package options
  if (fs.lstatSync(npmManifestFileName).isFile()) {
    const fileContent = fs.readFileSync(npmManifestFileName, 'utf8');
    try {
      content = JSON.parse(fileContent);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to parse: ${npmManifestFileName}: ${err.toString()}`);
    }
  }
  return content;
};
