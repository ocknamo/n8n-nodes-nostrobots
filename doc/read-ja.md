# Nostr Read

## Strategy

- type: セレクトボックス

リレーからイベントを取得する方法を指定します。以下の４つのオプションを選ぶことができます。
リレーに送るフィルタとしてなにを設定するかを選んでいるだけです。

- UserPublickey
- EventId
- Text Search
- 暗号化ダイレクトメッセージ(nip-04)


### UserPublickey

対象のユーザを示す公開鍵文字列を指定できます。HEXでもbech32(npub)方式でもどちらでも指定できます。

### EventId

対象のイベントのeventIdです。eventIdにリレーの情報が含まれる場合、指定したリレーに加えてそのリレーにも取得リクエストを送ります。

HEXでもbech32(nevent)方式でもどちらでも指定できます。

### Search Word

入力したテキストでイベントの本文を文字列検索することができます。[NIP-50](https://github.com/nostr-protocol/nips/blob/master/50.md)に対応したリレーを設定する必要があります。
取得の対象は期間指定の範囲内に発行されたノートイベント(kind1)です。

### 暗号化ダイレクトメッセージ(nip-04)

NIP-04を使用して暗号化されたダイレクトメッセージ(kind 4)を取得し復号化します。このオプションはメッセージを復号化するためにNostrobots APIクレデンシャル（秘密鍵）が必要です。

**セキュリティ警告**: NIP-04は非推奨でありNIP-17を推奨します。この標準はメタデータを漏洩させ、機密性の高い通信には使用しないでください。AUTH有効なリレーでのみ使用してください。

取得されたメッセージは、あなたの秘密鍵と送信者の公開鍵を使用して自動的に復号化されます。あなたの公開鍵に基づいて送信・受信両方のメッセージが取得されます。


## 期間の範囲指定

イベントの取得対象期間を指定します。StrategyがUserPublickeyの場合のみ指定できます。
以下のオプションを指定できます。

- 'Relative'
- 'From'
- 'Unit'
- 'Since'
- 'Until'


### Relative

- type: トグルスイッチ

期間の指定方法です。Relativeがオンの場合は過去に遡っていつから取得するかを相対的に指定することができます。（もちろん現在まで取得します）

### From

- type: 数字

現在から遡っていつから取得範囲にするかを指定することができます。Relativeが有効な場合のみ指定できます。

### Unit

- type: セレクトボックス

単位を選択肢から選ぶことができます。Relativeが有効な場合のみ指定できます。

- 'Day'
- 'Hour'
- 'Minute'

> NOTE:
> 例えばFromを"1"に設定してUnitを"day"に設定した場合取得範囲は、”1日前からノードの実行時刻”までのイベントが対象になります。


### Since, Until

- type: 日時

Relativeを無効にした場合期間範囲指定は'Since', 'Until'を使用します。
その名の通り'Since'の日時から'Until'日時までの期間指定でイベントを取得することができます。


## Custom Relay

- type: テキスト

問い合わせ先のリレーを指定します。リレーのURLを入力してください。複数を指定する場合はカンマ(,)でつなげて書いてください。
デフォルト値としてリレーを8件設定しているため、ここは修正しないでそのまま使用してもらって構いません。ただし、当たり前ですがデフォルトリレーが正常に動いていることは保証できません。

- デフォルトリレー

```
wss://relay.damus.io,wss://relay-jp.nostr.wirednet.jp,wss://nostr-relay.nokotaro.com,wss://nostr.fediverse.jp,wss://nostr.holybea.com,wss://nos.lol,wss://relay.snort.social,wss://nostr.mom
```

## Error With Empty Result

- type: トグルスイッチ

有効にした場合取得イベントが存在しない場合はエラーになってワークフローを停止することができます。無効の場合はイベントがなくても、エラーにはならず空配列を次のノードに実行結果として送ります。

## Sample

jackの直近１時間のイベントを取得した実行結果です。３件のイベントを配列で取得できました。

- 設定値
    - Strategy: 'UserPublickey'
    - Pubkey: 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m'
    - Relative: True
    - From: 1
    - Unit: Hour
    - Custom Relay: <デフォルト>
    - Error With Empty Result: False


```
[
  {
    "id": "6c1428c9afdd315f07a9b6e22118ce45c31b2a8de12ef694121ae1cfd06ee2df",
    "kind": 1,
    "pubkey": "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
    "created_at": 1702389559,
    "content": "Only for you. Of course",
    "tags": [
      [
        "e",
        "4e222fdb7edb65172f85f262eff95a53132bcac6ccd2842b23c79f8bc0872e15"
      ],
      [
        "e",
        "9295e82f3b802728dc18ef888bad81b3110711679982dc94e719f5a20e7e2528"
      ],
      [
        "p",
        "e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411"
      ]
    ],
    "sig": "ad3b4873c8c4103555f5bdec4ad39cc0b029f000d88e67964a72e41359981440b776aea6e3758257346ae8c5efde6efe8cda2490abdfc3d0b02f675f06c9bada"
  },
  {
    "content": "สวัสดีชาว bitcoiners ชาวไทย",
    "created_at": 1702388695,
    "id": "309dea1a6e298fe3b591e8c4f87736528ee867a94ffa820b3225aa9169c6a009",
    "kind": 1,
    "pubkey": "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
    "sig": "e113577b3281eb6637abf5ee60aef6b7a0dd700bf6254196e862fee96d4806eefa80c37292919f4e38dedbdc2f1d2a16d58c4d3c1a7d1dab40514868f48d3277",
    "tags": [
      [
        "e",
        "4e222fdb7edb65172f85f262eff95a53132bcac6ccd2842b23c79f8bc0872e15",
        "",
        "reply"
      ],
      [
        "p",
        "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2"
      ]
    ]
  },
  {
    "id": "4e222fdb7edb65172f85f262eff95a53132bcac6ccd2842b23c79f8bc0872e15",
    "kind": 1,
    "pubkey": "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
    "created_at": 1702388333,
    "content": "nostr:naddr1qq9rzdesxgensvpnxuusygxv5lh4g8dcx6y5z0vht38k5d0ya3eezk39jmrhqsfdj2rwwv33wcpsgqqqwens60xga9",
    "tags": [],
    "sig": "7f5d80867650d5fa2a7da55d20fd604423a785e028595d0c9fb56b80a2be0d555997e06e4f3a2d9930c183122fafa51bd8035e8eb9fe83d3cc47b13e040b29d8"
  }
]
```
