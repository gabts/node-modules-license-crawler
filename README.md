# Node Modules License Crawler

Crawls dependencies recursively from your package.json file and finds license texts from packages in node_modules. Note: development and peer dependencies are skipped.

## Install

```sh
npm install node-modules-license-crawler
```

## Usage

```js
var fs = require("fs");
var nodeModulesLicenseCrawler = require("node-modules-license-crawler");

var json = nodeModulesLicenseCrawler();

fs.writeFileSync("./licenses.json", JSON.stringify(json));
```

## Sample output

If [`react`](https://github.com/facebook/react) was your only dependency the output would look like this. The modules value refers to an index in the licenses array. This is to save some space as you often have a few modules with the same exact license content (like `react` and `react-is` does here).

Modules where we couldn't find a license have value `null` instead of an index number.

```json
{
  "modules": {
    "react@16.14.0": 0,
    "loose-envify@1.4.0": 1,
    "js-tokens@4.0.0": 2,
    "object-assign@4.1.1": 3,
    "prop-types@15.7.2": 4,
    "react-is@16.13.1": 0
  },
  "licenses": [
    "MIT License\n\nCopyright (c) Facebook, Inc. and its affiliates.\n\nPe...",
    "The MIT License (MIT)\n\nCopyright (c) 2015 Andres Suarez <zertosh@gm...",
    "The MIT License (MIT)\n\nCopyright (c) 2014, 2015, 2016, 2017, 2018 S...",
    "The MIT License (MIT)\n\nCopyright (c) Sindre Sorhus <sindresorhus@gm...",
    "MIT License\n\nCopyright (c) 2013-present, Facebook, Inc.\n\nPermissi..."
  ]
}
```

## License

[MIT](./LICENSE)
