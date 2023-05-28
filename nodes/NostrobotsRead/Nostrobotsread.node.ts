import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { defaultRelays } from '../../src/constants/rerays';
import { getHexPubKey } from '../../src/convert/get-hex-pubkey';
import { getUnixtimeFromDateString } from '../../src/convert/time';
import { fetchEvents } from '../../src/read';
import { Event, Filter } from 'nostr-tools';

// polyfills
require('websocket-polyfill');

export class Nostrobotsread implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Nostrobotsread',
		name: 'nostrobotsread',
		icon: 'file:nostrobotsread.svg',
		group: ['transform'],
		version: 1,
		description: 'Read from Nostr relay',
		defaults: {
			name: 'NostrobotsRead',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Resources and operations will go here
			{
				displayName: 'Strategy',
				name: 'strategy',
				type: 'options',
				options: [
					{
						name: 'UserPublickey',
						value: 'pubkey',
					},
					// TODO
					// {
					// 	name: 'KeyWord',
					// 	value: 'word',
					// },
					// {
					// 	name: 'Mention',
					// 	value: 'mention',
					// },
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
				description: 'Note here',
			},
			// common option
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				required: true,
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'dateTime',
				default: '',
				required: true,
			},
			// relays
			{
				displayName: 'Custom Relay',
				name: 'relay',
				type: 'string',
				default: defaultRelays.join(','),
				placeholder: 'wss://relay.damus.io,wss://nostr.wine',
				description: 'Relay address joined with ","',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		/**
		 * Handle data coming from previous nodes
		 */
		const items = this.getInputData();
		const strategy = this.getNodeParameter('strategy', 0) as string;

		let events: Event[] = [];

		for (let i = 0; i < items.length; i++) {
			const pubkey = getHexPubKey(this.getNodeParameter('pubkey', i) as string);
			const since = this.getNodeParameter('since', i) as string; // ug. 2023-04-30T15:00:00.000Z
			const until = this.getNodeParameter('until', i) as string; // ug. 2023-04-30T15:00:00.000Z

			// Get relay input
			const relays = this.getNodeParameter('relay', i) as string;
			const relayArray = relays.split(',');

			let filter: Filter = {};
			if (strategy === 'pubkey') {
				filter = {
					kinds: [1],
					authors: [pubkey],
					since: getUnixtimeFromDateString(since),
					until: getUnixtimeFromDateString(until),
				};
			} else {
				throw new NodeOperationError(this.getNode(), 'Invalid strategy was provided!');
			}

			/**
			 * fetch events
			 */
			const results = await fetchEvents(filter, relayArray);

			events = [...events, ...results];
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
		return [this.helpers.returnJsonArray(res)];
	}
}
