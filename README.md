<img src="./assets/top-image.png" width=600px height=auto />

日本語は[こちら](./README-ja.md)。

# n8n-nodes-Nostrobots

n8n node for nostr.

This is an n8n community node. It lets you use nostr in your n8n workflows.

[Nostr is the simplest open protocol. that is able to create a censorship-resistant global "social" network once and for all.](https://github.com/nostr-protocol/nostr)


[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)
[Usage](#usage)
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Nostr Write (Nostrobots)
  - Send kind1 note
  - Send event(advanced)
  - Raw Json Event(advanced)
- Nostr Read
  - Fetch events
    - Qyery by eventId, public key.

## Credentials

- Secret Key
  - You can use bech32 or lower case hex string.

## Usage

TBD

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [nips](https://github.com/nostr-protocol/nips#nips)


## Test in local

Please read [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/#run-your-node-locally).

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

- Query events by tags.
- Query events by words.
- Query events by mention.
- Trigger node by getting event from relay.

## See also

- [ノーコードで作るnostrボット - n8n-nostrobots](https://habla.news/u/ocknamo@ocknamo.com/1702402471044) (japanese)

## License

[MIT License](LICENSE.md)
