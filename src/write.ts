import { Event, Relay, relayInit } from 'nostr-tools';

export type PostResult = { result: string; connection: Relay };

export async function oneTimePostToMultiRelay(
	event: Event,
	relayUris: string[],
	timeoutMs = 10000,
	connections: Relay[] = [],
): Promise<PostResult[]> {
	const promises: Promise<PostResult>[] = [];
	relayUris.forEach((uri, i) => {
		promises.push(oneTimePost(event, uri, timeoutMs, connections[i]));
	});

	return Promise.all(promises);
}

export async function oneTimePost(
	event: Event,
	relayUri: string,
	timeoutMs = 10000,
	connection?: Relay,
): Promise<PostResult> {
	let relay: Relay;
	if (connection) {
		relay = connection;
	} else {
		relay = relayInit(relayUri);
		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`);
		});
		relay.on('error', () => {
			console.log(`failed to connect to ${relay.url}`);
		});

		await relay.connect();
	}

	/**
	 * Initial value.
	 */
	let result: string = `[init]: ${relay.url}`;

	/**
	 * Publish event.
	 */
	let pub = relay.publish(event);
	let timeout: NodeJS.Timeout | null = null;
	const promise: Promise<string> = new Promise((resolve, reject) => {
		pub.on('ok', () => {
			console.log(`${relay.url} has accepted our event`);
			resolve(`[accepted]: ${relay.url}`);
		});
		pub.on('failed', (reason: any) => {
			console.warn(`failed to publish to ${relay.url}: ${reason}`);
			reject(`[failed]: ${relay.url}`);
		});

		timeout = setTimeout(() => {
			reject(`[timeout]: ${relay.url}`);
		}, timeoutMs);
	});

	/**
	 * Get result.
	 */
	await promise.then((r) => (result = r)).catch((r) => (result = r));

	if (!!timeout) {
		clearTimeout(timeout);
	}

	return { result, connection: relay };
}
