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
  - 暗号化ダイレクトメッセージ (NIP-04)
- [Nostr Read](./doc/read-ja.md)
  - イベントの取得
  - イベントID・公開鍵・文字列検索(NIP-50)・ハッシュタグ・メンション・jsonのフィルタによるクエリ
  - 暗号化ダイレクトメッセージの読み込み (NIP-04)
- [BETA] Nostr Trigger
  - イベントの購読をトリガーにn8nのワークフローを開始する
  - 特定のnpubに対するメンションによるワークフローのトリガー
  - 実行頻度の制限機能（全体、イベント作成者ごとに設定）
- [Nostr Utils](./doc/utils-ja.md)
  - イベントからnaddr, neventへの変換(ConvertEvent)
  - bech32、16進数表現の鍵を相互に変換する(TransformKeys)
  - NIP-04暗号化メッセージの復号化

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
npm run build
npm link

# move to n8n node directory. eg. ~/.n8n/nodes
npm link n8n-nodes-nostrobots
n8n start
```

### Unit test

``` sh
npm run test
```

## lint

``` sh
npm run format
npm run lint
```

## See also

- [ノーコードで作るnostrボット - n8n-nostrobots](https://habla.news/u/ocknamo@ocknamo.com/1702402471044) (japanese)

## License

[MIT License](LICENSE.md)
