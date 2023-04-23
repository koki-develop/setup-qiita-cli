const core = require("@actions/core");
const tc = require("@actions/tool-cache");

(async () => {
  const url =
    "https://github.com/koki-develop/qiita-cli/releases/download/v0.1.0/qiita_Linux_x86_64.tar.gz";
  const cliPath = await tc.downloadTool(url);
  const extractedPath = await tc.extractTar(cliPath);
  const binPath = await tc.cacheDir(extractedPath, "qiita", "0.1.0");
  core.addPath(binPath);
})().catch((err) => {
  core.setFailed(err.message);
});
