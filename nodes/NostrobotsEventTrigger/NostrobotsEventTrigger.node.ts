import {
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeOperationError,
	sleep,
} from 'n8n-workflow';
import { Event, Filter, matchFilter, SimplePool, verifyEvent } from 'nostr-tools';
import ws from 'ws';
import { buildFilter, FilterStrategy } from '../../src/common/filter';
import { getSecFromMsec } from '../../src/convert/time';
import { TimeLimitedKvStore } from '../../src/common/time-limited-kv-store';
import { blackListGuard } from '../../src/guards/black-list-guard';
import { whiteListGuard } from '../../src/guards/white-list-guard';
import { RateLimitGuard } from '../../src/guards/rate-limit-guard';
import { type SubscribeManyParams } from 'nostr-tools/lib/types/pool';
import { log } from '../../src/common/log';

// polyfills
(global as any).WebSocket = ws;

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
				displayName: 'Kind',
				name: 'kind',
				type: 'number',
				default: 1,
				placeholder: '1',
				noDataExpression: true,
				required: true,
				displayOptions: {
					show: {
						strategy: ['mention'],
					},
				},
				description: 'Kind number of target Event. Usually set to 1.',
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
		let closeFunctionWasCalled = false;
		let pool = new SimplePool();

		// Common params
		const strategy = this.getNodeParameter('strategy', 0) as string;
		const relay1 = this.getNodeParameter('relay1', 0) as string;
		const relay2 = this.getNodeParameter('relay2', 0) as string;

		// For mention params
		const publickey = this.getNodeParameter('publickey', 0) as string;
		const kindNum = this.getNodeParameter('kind', 0) as number;

		const ratelimitingCountForAll = this.getNodeParameter('ratelimitingCountForAll', 0) as number;
		const ratelimitingCountForOne = this.getNodeParameter('ratelimitingCountForOne', 0) as number;
		const period = this.getNodeParameter('period', 0) as number;
		const duration = this.getNodeParameter('duration', 0) as number;
		const blackListString = this.getNodeParameter('blackList', 0) as string;
		const blackList = blackListString ? blackListString.split(',') : [];
		const whiteListString = this.getNodeParameter('whiteList', 0) as string;
		const whiteList = whiteListString ? whiteListString.split(',') : [];

		if (strategy !== 'mention') {
			throw new NodeOperationError(this.getNode(), 'Invalid strategy.');
		}

		const relays = relay2 ? [relay1, relay2] : [relay1];
		let filter = buildFilter(
			strategy as FilterStrategy,
			{ mention: publickey },
			getSecFromMsec(Date.now()),
			undefined,
			[kindNum],
		);

		const eventIdStore = new TimeLimitedKvStore<number>();
		const oneMin = 1 * 60 * 1000;
		const fiveMin = 5 * oneMin;
		const tenMin = 10 * oneMin;

		const rateGuard = new RateLimitGuard(
			ratelimitingCountForAll,
			ratelimitingCountForOne,
			period,
			duration,
		);

		let recconctionCount = 0;

		const subscribeParams = {
			onevent: (event: Event) => {
				if (!matchFilter(filter, event)) {
					return;
				}

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

				// verify event
				if (!verifyEvent(event)) {
					return;
				}

				this.emit([this.helpers.returnJsonArray(event as Record<string, any>)]);
				eventIdStore.set(event.id, 1, Date.now() + fiveMin);
			},
			onclose: async (reasons: string[]) => {
				log('closed: ', reasons);
				if (closeFunctionWasCalled) {
					return;
				}

				const selfClosedReason = 'relay connection closed by us';

				if (reasons.every((r) => r === selfClosedReason)) {
					return;
				}

				if (recconctionCount > 10) {
					throw new NodeOperationError(this.getNode(), 'Ralay closed frequency.');
				}

				log('try reconnection');

				pool.destroy();

				await sleep((recconctionCount + 1) ** 2 * 1000);
				recconctionCount++;

				filter = buildFilter(
					FilterStrategy.mention,
					{ mention: publickey },
					// Events before five min are checked duplicate.
					getSecFromMsec(Date.now() - oneMin),
				);
				subscribeEvents(pool, filter, relays, subscribeParams);
			},
		};

		subscribeEvents(pool, filter, relays, subscribeParams);

		// Health check (per 10min)
		const healthCheckInterval = setInterval(async () => {
			if (closeFunctionWasCalled) {
				return;
			}

			const status = await new Promise<boolean>((resolve) => {
				// timeout
				sleep(10000).then(() => resolve(false));
				pool.subscribeMany(relays, [{ limit: 1 }], {
					maxWait: 10,
					onevent: () => resolve(true),
					onclose: () => resolve(false),
				});
			});
			if (!status) {
				log('All relays are not healthy. Try reconnection');
				pool.destroy();

				filter = buildFilter(
					strategy as FilterStrategy,
					{ mention: publickey },
					getSecFromMsec(Date.now() - oneMin),
				);
				subscribeEvents(pool, filter, relays, subscribeParams);
			} else {
				// reset
				recconctionCount = 0;
			}
		}, tenMin);

		const closeFunction = async () => {
			closeFunctionWasCalled = true;
			clearInterval(healthCheckInterval);
			pool.destroy();
		};

		return { closeFunction };
	}
}

function subscribeEvents(
	pool: SimplePool,
	filter: Filter,
	relays: string[],
	subscribeParams: SubscribeManyParams,
): void {
	pool.subscribeMany(relays, [filter], subscribeParams);
}
