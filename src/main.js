const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");
const tc = require("@actions/tool-cache");

const owner = "koki-develop";
const repo = "qiita-cli";

/**
 * @param {String} version
 * @param {String} path
 * @returns {Promise<String>}
 */
const _install = async (version, path) => {
  core.info("Installing...");

  const extractedPath = await (async () => {
    switch (process.platform) {
      case "win32":
        return tc.extractZip(path);
      default:
        return tc.extractTar(path);
    }
  })();
  const binPath = await tc.cacheDir(extractedPath, "qiita", version);
  core.addPath(binPath);

  core.info(`Installed to ${binPath}`);
  return binPath;
};

/**
 * @param {String} version
 * @returns {Promise<String>}
 */
const _getVersion = async (version) => {
  const token = core.getInput("github-token");
  const octo = github.getOctokit(token);

  let release;
  if (version === "latest") {
    release = await octo.rest.repos.getLatestRelease({ owner, repo });
  } else {
    if (!version.startsWith("v")) {
      version = `v${version}`;
    }
    release = await octo.rest.repos.getReleaseByTag({
      owner,
      repo,
      tag: version,
    });
  }

  version = release.data.tag_name;
  core.info(`version: ${version}`);

  return version;
};

/**
 * @param {String} version
 * @returns {Promise<String>}
 */
const _download = async (version) => {
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
    switch (process.platform) {
      case "win32":
        return "zip";
      default:
        return "tar.gz";
    }
  })();

  const url = `https://github.com/${owner}/${repo}/releases/download/${version}/qiita_${platform}_${arch}.${ext}`;

  core.info(`Downloading... ${url}`);
  const cliPath = await tc.downloadTool(url);
  core.info(`Downloaded to ${cliPath}`);

  return cliPath;
};

/**
 * @param {String} accessToken
 * @param {String} format
 */
const configure = async (accessToken, format) => {
  await exec.exec("qiita", [
    "configure",
    "--access-token",
    accessToken,
    "--format",
    format,
  ]);
};

(async () => {
  const version = await _getVersion(core.getInput("version"));
  const cliPath = await _download(version);
  await _install(version, cliPath);
  await configure(core.getInput("access-token"), core.getInput("format"));
})().catch((err) => {
  core.setFailed(err.message);
});
