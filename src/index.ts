import * as fs from "fs";
import * as path from "path";

let nodeModulesPath = path.resolve(".", "node_modules");
let packageJsonPath = path.resolve(".", "package.json");

const modules: {
  [key: string]: {
    license: null | string;
    text: null | number;
  };
} = {};

const texts: string[] = [];

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

    const id = `${name}:::${json.version}`;

    // If module has already been added, skip to next
    if (modules[id]) {
      continue;
    }

    modules[id] = {
      text: null,
      license: json.license || null,
    };

    const license = getLicense(modulePath);

    if (license) {
      let licenseIndex = texts.indexOf(license);
      if (licenseIndex === -1) {
        texts.push(license);
        licenseIndex = texts.length - 1;
      }

      modules[id].text = licenseIndex;
    }

    // If a license wasn't found, assign as null
    if (typeof modules[id].text !== "number") {
      modules[id].text = null;
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
function nodeModulesLicenseCrawler(args: { rootPath?: string }) {
  if (args?.rootPath) {
    nodeModulesPath = path.resolve(args.rootPath, "node_modules");
    packageJsonPath = path.resolve(args.rootPath, "package.json");
  }

  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error("Missing node_modules");
  }

  const json = readPackageJson(packageJsonPath);
  if (json.dependencies) {
    crawl(json.dependencies);
  }

  return {
    modules: Object.keys(modules)
      .map((key) => {
        const [name, version] = key.split(":::");

        return {
          name,
          version,
          license: modules[key].license,
          text: modules[key].text,
        };
      })
      .sort((a, b) => {
        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      }),
    texts,
  };
}

export = nodeModulesLicenseCrawler;
