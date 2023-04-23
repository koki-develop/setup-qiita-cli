const core = require("@actions/core");
const tc = require("@actions/tool-cache");

(async () => {
  const version = (() => {
    const version = "0.1.0"; // TODO: get from input
    if (!version.startsWith("v")) {
      return `v${version}`;
    }
  })();
  core.info(`version: ${version}`);

  const platform = process.platform;
  const arch = process.arch;
  core.info(`platform: ${platform}`);
  core.info(`arch: ${arch}`);

  core.info("Downloading...");
  const url = `https://github.com/koki-develop/qiita-cli/releases/download/${version}/qiita_Linux_x86_64.tar.gz`;
  const cliPath = await tc.downloadTool(url);

  core.info("Installing...");
  const extractedPath = await tc.extractTar(cliPath);
  const binPath = await tc.cacheDir(extractedPath, "qiita", "0.1.0");
  core.addPath(binPath);
  core.info("Installed.");
})().catch((err) => {
  core.setFailed(err.message);
});
