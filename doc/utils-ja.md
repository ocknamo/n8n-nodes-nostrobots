# Nostr Utils

## Operation

- type: セレクトボックス

実行したい操作を選択します。

- ConvertEvent
- TransformKeys
- DecryptNip04

### ConvertEvent

EventをNaddrかNeventの形に変換します

https://github.com/nostr-protocol/nips/blob/master/19.md#shareable-identifiers-with-extra-metadata

### TransformKeys

Npub,Nsec,Hex public key,Hex secret keyのうち変換可能な組み合わせを相互に変換することができます。

### DecryptNip04

NIP-04で暗号化されたメッセージを復号化します。この操作はメッセージ内容を復号化するためにNostrobots APIクレデンシャル（秘密鍵）が必要です。

**セキュリティ警告**: NIP-04は非推奨でありNIP-17を推奨します。この標準はメタデータを漏洩させ、機密性の高い通信には使用しないでください。

## ConvertOutput

- type: セレクトボックス

ConvertEventの変換先を選択します。OperationがConvertEventの場合のみ指定できます。

- Naddr
- Nevent

## Event

- type: テキスト

変換元のEventをjson形式で入力します。OperationがConvertEventの場合のみ指定できます。

## Relay Hints

- type: テキスト


Naddr,Neventに追加されるリレーヒントの値を設定します。リレーのURLを入力してください。複数を指定する場合はカンマ(,)でつなげて書いてください。
デフォルトの値を入れていますがEventが保存されているリレーを設定するようにしてください。OperationがConvertEventの場合のみ指定できます。

- デフォルト値

```
wss://relay.damus.io,wss://relay-jp.nostr.wirednet.jp,wss://nostr-relay.nokotaro.com,wss://bitcoiner.social,wss://relay.primal.net,wss://nostr-01.yakihonne.com,wss://nostr-02.yakihonne.com
```

## TransformTo

- type: セレクトボックス

変換先の鍵を選択できます。OperationがTransformKeysの場合のみ指定できます。

- Npub
- Nsec
- Hexpubkey
- Hexseckey

## TransformInput

- type: テキスト

変換元の鍵を入力します。OperationがTransformKeysの場合のみ指定できます。

## Encrypted Content

- type: テキスト

復号化する暗号化されたメッセージ内容です。OperationがDecryptNip04の場合のみ指定できます。

## Sender Public Key

- type: テキスト

メッセージ送信者の公開鍵です。HEXまたはbech32 (npub)形式のいずれも使用できます。OperationがDecryptNip04の場合のみ指定できます。
