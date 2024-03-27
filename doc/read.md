# Nostr Read

## Strategy

- type: select box

Specifies how to retrieve events from the relay. You can choose from two options.
All you have to do is choose what to set as the filter to send to the relay.

- UserPublickey
- EventId
- Text Search


### UserPublickey

You can specify a public key string that identifies the target user. Either HEX or bech32 (npub) method can be specified.

### EventId

eventId of the target event. If eventId contains relay information, a retrieval request will be sent to that relay in addition to the specified relay.

Either HEX or bech32 (nevent) method can be specified.

### Search Word

The entered text can be used to string search the content of an event; at least one relay which support NIP-50 must be set.
The target of retrieval is note events (kind1) issued within a specified period of time.

## Specify period range

Specify the period for acquiring events. Can be specified only when Strategy is UserPublickey.
You can specify the following options:

- 'Relative'
- 'From'
- 'Unit'
- 'Since'
- 'Until'


### Relative

- type: toggle button

This is how to specify the period. If Relative is on, you can go back in time and relatively specify when to retrieve the data. (obtains up to the present, of course)

### From

- type: number

You can specify how far back from the present you want to acquire the data. Can be specified only when Relative is enabled.

### Unit

- type: selectbox

You can select the unit from the options. Can be specified only when Relative is enabled.

- 'Day'
- 'Hour'
- 'Minute'

> NOTE:
> For example, if From is set to "1" and Unit is set to "day", the acquisition range will be events from "1 day ago to the node execution time".


### Since, Until

- type: datetime

If Relative is disabled, use 'Since' and 'Until' to specify the period range.
As the name suggests, you can retrieve events by specifying the period from 'Since' date and time to 'Until' date and time.


## Custom Relay

- type: text

Specify the relay to contact. Please enter the relay URL. If you specify more than one, please connect them with commas (,).
Since 8 relays are set as the default value, you can use this as is without modifying it. However, it goes without saying that we cannot guarantee that the default relay is working properly.

default relay

```
wss://relay.damus.io,wss://relay-jp.nostr.wirednet.jp,wss://nostr-relay.nokotaro.com,wss://nostr.fediverse.jp,wss://nostr.holybea.com,wss://nos.lol,wss://relay.snort.social,wss://nostr.mom
```

## Error With Empty Result

- type: toggle button

When enabled, if the retrieved event does not exist, an error will occur and the workflow can be stopped. If disabled, an empty array will be sent to the next node as the execution result even if there is no event.

## Sample

This is the execution result of jack's events for the last hour. I was able to get 3 events in an array.

- Setting values
    - Strategy: 'UserPublickey'
    - Pubkey: 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m'
    - Relative: True
    - From: 1
    - Unit: Hour
    - Custom Relay: `<default>`
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
