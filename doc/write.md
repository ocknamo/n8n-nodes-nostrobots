# Nostr Write

This is a node that writes events to Nostr relays.
Before using this node, you need to register the private key of the account you want to write to n8n as credential information.

## Credential to connect with

- type: selectbox

Select the credential information you created and decide the account to post. Creating multiple credentials adds multiple accounts to your selection.
We recommend that you create and use a disposable test account while you are creating your workflow.

## Resource

- type: selectbox

You can choose how you want to create the event. There are four options:

- 'BasicNote'
- 'Event(advanced)'
- 'Raw Json Event(advanced)'
- 'Encrypted Direct Message(nip-04)'

### BasicNote

This is the simplest note event (`kind1`). This is an event that can be viewed on the SNS client. It is the easiest to use, as it can be used by setting the body in 'Content', and it can probably be used even if you do not understand the Nostr protocol very well.

### Event(advanced)

Unlike BasicNote, you can set kind and tags. It seems that you need to understand at least [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) to use it.


There are quite a few menu items added from BasicNote. I will list them below.

- Kind
- Tags
- ShowOtherOption
    - EventId
    - Pubkey
    - Sig
    - CreatedAt

If ShowOtherOption is enabled, the menu below EventId can be displayed. Opportunities to use these are quite limited, so they are hidden by default.

Please note that if ShowOtherOption is enabled, Sig (signature) is required, so the account selected in 'Credential to connect with' will not be used to sign. You must sign it yourself.

### Kind

- type: number

You can set the kind number of the event.
Please check NIP for details.
- Event Kinds https://github.com/nostr-protocol/nips#event-kinds

### Tags

- type: json

You can set tags to add to events. json must be input. Please note that if it cannot be parsed as json or is not in tag array format, a run-time error will occur. It is not validated during configuration.

The method of specifying tags varies depending on the client, so it is quite difficult. Basically check NIP for this as well.
- Tags https://github.com/nostr-protocol/nips#standardized-tags

FYI. Sample tag for mentioning

```
[["e","dad5a4164747e4d88a45635c27a8b4ef632ebdb78dcd6ef3d12202edcabe1592","","root"],
["e","dad5a4164747e4d88a45635c27a8b4ef632ebdb78dcd6ef3d12202edcabe1592","","reply"],
["p","26bb2ebed6c552d670c804b0d655267b3c662b21e026d6e48ac93a6070530958"],
["p","26bb2ebed6c552d670c804b0d655267b3c662b21e026d6e48ac93a6070530958"]]
```

### otherOption

I don't think it is necessary to explain this in detail. This is an item as the name suggests.

- EventId
	- type: text
- Pubkey
	- type: text
- Sig
  - type: text
- CreatedAt
  - type: number
    - It's unixtime.

### Raw Json Event(advanced)

This option allows you to set raw json as is. Although the usage is limited, there may be cases where you want to publish events obtained with Nostr Read as they are.


### json

- type: text

Displayed only for 'Raw Json Event(advanced)'. Enter the full signed event json for json. Therefore, it will not sign with the account selected in 'Credential to connect with'.

### Encrypted Direct Message(nip-04)

This option allows you to send encrypted direct messages using NIP-04. The message content will be encrypted using the sender's private key and the recipient's public key.

**Security Warning**: NIP-04 is deprecated in favor of NIP-17. This standard leaks metadata and must not be used for sensitive communications. Only use with AUTH-enabled relays.

#### SendTo

- type: text

The public key of the nip-04 message recipient. You can use either HEX or bech32 (npub) format.


## Content

- type: text

The main text of the event. Available when 'BasicNote' or 'Event(advanced)' is selected in the Resource option.


## Operation

- type: selectbox

Select the operation to perform. Currently, there is only `Send` to publish the created event to the relay.

## Custom Relay

- type: text

Specifies the relay to send the event to. The schema and default relay are the same as Nostr Read.

# About runtime behavior

- The timeout when posting an event is 10 seconds. Therefore, it may take more than 10 seconds for the node to run.
- When the posting is completed successfully, the node will output the result.


the schema is `[<statu:s>]: <Relay URL>`

- Example (successful): `[accepted]: wss://nos.lol`
- Example (failed): `[failed]: wss://nos.lol`
- Example (timeout): `[timeout]: wss://nos.lol`
