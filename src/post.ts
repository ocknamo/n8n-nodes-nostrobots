import { Event, relayInit } from 'nostr-tools';

type PostResult = string;

export async function oneTimePostToMultiRelay(
	event: Event,
	relayUris: string[],
	timeoutMs = 10000,
): Promise<PostResult[]> {
	const promises: Promise<PostResult>[] = [];
	relayUris.forEach((uri) => {
		promises.push(oneTimePost(event, uri, timeoutMs));
	});

	return Promise.all(promises);
}

export async function oneTimePost(
	event: Event,
	relayUri: string,
	timeoutMs = 10000,
): Promise<PostResult> {
	const relay = relayInit(relayUri);
	relay.on('connect', () => {
		console.log(`connected to ${relay.url}`);
	});
	relay.on('error', () => {
		console.log(`failed to connect to ${relay.url}`);
	});

	await relay.connect();

	/**
	 * Initial value.
	 */
	let result: PostResult = `[init]: ${relay.url}`;

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

	relay.close();

	return result;
}
