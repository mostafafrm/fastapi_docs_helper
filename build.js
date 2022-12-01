const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const packageDotJson = require("./package.json");

const KEEP_TEMPORARY_FILES = false;
const OVERWRITE_DESTINATION = true;
const SOURCE_DIRECTORY = path.join(__dirname, "src");
const ORIGINAL_ICON = path.join(SOURCE_DIRECTORY, "icon.svg");
const DESTINATION_DIRECTORY = path.join(__dirname, "build");

function createTempDir(prefix) {
  return fs.mkdtempSync(path.join(DESTINATION_DIRECTORY, `tmp-${prefix}-`));
}

function clearDir(dir) {
  fs.rm(dir, { recursive: true }, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Cleaning temporary files: ${dir}`);
    }
  });
}

function createIcon(src, dest_dir, size) {
  const baseIcon = path.parse(src);
  const file = path.join(dest_dir, `${baseIcon.name}_${size}.png`);
  // Documentation: https://sharp.pixelplumbing.com/api-channel#bandbool
  sharp(src).bandbool(sharp.bool.or).png().resize(size).toFile(file);
  return file;
}

function makeIcons(src, dest_dir, sizes) {
  const icons_directory = path.join(dest_dir, "icons");
  fs.mkdirSync(icons_directory);

  const icons = {};
  for (const size of sizes) {
    const file = createIcon(src, icons_directory, size);
    const posix_path = path.posix.join(
      path.basename(icons_directory),
      path.basename(file)
    );
    icons[size] = posix_path;
  }
  return icons;
}

function getManifest(src_dir, ...variants) {
  const { name, version, description } = packageDotJson;
  let manifest = { name, version, description };
  for (const variant of variants) {
    const filepath = path.join(src_dir, `manifest-${variant}.json`);
    const raw_data = fs.readFileSync(filepath);
    const json_data = JSON.parse(raw_data);
    manifest = { ...manifest, ...json_data };
  }
  return manifest;
}

function findSourceFiles(src_dir, obj) {
  let strings = [];
  if (typeof obj === "string") {
    if (fs.existsSync(path.join(src_dir, obj))) {
      return [obj];
      /*
      the line above has the same effect as:
      strings = [...strings, obj];
      */
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      strings = [...strings, ...findSourceFiles(src_dir, item)];
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const value of Object.values(obj)) {
      strings = [...strings, ...findSourceFiles(src_dir, value)];
    }
  }
  return strings;
}

function copySourceFiles(src_dir, dest_dir, manifest) {
  const sourceFiles = findSourceFiles(src_dir, manifest);
  for (const sourceFile of sourceFiles) {
    const dest_dir_final = path.join(dest_dir, path.dirname(sourceFile));
    if (!fs.existsSync(dest_dir_final)) fs.mkdirSync(dest_dir_final);

    const sourceFilePath = path.join(src_dir, sourceFile);
    const destinationFilePath = path.join(
      dest_dir_final,
      path.basename(sourceFile)
    );
    fs.copyFileSync(sourceFilePath, destinationFilePath);
  }
}

function makeExtension(type, iconSizes) {
  const temp_dir = createTempDir(type);

  let manifest = getManifest(SOURCE_DIRECTORY, type, "base");
  copySourceFiles(SOURCE_DIRECTORY, temp_dir, manifest);

  const icons = makeIcons(ORIGINAL_ICON, temp_dir, iconSizes);
  manifest = { ...manifest, icons };

  const manifest_file = path.join(temp_dir, "manifest.json");
  const filename = `${packageDotJson.name}-${packageDotJson.version}-${type}.zip`;
  fs.writeFileSync(manifest_file, JSON.stringify(manifest));
  import("web-ext").then((webExt) => {
    webExt.cmd
      .build({
        sourceDir: temp_dir,
        artifactsDir: DESTINATION_DIRECTORY,
        filename,
        overwriteDest: OVERWRITE_DESTINATION,
      })
      .then(() => {
        if (!KEEP_TEMPORARY_FILES) clearDir(temp_dir);
      });
  });
}

// Main build

if (!fs.existsSync(DESTINATION_DIRECTORY)) fs.mkdirSync(DESTINATION_DIRECTORY);

makeExtension("firefox", [96, 48, 32, 16]);
makeExtension("chromium", [128, 48, 32, 16]);
