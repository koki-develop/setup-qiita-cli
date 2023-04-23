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

  core.info(`platform: ${process.platform}`);
  core.info(`arch: ${process.arch}`);

  const platform = (() => {
    switch (process.platform) {
      case "win32":
        return "Windows";
      case "linux":
        return "Linux";
      case "darwin":
        return "Darwin";
      default:
        return "Linux";
    }
  })();

  const arch = (() => {
    switch (process.arch) {
      case "x64":
        return "x86_64";
      case "arm64":
        return "arm64";
      case "ia32":
        return "i386";
      default:
        return "x86_64";
    }
  })();

  const ext = (() => {
    switch (platform) {
      case "Windows":
        return "zip";
      default:
        return "tar.gz";
    }
  })();

  const url = `https://github.com/koki-develop/qiita-cli/releases/download/${version}/qiita_${platform}_${arch}.${ext}`;
  core.info(`Downloading... ${url}`);
  const cliPath = await tc.downloadTool(url);
  core.info(`Downloaded to ${cliPath}`);

  core.info("Installing...");
  const extractedPath = await (async () => {
    switch (ext) {
      case "zip":
        return tc.extractZip(cliPath);
      case "tar.gz":
        return tc.extractTar(cliPath);
    }
  })();
  const binPath = await tc.cacheDir(extractedPath, "qiita", "0.1.0");
  core.addPath(binPath);
  core.info(`Installed to ${binPath}`);
})().catch((err) => {
  core.setFailed(err.message);
});
