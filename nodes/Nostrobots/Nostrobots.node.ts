import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { getPublicKey } from 'nostr-tools';
import { defaultRelays } from '../../src/constants/rerays';
import { getSignedEvent } from '../../src/event';
import { oneTimePostToMultiRelay } from '../../src/post';

// polyfills
require('websocket-polyfill');
const bech32 = require('bech32-converting');

export class Nostrobots implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Nostrobots',
		name: 'nostrobots',
		icon: 'file:nostrobots.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Nostr API',
		defaults: {
			name: 'Nostrobots',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nostrobotsApi',
				required: true,
			},
		],
		properties: [
			// Resources and operations will go here
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Event',
						value: 'event',
					},
				],
				default: 'event',
				noDataExpression: true,
				required: true,
				description: 'Create a new note',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a event',
						action: 'Send a event',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['event'],
					},
				},
				default: '',
				placeholder: 'your note.',
				description: 'Note here',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const { secKey } = await this.getCredentials('nostrobotsApi');

		if (typeof secKey !== 'string') {
			throw new NodeOperationError(this.getNode(), 'Invalid secret key was provided!');
		}

		/**
		 * Get secret key and public key.
		 */
		let sk = '';
		let pk = '';
		if (secKey.startsWith('nsec')) {
			// Convert to hex and
			// emit 'Ox' and convert lower case.
			sk = bech32('nsec').toHex(secKey).slice(2).toLowerCase();
			pk = getPublicKey(sk);
		} else {
			sk = secKey;
			pk = getPublicKey(sk);
		}

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			if (resource === 'event') {
				if (operation === 'send') {
					console.log('Start send.');

					// Get note input
					const note = this.getNodeParameter('note', i) as string;

					// Make kind1(note) Event.
					const noteEvent = getSignedEvent(
						{
							kind: 1,
							created_at: Math.floor(Date.now() / 1000),
							tags: [],
							content: note,
							pubkey: pk,
						},
						sk,
					);

					console.log(noteEvent);

					// Post event to relay.
					// TODO: Customize relay lists.
					const result = await oneTimePostToMultiRelay(noteEvent, defaultRelays);

					// Return result.
					returnData.push({ result });
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
