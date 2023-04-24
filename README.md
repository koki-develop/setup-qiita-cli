# setup-qiita-cli

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/koki-develop/setup-qiita-cli)](https://github.com/koki-develop/setup-qiita-cli/releases/latest)
[![GitHub](https://img.shields.io/github/license/koki-develop/setup-qiita-cli)](./LICENSE)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/koki-develop/setup-qiita-cli/release.yml)](https://github.com/koki-develop/setup-qiita-cli/actions/workflows/release.yml)

GitHub Actions ワークフローで [Qiita CLI](https://github.com/koki-develop/qiita-cli) をセットアップするアクション。

# 目次

- [使い方](#使い方)
- [ライセンス](#ライセンス)

# 使い方

```yaml
- uses: koki-develop/setup-qiita-cli@v1
  with:
    # インストールする Qiita CLI のバージョン。
    # 省略したり `latest` を指定した場合は最新のバージョンがインストールされます。
    version: latest

    # Qiita のアクセストークン。
    access-token: ${{ secrets.QIITA_ACCESS_TOKEN }}

    # デフォルトの出力フォーマット (table|json) 。
    # 省略した場合は `table` になります。
    format: table

    # setup-qiita-cli はバージョン情報を取得するときに GitHub REST API を使用しますが、
    # 頻繁に setup-qiita-cli を実行するとレート制限 (60req/1h) に引っかかることがあります。
    # GitHub Actions で自動的に作成される `GITHUB_TOKEN` シークレットを渡すとこれを回避することができます。
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

# ライセンス

[MIT](./LICENSE)
