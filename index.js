const core = require("@actions/core");

try {
  core.info("Hello World!");
} catch (error) {
  core.setFailed(error.message);
}
