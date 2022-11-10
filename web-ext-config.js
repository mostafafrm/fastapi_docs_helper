require("dotenv").config({ path: "web-ext.env" });
const env_vars = process.env;

/*  web-ext environment variables
    for details see: https://extensionworkshop.com/documentation/develop/web-ext-command-reference/
*/
module.exports = {
  sourceDir: env_vars.WEB_EXT_SOURCE_DIR,
  artifactsDir: env_vars.WEB_EXT_ARTIFACTS_DIR,
  build: {
    overwriteDest: env_vars.WEB_EXT_OVERWRITE_DEST === "true" ? true : false,
  },
};
