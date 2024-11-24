import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeOperationError,
} from 'n8n-workflow';
import { SimplePool } from 'nostr-tools';
import { buildFilter, FilterStrategy } from '../../src/common/filter';
import { getSecFromMsec } from '../../src/convert/time';
import { TimeLimitedKvStore } from '../../src/common/time-limited-kv-store';
import { blackListGuard } from '../../src/guards/black-list-guard';
import { whiteListGuard } from '../../src/guards/white-list-guard';
import { RateLimitGuard } from '../../src/guards/rate-limit-guard';

export class NostrobotsEventTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nostr Trigger',
		name: 'nostrobotsEventTrigger',
		icon: 'file:nostrobotseventtrigger.svg',
		group: ['trigger'],
		version: 1,
		description: '[BETA]Nostr Trigger. This is an experimental feature',
		eventTriggerDescription: '',
		activationMessage: 'test',
		defaults: {
			name: '[BETA]Nostr Trigger',
		},
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Strategy',
				name: 'strategy',
				type: 'options',
				options: [
					{
						name: 'Mention',
						value: 'mention',
					},
				],
				default: 'mention',
				noDataExpression: true,
				required: true,
				description: 'Trigger strategy',
			},
			{
				displayName: 'PublicKey',
				name: 'publickey',
				type: 'string',
				default: '',
				placeholder: 'npub1...',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						strategy: ['mention'],
					},
				},
				description: 'Public key of target of mention. npub or HEX.',
			},
			{
				displayName: 'Relay1',
				name: 'relay1',
				type: 'string',
				default: '',
				placeholder: 'wss://...',
				noDataExpression: true,
				required: true,
				description: 'Target relay 1',
			},
			{
				displayName: 'Relay2',
				name: 'relay2',
				type: 'string',
				noDataExpression: true,
				default: '',
				placeholder: 'wss://...',
				description: 'Target relay 2(optional)',
			},
			{
				displayName: 'RatelimitingCountForAll',
				name: 'ratelimitingCountForAll',
				type: 'number',
				noDataExpression: true,
				required: true,
				default: 60,
				placeholder: '60',
				description: 'Count of rate-limited requests for all requests',
			},
			{
				displayName: 'RatelimitingCountForOne',
				name: 'ratelimitingCountForOne',
				type: 'number',
				required: true,
				noDataExpression: true,
				default: 10,
				placeholder: '10',
				description: 'Count of rate-limited requests for a user identified by npub',
			},
			{
				displayName: 'PeriodSeconds',
				name: 'period',
				type: 'number',
				required: true,
				noDataExpression: true,
				default: 60,
				placeholder: '60',
				description: 'Seconds',
			},
			{
				displayName: 'DurationSeconds',
				name: 'duration',
				type: 'number',
				required: true,
				noDataExpression: true,
				default: 180,
				placeholder: '180',
				description: 'Count of rate-limited requests for a user identified by npub',
			},
			{
				displayName: 'BlackList',
				name: 'blackList',
				type: 'string',
				noDataExpression: true,
				default: '',
				placeholder: 'npub1...,npub2...',
				description: 'Black lists by npub',
			},
			{
				displayName: 'WhiteList',
				name: 'whiteList',
				type: 'string',
				noDataExpression: true,
				default: '',
				placeholder: 'npub1...,npub2...',
				description: 'White lists by npub',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const strategy = this.getNodeParameter('strategy', 0) as string;
		const relay1 = this.getNodeParameter('relay1', 0) as string;
		const relay2 = this.getNodeParameter('relay2', 0) as string;
		const publickey = this.getNodeParameter('publickey', 0) as string;

		const ratelimitingCountForAll = this.getNodeParameter('ratelimitingCountForAll', 0) as number;
		const ratelimitingCountForOne = this.getNodeParameter('ratelimitingCountForOne', 0) as number;
		const period = this.getNodeParameter('period', 0) as number;
		const duration = this.getNodeParameter('duration', 0) as number;
		const blackList = (this.getNodeParameter('blackList', 0) as string).split(',');
		const whiteList = (this.getNodeParameter('whiteList', 0) as string).split(',');

		if (strategy !== 'mention') {
			throw new NodeOperationError(this.getNode(), 'Invalid strategy.');
		}

		const pool = new SimplePool();

		const relays = [relay1, relay2];
		const filter = buildFilter(
			FilterStrategy.mention,
			{ mention: publickey },
			getSecFromMsec(Date.now()),
		);

		const eventIdStore = new TimeLimitedKvStore<number>();
		const oneMin = 1 * 60 * 1000;

		const rateGuard = new RateLimitGuard(
			ratelimitingCountForAll,
			ratelimitingCountForOne,
			period,
			duration,
		);

		pool.sub(relays, [filter]).on('event', (event) => {
			if (!blackListGuard(event, blackList)) {
				return;
			}

			if (!whiteListGuard(event, whiteList)) {
				return;
			}

			// duplicate check
			if (eventIdStore.has(event.id)) {
				return;
			}

			// rate limit guard
			if (!rateGuard.canActivate(event)) {
				return;
			}

			this.emit([this.helpers.returnJsonArray(event)]);
			eventIdStore.set(event.id, 1, Date.now() + oneMin);
		});

		// TODO: pool reconnection when closed connection.
		return {};
	}
}
