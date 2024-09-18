import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { Event, nip19 } from 'nostr-tools';
import { defaultRelays } from '../../src/constants/rerays';

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
		properties: [
			// Resources and operations will go here
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Convert',
						value: 'convert',
					},
				],
				default: 'convert',
				noDataExpression: true,
				required: true,
				description: 'Utility type',
			},
			{
				displayName: 'Output',
				name: 'output',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['convert'],
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
						output: ['naddr', 'nevent'],
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
						output: ['naddr', 'nevent'],
					},
				},
				default: defaultRelays.join(','),
				placeholder: 'wss://relay.damus.io,wss://nostr.wine',
				description: 'Relay address joined with ","',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const output = this.getNodeParameter('output', 0) as string;

		if (operation !== 'convert') {
			throw new NodeOperationError(this.getNode(), 'Invalid convert.');
		}

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
						throw new NodeOperationError(this.getNode(), 'Invalid Event json value with no d tag.');
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

		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
