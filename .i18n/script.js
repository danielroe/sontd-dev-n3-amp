/**
 * Script to read a xlsx file and generate to multiple languages as yaml format.
 * Command:
 *    node i18n/script --source source.xlsx --out-dir lang --sheet-names "Locale Messages, Server Error Messages"
 * Flags:
 *    --source        Path to XLSX file
 *    --out-dir       Output folder
 *    --sheet-names   Name of sheets need to be imported, separated by commas
 */

const XLSX = require("xlsx");
const yaml = require("js-yaml");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { performance } = require("perf_hooks");

// Define default config here
const SOURCE_FILE = "./i18n/source.xlsx";
const OUTPUT_DIR = "./lang";
const SHEET_NAMES = "Locale Messages";
const IGNORED_COLS = "Screen ID, Note, Type, Description";

!function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const config = parseArgv(process.argv);
  const source = path.resolve(__dirname, "..", config.source);
  const outDir = path.resolve(__dirname, "..", config.outDir);
  const fileStat = fs.statSync(source);
  const { totalRows, localeMessages } = readXlsxFile(source, config);

  printInfo({ source, outDir, fileStat, localeMessages, totalRows });

  rl.question(
    "Current yml files (if any) will be overwritten, do you want to continue? (Y/n) ",
    async (key) => {
      rl.close();

      if (["y", "yes"].includes(key.toLowerCase())) {
        const start = performance.now();
        const count = await writeFiles(localeMessages, outDir);
        const time = performance.now() - start;
        console.log(
          `\n\x1b[32m✨  Imported successful ${count} ${
            count === 1 ? "language" : "languages"
          } in ${time.toFixed(2)}ms.`
        );
      } else {
        console.log("\n\x1b[33mImport has been cancelled!");
      }

      process.exit(0);
    }
  );
}();

// Parse the command arguments as flags to object config
function parseArgv(argv) {
  const config = {
    source: SOURCE_FILE,
    outDir: OUTPUT_DIR,
    sheetNames: convertListToArray(SHEET_NAMES),
    ignoredCols: convertListToArray(IGNORED_COLS),
  };
  for (let i = 2; i < argv.length; i += 2) {
    const key = camelize(argv[i]);
    let value = argv[i + 1];
    if (["sheetNames", "ignoredCols"].includes(key)) {
      value = convertListToArray(value);
    }
    config[key] = value;
  }

  return config;
}

// Convert a list of sheet name to an array
function convertListToArray(names) {
  return names.split(",").map((str) => str.trim()).filter(Boolean);
}

// Print the input file infor to confirm
function printInfo({ source, outDir, fileStat, localeMessages, totalRows }) {
  const { size, mtime, ctime } = fileStat;
  const languages = Object.keys(localeMessages).map((locale) => {
    return `\x1b[33m${locale}\x1b[0m`;
  });
  const timestamp = new Date(mtime || ctime).toLocaleString();
  console.log("\n\x1b[32m🛠  Import language from XLSX file\x1b[0m\n");

  console.log("Input file:");
  console.log("  • Path: \t\t", source);
  console.log("  • Size: \t\t", niceBytes(size));
  console.log("  • Last updated at: \t", timestamp);
  console.log("  • Found locales: \t", languages.join(", "));
  console.log("  • Total rows: \t", totalRows, totalRows > 1 ? "rows" : "row");

  console.log("Output directory:");
  console.log("  • Path: \t\t", outDir, "\n");
}

// Read the input XLSX file
function readXlsxFile(file, { sheetNames, ignoredCols }) {
  const localeMessages = {};
  let totalRows = 0;

  // Read the XLSX file
  const workbook = XLSX.readFile(file);

  sheetNames.forEach((sheetName) => {
    if (workbook.SheetNames.includes(sheetName)) {
      // Read the given sheet
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Remove the note line
      xlData.shift();
      // Get the total rows
      totalRows += xlData.length;

      // Parse XLSX to Object
      xlData.forEach((item) => {
        // Remove redundant columns
        ignoredCols.forEach((col) => delete item[col]);

        const { Key, Module, ...locales } = item;
        Object.keys(locales).forEach((locale) => {
          const messages = localeMessages[locale] || {};
          const module = messages[Module] || {};
          const keys = Key.split(".");
          let subModule = module;
          do {
            const key = keys.shift();
            if (!subModule[key]) {
              subModule[key] = keys.length ? {} : locales[locale];
            }
            subModule = subModule[key];
          } while (keys.length);

          messages[Module] = module;
          localeMessages[locale] = messages;
        });
      });
    } else {
      console.log(`Sheet '${sheetName}' does not exist!`);
    }
  });

  return { totalRows, localeMessages };
}

// Write to yaml language file
function writeFile(filePath, data) {
  return new Promise((resolve) => {
    fs.writeFile(filePath, yaml.dump(data), (err) => {
      if (err) {
        console.error(err);
        resolve(false);
      }
      const [fileName] = filePath.split('/').slice(-1);
      console.log(` ✔ Imported \x1b[33m${fileName}\x1b[0m`);
      resolve(true);
    });
  });
}

// Write messages to yaml
async function writeFiles(messages, outputFolder) {
  const writePromises = [];
  // Write the data to yaml files
  Object.keys(messages).forEach((locale) => {
    const outputFile = path.resolve(outputFolder, `${locale}.yml`);
    const promise = writeFile(outputFile, messages[locale]);
    writePromises.push(promise);
  });

  let results = (await Promise.all(writePromises)).filter(Boolean).length;

  return results;
}

// Utils functions
function camelize(text) {
  const a = text
    .toLowerCase()
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return a.substring(0, 1).toLowerCase() + a.substring(1);
}

// Return readable file size
function niceBytes(x) {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}
