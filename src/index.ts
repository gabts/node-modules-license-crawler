import * as fs from "fs";
import * as path from "path";

const data: {
  modules: { [key: string]: null | number };
  licenses: string[];
} = {
  modules: {},
  licenses: [],
};

let nodeModulesPath = path.resolve(".", "node_modules");

function readPackageJson(packageJsonPath: string): null | any {
  if (fs.existsSync(packageJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    } catch (e) {
      // Invalid json
    }
  }

  return null;
}

const licenseVariants = ["LICENSE", "LICENSE.md"];

function getLicense(modulePath: string): null | string {
  for (const licenseVariant of licenseVariants) {
    const licensePath = path.resolve(modulePath, licenseVariant);
    if (fs.existsSync(licensePath)) {
      return fs.readFileSync(licensePath, "utf-8");
    }
  }

  const json = readPackageJson(path.resolve(modulePath, "package.json"));
  if (json.license) {
    return json.license;
  }

  return null;
}

function crawl(dependencies: { [key: string]: string }): void {
  for (const name of Object.keys(dependencies)) {
    const modulePath = path.resolve(nodeModulesPath, name);
    const json = readPackageJson(path.resolve(modulePath, "package.json"));

    // If module doesn't have a package.json somethings off, skip to next
    if (!json) {
      continue;
    }

    const id = `${name}@${json.version}`;

    // If module has already been added, skip to next
    if (typeof data.modules[id] === "number") {
      continue;
    }

    const license = getLicense(modulePath);

    if (license) {
      let licenseIndex = data.licenses.indexOf(license);
      if (licenseIndex === -1) {
        data.licenses.push(license);
        licenseIndex = data.licenses.length - 1;
      }

      data.modules[id] = licenseIndex;
    }

    // If a license wasn't found, assign as null
    if (typeof data.modules[id] !== "number") {
      data.modules[id] = null;
    }

    if (json.dependencies) {
      crawl(json.dependencies);
    }
  }
}

/**
 * Crawls dependencies recursively from your package.json file and finds license
 * texts from packages in node_modules.
 */
function nodeModulesLicenseCrawler(args: {
  rootPath?: string;
  outputPath?: string;
}): void {
  const json = readPackageJson(
    path.resolve(args.rootPath || ".", "package.json")
  );

  if (args.rootPath) {
    nodeModulesPath = path.resolve(args.rootPath, "node_modules");
  }

  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error("Missing node_modules");
  }

  if (json.dependencies) {
    crawl(json.dependencies);
  }

  if (args.outputPath) {
    fs.writeFileSync(args.outputPath, JSON.stringify(data, null, 2));
  }
}

export = nodeModulesLicenseCrawler;
