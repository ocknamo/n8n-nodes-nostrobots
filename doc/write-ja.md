# Nostr Write

Nostrのリレーにイベントの書き込みを行うノードです。
このノードを使用する前に書き込みを行いたいアカウントの秘密鍵をn8nにクレデンシャル情報として登録する必要があります。

## Credential to connect with

- type: セレクトボックス

作成したクレデンシャル情報を選択して投稿するアカウントを決めます。クレデンシャルを複数作成すると複数のアカウントが選択肢に追加されます。
ワークフローの作成途中は使い捨て可能なテストアカウントを作成して使用することをおすすめします。


## Resource

- type: セレクトボックス

どのような方法でイベントを作成するか選択することができます。以下の３つのオプションがあります。

- 'BasicNote'
- 'Event(advanced)'
- 'Raw Json Event(advanced)'

### BasicNote

一番単純なノートイベント(`kind1`)です。SNS用のクライアントで見ることができるイベントです。'Content'に本文を設定すれば使用できるため使い方も一番簡単で、おそらくNostrプロトコルをあまり理解していなくても利用可能です。

### Event(advanced)

BasicNoteと異なりkindやtagsを設定することができます。利用するには少なくともNIP-01を理解する必要があると思われます。


BasicNoteから追加になるメニュー項目がかなりたくさんあります。以下に箇条書します。

- Kind
- Tags
- ShowOtherOption
    - EventId
    - Pubkey
    - Sig
    - CreatedAt

ShowOtherOptionを有効にするとEventId以下のメニューを表示できます。これらを使う機会はかなり限られるためデフォルトで非表示にしています。

注意点としてShowOtherOptionが有効な場合Sig(署名)が必須となるため'Credential to connect with'で選択したアカウントでは署名を行いません。自力で署名する必要があります。

### Kind

- type: 数字

イベントのkindナンバーを設定できます。
詳しくはNIPを確認してください。
- Event Kinds https://github.com/nostr-protocol/nips#event-kinds'

### Tags

- type: json

イベントに追加するタグを設定できます。jsonを入力する必要があります。jsonでパースできない場合やタグの配列形式ではない場合、実行時エラーとなることに注意してください。設定時にはバリデーションされません。

タグの指定方法はクライアントでまちまちだったりして結構難しいです。これも基本的にNIPを確認してください。
- Tags https://github.com/nostr-protocol/nips#standardized-tags

FYI. メンションを行う場合のタグのサンプル

```
[["e","dad5a4164747e4d88a45635c27a8b4ef632ebdb78dcd6ef3d12202edcabe1592","","root"],
["e","dad5a4164747e4d88a45635c27a8b4ef632ebdb78dcd6ef3d12202edcabe1592","","reply"],
["p","26bb2ebed6c552d670c804b0d655267b3c662b21e026d6e48ac93a6070530958"],
["p","26bb2ebed6c552d670c804b0d655267b3c662b21e026d6e48ac93a6070530958"]]
```

### otherOption

これは細かく説明する必要もないかと思います。名前の通りの項目です。

- EventId
	- type: テキスト
- Pubkey
	- type: テキスト
- Sig
  - type: テキスト
- CreatedAt
  - type: 数字
    - unixtimeです

### Raw Json Event(advanced)

生のjsonをそのまま設定できるオプションです。使い方は限られますが、Nostr Readで取得したイベントをそのままパブリッシュしたい場合などが考えられます。


### json

- type: テキスト

'Raw Json Event(advanced)'の場合のみ表示されます。jsonには完全な署名済みイベントのjsonを入力してください。したがって'Credential to connect with'で選択したアカウントで署名しません。


## Content

- type: テキスト

イベントの本文です。Resourceの選択肢で'BasicNote'か'Event(advanced)'を選択した場合に利用できます。


## Operation

- type: セレクトボックス

実行するオペレーションを選択します。いまは作成したイベントをリレーにパブリッシュする`Send`しかありません。

## Custom Relay

- type: テキスト

イベントを送信するリレーを指定します。スキーマやデフォルトリレーはNostr Readと同じです。

# 実行時の挙動について

- イベント投稿時のタイムアウトは10秒です。そのためノードの実行に10秒以上かかる場合があります。
- 投稿が正常に完了すると結果をノードが出力します。
	- `[<statu:s>]: <Relay URL>`
	- 例（成功）: `[accepted]: wss://nos.lol`
	- 例（失敗）: `[failed]: wss://nos.lol`
	- 例（タイムアウト）: `[timeout]: wss://nos.lol`
