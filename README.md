# Node Modules License Crawler

Crawls dependencies recursively from your package.json file and finds license texts from packages in node_modules.

## Install

```sh
npm install node-modules-license-crawler
```

## Sample usage

```js
const fs = require("fs");
const nodeModulesLicenseCrawler = require("node-modules-license-crawler");

const json = nodeModulesLicenseCrawler();

fs.writeFileSync("./licenses.json", JSON.stringify(json));
```

## License

[MIT](./LICENSE)
