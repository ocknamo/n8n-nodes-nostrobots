<img src="./assets/top-image.png" width=600px height=auto />

English is [here](./README.md).

# n8n-nodes-Nostrobots

Nostrのためのn8nノード。

これは、n8n コミュニティノードです。 これにより、n8n ワークフローで nostr を使用できるようになります。

[Nostr は最も単純なオープン プロトコルです。 それは、検閲に耐えるグローバルな「ソーシャル」ネットワークをきっぱりと構築することができます。](https://github.com/nostr-protocol/nostr)


[n8n](https://n8n.io/) は [フェアコードライセンス](https://docs.n8n.io/reference/license/) のワークフロー自動化プラットフォームです。

* [Installation](#installation)
* [Operations](#operations)
* [Credentials](#credentials)
* [Usage](#usage)
* [Resources](#resources)

## Installation

n8n コミュニティ ノードのドキュメントの [インストール ガイド](https://docs.n8n.io/integrations/community-nodes/installation/) に従ってください。

## Operations

- [Nostr Write (Nostr Robots)](./doc/write-ja.md)
  - kind1 note の送信
  - イベントの送信(advanced)
  - 生のJsonイベント(advanced)
- [Nostr Read](./doc/read-ja.md)
  - イベントの取得
  - イベントID・公開鍵・文字列検索(NIP-50)・ハッシュタグによるクエリ。

## Credentials

- 秘密鍵
   - bech32 または小文字の 16 進文字列を使用できます。

## Usage

[簡単なRSSフィードボットを作成するチュートリアル](./doc//rss-feed-bot-ja.md)を試すことができます。

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [nips](https://github.com/nostr-protocol/nips#nips)


## Test in local


[ノードをローカルで実行する](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/#run-your-node-locally) をお読みください。

``` sh
# project root path
yarn build
yarn link

# move to n8n node directory. eg. ~/.n8n/nodes
yarn link n8n-nodes-nostrobots
n8n start
```

### Unit test

``` sh
yarn test
```

## lint

``` sh
yarn format
yarn lint
```

## TODO

- メンションによるイベントのクエリ
- リレーからイベントを取得してトリガーする新たなノード

## See also

- [ノーコードで作るnostrボット - n8n-nostrobots](https://habla.news/u/ocknamo@ocknamo.com/1702402471044) (japanese)

## License

[MIT License](LICENSE.md)
