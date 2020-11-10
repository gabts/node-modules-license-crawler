const fs = require("fs");
const nodeModulesLicenseCrawler = require("../dist");

const data = nodeModulesLicenseCrawler({ rootPath: __dirname });

fs.writeFileSync(__dirname + "/output.json", JSON.stringify(data, null, 2));
