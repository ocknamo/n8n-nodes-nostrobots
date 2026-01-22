import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IExecuteFunctions,
} from 'n8n-workflow';
import { Event, nip04 } from 'nostr-tools';
import { hexToBytes } from '@noble/hashes/utils';
import ws from 'ws';
import { defaultRelays } from '../../src/constants/rerays';
import { getNpubFromNsecOrHexpubkey } from '../../src/convert/get-npub';
import {
	getHexpubkeyfromNpubOrNsecOrHexseckey,
	getHexSecKey,
	getHex,
} from '../../src/convert/get-hex';

// polyfills
(global as any).WebSocket = ws;

export class Nostrobotsutils implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Nostr Utils',
		name: 'nostrobotsutils',
		icon: 'file:nostrobotsutils.svg',
		group: ['transform'],
		version: 1,
		description: 'Nostr Utility',
		defaults: {
			name: 'Nostr Utils',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nostrobotsApi',
				required: false,
				displayOptions: {
					show: {
						operation: ['decryptNip04'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'ConvertEvent',
						value: 'convertEvent',
					},
					{
						name: 'TransformKeys',
						value: 'transformKey',
					},
					{
						name: 'DecryptNip04',
						value: 'decryptNip04',
					},
				],
				default: 'convertEvent',
				noDataExpression: true,
				required: true,
				description: 'Utility type',
			},
			{
				displayName: 'ConvertOutput',
				name: 'convertOutput',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['convertEvent'],
					},
				},
				options: [
					{
						name: 'Naddr',
						value: 'naddr',
						description: 'Naddr from event',
						action: 'naddr from event',
					},
					{
						name: 'Nevent',
						value: 'nevent',
						description: 'Nevent from event',
						action: 'nevent from event',
					},
				],
				default: 'naddr',
				noDataExpression: true,
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['convertEvent'],
						convertOutput: ['naddr', 'nevent'],
					},
				},
				default: '',
				placeholder: '<target event json>',
				description: 'Set source event here',
			},
			{
				displayName: 'Relay Hints',
				name: 'relayhints',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['convertEvent'],
						convertOutput: ['naddr', 'nevent'],
					},
				},
				default: defaultRelays.join(','),
				placeholder: 'wss://relay.damus.io,wss://nostr.wine',
				description: 'Relay address joined with ","',
			},
			// For transformKey
			{
				displayName: 'TransformTo',
				name: 'transformTo',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['transformKey'],
					},
				},
				options: [
					{
						name: 'Npub',
						value: 'npub',
						description: 'Bech 32 npub',
						action: 'transform to npub',
					},
					{
						name: 'Nsec',
						value: 'nsec',
						description: 'Bech 32 nsec',
						action: 'transform to nsec from hex secret key',
					},
					{
						name: 'Hexpubkey',
						value: 'hexpubkey',
						description: 'Hex publickey',
						action: 'transform to hex publickey',
					},
					{
						name: 'Hexseckey',
						value: 'hexseckey',
						description: 'Hex secretkey',
						action: 'transform to hex secretlickey from nsec',
					},
				],
				default: 'npub',
			},
			{
				displayName: 'TransformInput',
				name: 'transformInput',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['transformKey'],
					},
				},
				default: '',
				placeholder: '5a61f...',
				description: 'Set input value',
			},
			// Hints
			{
				displayName: 'Select input value from Nsec or Hexpubkey',
				name: 'Npubnotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						transformTo: ['npub'],
					},
				},
			},
			{
				displayName: 'Set hex secretkey as input value',
				name: 'Nsecnotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						transformTo: ['nsec'],
					},
				},
			},
			{
				displayName: 'Select input value from Npub or Nsec or Hexseckey',
				name: 'Hexpubkeynotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						transformTo: ['hexpubkey'],
					},
				},
			},
			{
				displayName: 'Set nsec as input value',
				name: 'hexseckeynotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						transformTo: ['hexseckey'],
					},
				},
			},
			// For NIP-04 Decrypt
			{
				displayName: 'NIP-04 Security Warning',
				name: 'nip04Warning',
				type: 'notice',
				default:
					'NIP-04 is deprecated and leaks metadata. Use only with AUTH-enabled relays for non-sensitive communications.',
				displayOptions: {
					show: {
						operation: ['decryptNip04'],
					},
				},
			},
			{
				displayName:
					'NIP-04 requires Nostrobots API credentials (secret key) to decrypt messages. Please configure your credentials first.',
				name: 'nip04CredentialsRequired',
				type: 'notice',
				displayOptions: {
					show: {
						operation: ['decryptNip04'],
					},
				},
				default: '',
			},
			{
				displayName: 'Sender Public Key (Npub or Hex)',
				name: 'senderPubkey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['decryptNip04'],
					},
				},
				default: '',
				placeholder: 'npub1... or hex string',
				description: 'Public key of the message sender',
			},
			{
				displayName: 'Encrypted Content',
				name: 'encryptedContent',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['decryptNip04'],
					},
				},
				default: '',
				placeholder: 'encrypted message content',
				description: 'NIP-04 encrypted message content to decrypt',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		const nip19 = (await import('nostr-tools')).nip19;

		if (operation === 'convertEvent') {
			const output = this.getNodeParameter('convertOutput', 0) as string;
			for (let i = 0; i < items.length; i++) {
				// Get Event
				const event = this.getNodeParameter('event', i) as string;
				const eventJson: Event = typeof event === 'object' ? (event as object) : JSON.parse(event);

				if (!eventJson) {
					throw new NodeOperationError(this.getNode(), 'Invalid Event json value.');
				}

				// Get relay input
				const relays = this.getNodeParameter('relayhints', i) as string;
				const relayArray = relays.split(',');

				switch (output) {
					case 'naddr':
						const dtag = eventJson.tags.find((tag) => tag[0] === 'd');

						if (!dtag) {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid Event json value with no d tag.',
							);
						}

						const d = dtag[1];

						const naddr = nip19.naddrEncode({
							identifier: d,
							pubkey: eventJson.pubkey,
							kind: eventJson.kind,
							relays: relayArray,
						});

						returnData.push({ naddr });
						break;

					case 'nevent':
						const nevent = nip19.neventEncode({
							id: eventJson.id,
							relays: relayArray,
							author: eventJson.pubkey,
						});

						returnData.push({ nevent });
						break;

					default:
						break;
				}
			}
		} else if (operation === 'transformKey') {
			const transformTo = this.getNodeParameter('transformTo', 0) as
				| 'npub'
				| 'nsec'
				| 'hexpubkey'
				| 'hexseckey';

			const input = this.getNodeParameter('transformInput', 0) as string;

			let output = '';

			switch (transformTo) {
				case 'npub':
					output = await getNpubFromNsecOrHexpubkey(input);
					break;

				case 'nsec':
					output = nip19.nsecEncode(hexToBytes(input));
					break;

				case 'hexpubkey':
					output = await getHexpubkeyfromNpubOrNsecOrHexseckey(input);
					break;

				case 'hexseckey':
					output = getHexSecKey(input);
					break;

				default:
					throw new NodeOperationError(this.getNode(), 'Invalid transformTo value.');
			}
			returnData.push({ output, type: transformTo });
		} else if (operation === 'decryptNip04') {
			// Get credentials for NIP-04
			const credentials = await this.getCredentials('nostrobotsApi');
			const { secKey } = credentials;

			if (typeof secKey !== 'string') {
				throw new NodeOperationError(this.getNode(), 'Invalid secret key was provided!');
			}

			let sk: Uint8Array;
			if (secKey.startsWith('nsec')) {
				sk = hexToBytes(getHex(secKey, 'nsec'));
			} else {
				sk = hexToBytes(secKey);
			}

			for (let i = 0; i < items.length; i++) {
				try {
					// Get parameters
					const senderPubkey = this.getNodeParameter('senderPubkey', i) as string;
					const encryptedContent = this.getNodeParameter('encryptedContent', i) as string;

					// Convert sender public key to hex format
					let hexSenderPubkey: string;
					if (senderPubkey.startsWith('npub')) {
						hexSenderPubkey = await getHexpubkeyfromNpubOrNsecOrHexseckey(senderPubkey);
					} else {
						hexSenderPubkey = senderPubkey;
					}

					// Decrypt the content
					const decryptedContent = await nip04.decrypt(sk, hexSenderPubkey, encryptedContent);

					returnData.push({
						decryptedContent,
						senderPubkey: hexSenderPubkey,
						originalEncrypted: encryptedContent,
					});
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to decrypt NIP-04 message: ${
							error instanceof Error ? error.message : 'Unknown error'
						}`,
					);
				}
			}
		} else {
			throw new NodeOperationError(this.getNode(), 'Invalid operation.');
		}

		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
