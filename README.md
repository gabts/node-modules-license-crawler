# Node Modules License Crawler

Crawls dependencies recursively from your package.json file and finds license texts from packages in node_modules.

## Install

```sh
npm install node-modules-license-crawler
```

## Usage

```js
const nodeModulesLicenseCrawler = require("node-modules-license-crawler");

nodeModulesLicenseCrawler({
  rootPath: ".",
  outputPath: "./output.json",
});
```

## License

[MIT](./LICENSE)
