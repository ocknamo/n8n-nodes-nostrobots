# Nostr Utils

## Operation

- type: selectbox

Select the operation you want to perform.

- ConvertEvent
- TransformKeys
- DecryptNip04

### ConvertEvent

Converts Event to Naddr or Nevent format

https://github.com/nostr-protocol/nips/blob/master/19.md#shareable-identifiers-with-extra-metadata

### TransformKeys

You can convert between Npub, Nsec, Hex public key, and Hex secret key.

### DecryptNip04

Decrypt NIP-04 encrypted messages. This operation requires Nostrobots API credentials (secret key) to decrypt the message content.

**Security Warning**: NIP-04 is deprecated in favor of NIP-17. This standard leaks metadata and must not be used for sensitive communications.

## ConvertOutput

- type: selectbox

Select the destination of ConvertEvent. Can only be specified when Operation is ConvertEvent.

- Naddr
- Nevent

## Event

- type: text

Enter the source Event in json format. Can only be specified when Operation is ConvertEvent.

## Relay Hints

- type: text

Set the relay hint value to be added to Naddr and Nevent. Enter the URL of the relay. If you specify multiple relays, separate them with a comma (,).

The default value is entered, but please set the relay where the event is saved. This can only be specified when Operation is ConvertEvent.

- Default value

```
wss://relay.damus.io,wss://relay-jp.nostr.wirednet.jp,wss://nostr-relay.nokotaro.com,wss://bitcoiner.social,wss://relay.primal.net,wss://nostr-01.yakihonne.com,wss://nostr-02.yakihonne.com
```

## TransformTo

- type: selectbox

You can select the key to convert to. This can only be specified when Operation is TransformKeys.

- Npub
- Nsec
- Hexpubkey
- Hexseckey

## TransformInput

- type: text

Enter the key to convert to. This can only be specified when Operation is TransformKeys.

## Encrypted Content

- type: text

The encrypted message content to decrypt. This can only be specified when Operation is DecryptNip04.

## Sender Public Key

- type: text

The public key of the message sender. You can use either HEX or bech32 (npub) format. This can only be specified when Operation is DecryptNip04.
