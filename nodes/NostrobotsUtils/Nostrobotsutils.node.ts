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
						name: 'ConvertEvent',
						value: 'convertEvent',
					},
					{
						name: 'Transform',
						value: 'transform',
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
						convertOutput: ['naddr', 'nevent'],
					},
				},
				default: defaultRelays.join(','),
				placeholder: 'wss://relay.damus.io,wss://nostr.wine',
				description: 'Relay address joined with ","',
			},
			// For transform
			{
				displayName: 'TransformOutput',
				name: 'transformOutput',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['transform'],
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
						operation: ['transform'],
					},
				},
				default: '',
				placeholder: 'npub...',
				description: 'Set input value',
			},
			// Hints
			{
				displayName: 'Select input value from Nsec or Hexpubkey or Hexseckey',
				name: 'Npubnotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						transformOutput: ['npub'],
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
						transformOutput: ['nsec'],
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
						transformOutput: ['hexpubkey'],
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
						transformOutput: ['hexseckey'],
					},
				},
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const operation = this.getNodeParameter('operation', 0) as string;

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
		} else if (operation === 'transform') {
			// TODO: 実装
			// const output = this.getNodeParameter('transformOutput', 0) as string;
		} else {
			throw new NodeOperationError(this.getNode(), 'Invalid operation.');
		}

		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
