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

var data = nodeModulesLicenseCrawler();

fs.writeFileSync("./licenses.json", JSON.stringify(data));
```

## Sample output

If [`react`](https://github.com/facebook/react) was your only dependency the output would look like this. The modules text value refers to an index in the texts array. This is for if you want to save some space as you often have a few modules with the same exact license text content (like `react` and `react-is` does here).

Modules where we couldn't find a license have text value `null` instead of an index number.

```json
{
  "modules": [
    {
      "name": "js-tokens",
      "version": "4.0.0",
      "license": "MIT",
      "text": 2
    },
    {
      "name": "loose-envify",
      "version": "1.4.0",
      "license": "MIT",
      "text": 1
    },
    {
      "name": "object-assign",
      "version": "4.1.1",
      "license": "MIT",
      "text": 3
    },
    {
      "name": "prop-types",
      "version": "15.7.2",
      "license": "MIT",
      "text": 4
    },
    {
      "name": "react",
      "version": "16.14.0",
      "license": "MIT",
      "text": 0
    },
    {
      "name": "react-is",
      "version": "16.13.1",
      "license": "MIT",
      "text": 0
    }
  ],
  "texts": [
    "MIT License\n\nCopyright (c) Facebook, Inc. and its affiliates.\n ...",
    "The MIT License (MIT)\n\nCopyright (c) 2015 Andres Suarez <zertos ...",
    "The MIT License (MIT)\n\nCopyright (c) 2014, 2015, 2016, 2017, 20 ...",
    "The MIT License (MIT)\n\nCopyright (c) Sindre Sorhus <sindresorhu ...",
    "MIT License\n\nCopyright (c) 2013-present, Facebook, Inc.\n\nPerm ..."
  ]
}
```

## License

[MIT](./LICENSE)
