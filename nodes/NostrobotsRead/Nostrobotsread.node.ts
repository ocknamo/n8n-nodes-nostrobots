import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { Event, Filter, nip04, getPublicKey } from 'nostr-tools';
import { hexToBytes } from '@noble/hashes/utils';
import ws from 'ws';
import { defaultRelays } from '../../src/constants/rerays';
import { getHexEventId, getHex } from '../../src/convert/get-hex';
import { getSince, getUnixtimeFromDateString, getUntilNow } from '../../src/convert/time';
import { fetchEvents } from '../../src/read';
import { isSupportNip50 } from '../../src/common/relay-info';
import { FilterStrategy, buildFilter } from '../../src/common/filter';
import { ShareableIdentifier } from '../../src/convert/parse-tlv-hex';

// Extended Event type for NIP-04 decrypted messages
interface DecryptedEvent extends Event {
	decrypted?: boolean;
	counterpart?: string;
	decryptionError?: string;
}

// polyfills
(global as any).WebSocket = ws;

export class Nostrobotsread implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Nostr Read',
		name: 'nostrobotsread',
		icon: 'file:nostrobotsread.svg',
		group: ['transform'],
		version: 1,
		description: 'Read from Nostr relay',
		defaults: {
			name: 'Nostr Read',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nostrobotsApi',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Strategy',
				name: 'strategy',
				type: 'options',
				options: [
					{
						name: 'Encrypted Direct Message(nip-04)',
						value: 'nip-04',
					},
					{
						name: 'EventId',
						value: 'eventid',
					},
					{
						name: 'Hashtag',
						value: 'hashtag',
					},
					{
						name: 'Mention',
						value: 'mention',
					},
					{
						name: 'RawFilter(advanced)',
						value: 'rawFilter',
					},
					{
						name: 'Text Search',
						value: 'textSearch',
					},
					{
						name: 'UserPublickey',
						value: 'pubkey',
					},
				],
				default: 'pubkey',
				noDataExpression: true,
				required: true,
				description: 'Filter method',
			},
			{
				displayName: 'Pubkey',
				name: 'pubkey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						strategy: ['pubkey'],
					},
				},
				default: '',
				placeholder: 'npub...',
				description: 'Target users publickey',
			},
			{
				displayName: 'EventId',
				name: 'eventid',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						strategy: ['eventid'],
					},
				},
				default: '',
				placeholder: 'nevent... or raw hex ID',
				description:
					'Target event ID. If there is a relay in the event ID metadata, the request is also sent to that relay.',
			},
			{
				displayName: 'Search Word',
				name: 'textSearch',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						strategy: ['textSearch'],
					},
				},
				default: '',
				placeholder: 'eg. jack',
				description:
					'Set search word and you can get note include its word. You should set relays which supported NIP-50.',
			},
			{
				displayName: 'Hashtag',
				name: 'hashtag',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						strategy: ['hashtag'],
					},
				},
				default: '',
				placeholder: '#foodstr',
				description: 'Hashtag search',
			},
			{
				displayName: 'Raw Filter(advanced)',
				name: 'rawFilter',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						strategy: ['rawFilter'],
					},
				},
				default: '',
				placeholder: '{ "kinds": [1],  "#t": ["foodstr"]}',
				description: 'Raw filter JSON. But since and until value are overwrited with form value.',
				hint: 'NIP-01. https://github.com/nostr-protocol/nips/blob/master/01.md#communication-between-clients-and-relays',
			},
			{
				displayName: 'Mention',
				name: 'mention',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						strategy: ['mention'],
					},
				},
				default: '',
				placeholder: 'npub...',
				description: 'Mention search. Please enter the public key of the person mentioned.',
			},
			{
				displayName:
					'NIP-04 is deprecated in favor of NIP-17. This standard leaks metadata and must not be used for sensitive communications. Only use with AUTH-enabled relays.',
				name: 'nip04ReadWarning',
				type: 'notice',
				displayOptions: {
					show: {
						strategy: ['nip-04'],
					},
				},
				default: '',
			},
			{
				displayName:
					'NIP-04 requires Nostrobots API credentials (secret key) to decrypt messages. Please configure your credentials first.',
				name: 'nip04CredentialsRequired',
				type: 'notice',
				displayOptions: {
					show: {
						strategy: ['nip-04'],
					},
				},
				default: '',
			},
			// common option
			{
				displayName: 'Relative',
				name: 'relative',
				type: 'boolean',
				default: true,
				displayOptions: {
					hide: {
						strategy: ['eventid'],
					},
				},
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'number',
				default: 1,
				required: true,
				description: 'How many days or hours or minutes ago to now',
				displayOptions: {
					hide: {
						strategy: ['eventid'],
						relative: [false],
					},
				},
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'options',
				default: 'day',
				required: true,
				displayOptions: {
					hide: {
						strategy: ['eventid'],
						relative: [false],
					},
				},
				options: [
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Hour',
						value: 'hour',
					},
					{
						name: 'Minute',
						value: 'minute',
					},
				],
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					hide: {
						strategy: ['eventid'],
						relative: [true],
					},
				},
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					hide: {
						strategy: ['eventid'],
						relative: [true],
					},
				},
			},
			{
				displayName: 'Custom Relay',
				name: 'relay',
				type: 'string',
				default: defaultRelays.join(','),
				placeholder: 'wss://relay.damus.io,wss://nostr.wine',
				description: 'Relay address joined with ","',
			},
			{
				displayName: 'Error With Empty Result',
				name: 'errorWithEmptyResult',
				type: 'boolean',
				default: false,
				description: 'Whether throw error or not with empty events result',
				noDataExpression: true,
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		/**
		 * Handle data coming from previous nodes
		 */
		const items = this.getInputData();
		const strategy = this.getNodeParameter('strategy', 0) as FilterStrategy;
		const errorWithEmptyResult = this.getNodeParameter('errorWithEmptyResult', 0) as string;

		// Get credentials for NIP-04
		let sk: Uint8Array | undefined;
		let myPubkey: string | undefined;

		if (strategy === 'nip-04') {
			const credentials = await this.getCredentials('nostrobotsApi');
			const { secKey } = credentials;

			if (typeof secKey !== 'string') {
				throw new NodeOperationError(this.getNode(), 'Invalid secret key was provided!');
			}

			if (secKey.startsWith('nsec')) {
				sk = hexToBytes(getHex(secKey, 'nsec'));
			} else {
				sk = hexToBytes(secKey);
			}

			// Calculate public key from secret key
			myPubkey = getPublicKey(sk);
		}

		let events: Event[] = [];

		for (let i = 0; i < items.length; i++) {
			// Get relay input
			const relays = this.getNodeParameter('relay', i) as string;
			let relayArray = relays.split(',');

			let relative: boolean | undefined = undefined;
			let since: number | undefined = undefined;
			let until: number | undefined = undefined;

			if (strategy !== 'eventid') {
				relative = this.getNodeParameter('relative', i) as boolean;

				if (relative) {
					const from = this.getNodeParameter('from', i) as number; // ug.
					const unit = this.getNodeParameter('unit', i) as 'day' | 'hour' | 'minute';

					since = getSince(from, unit);
					until = getUntilNow();
				} else if (relative) {
					since = getUnixtimeFromDateString(this.getNodeParameter('since', i) as string);
					until = getUnixtimeFromDateString(this.getNodeParameter('until', i) as string);
				}
			}

			/**
			 * Update relay
			 */
			let si: ShareableIdentifier | undefined;

			if (strategy === 'eventid') {
				si = getHexEventId(this.getNodeParameter('eventid', i) as string);
				const metaRelay = si.relay;
				relayArray = [...relayArray, ...metaRelay];
			} else if (strategy === 'textSearch') {
				const supportedNIP50relayUrls = [];

				for (let index = 0; index < relayArray.length; index++) {
					const supported = await isSupportNip50(relayArray[index]);
					if (supported) {
						supportedNIP50relayUrls.push(relayArray[index]);
					}
				}

				if (supportedNIP50relayUrls.length < 1) {
					throw new NodeOperationError(
						this.getNode(),
						'Should set least one relay supported NIP-50!',
					);
				}

				relayArray = supportedNIP50relayUrls;
			}

			const strategyInfo = {
				eventid: si?.special,
				[strategy]:
					strategy === 'nip-04' ? myPubkey || '' : (this.getNodeParameter(strategy, i) as string),
			};

			const filter: Filter = buildFilter(strategy, strategyInfo, since, until);

			/**
			 * fetch events
			 */
			const results = await fetchEvents(filter, relayArray);

			events = [...events, ...results];
		}

		/**
		 * Empty guard
		 */
		if (errorWithEmptyResult && events.length <= 0) {
			throw new NodeOperationError(this.getNode(), 'Result is empty!');
		}

		/**
		 * Decrypt NIP-04 messages if needed
		 */
		if (strategy === 'nip-04' && sk) {
			// No need for counterpart parameter - will use each event's sender pubkey

			for (let j = 0; j < events.length; j++) {
				const event = events[j];
				if (event.kind === 4) {
					// Use the event's author (sender) public key for decryption
					const senderPubkey = event.pubkey;
					const decryptedEvent = event as DecryptedEvent;
					try {
						const decryptedContent = await nip04.decrypt(sk, senderPubkey, event.content);
						decryptedEvent.content = decryptedContent;
						decryptedEvent.decrypted = true;
						decryptedEvent.counterpart = senderPubkey;
					} catch (error) {
						decryptedEvent.content = '[Decryption failed]';
						decryptedEvent.decrypted = false;
						decryptedEvent.decryptionError =
							error instanceof Error ? error.message : 'Unknown error';
						decryptedEvent.counterpart = senderPubkey;
					}
				}
			}
		}

		/**
		 * Remove duplicate event.
		 */
		const res: Event[] = [];
		events.forEach((e) => {
			if (-1 === res.findIndex((u) => u.id === e.id)) {
				res.push(e);
			}
		});

		/**
		 * Sort created_at DESC.
		 */
		res.sort((a, b) => b.created_at - a.created_at);

		/**
		 * Map data to n8n data structure
		 */
		return [this.helpers.returnJsonArray(res as Partial<Event>[])];
	}
}
