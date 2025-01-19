import { Event } from './type';
import { Relay } from 'nostr-tools';

export type PostResult = { result: string; connection?: Relay };

export async function oneTimePostToMultiRelay(
	event: Event,
	relayUris: string[],
	timeoutMs = 10000,
	connections: (Relay | undefined)[] = [],
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
		/**
		 * set connection
		 */
		relay = new Relay(relayUri);
		relay.connectionTimeout = timeoutMs;

		try {
			await relay.connect();
		} catch (e) {
			console.log(`failed to connect to ${relayUri}`, e);
			if (typeof e === 'string') {
				return { result: `[${e}]: ${relayUri}`, connection: undefined };
			} else {
				return { result: `[failed to connect]: ${relayUri}`, connection: undefined };
			}
		}
	}

	/**
	 * Publish event.
	 */
	relay.publishTimeout = timeoutMs;

	try {
		await relay.publish(event);
		console.log(`${relay.url} has accepted our event`);
	} catch (e) {
		console.log(`failed to publish to ${relayUri}`, e);
		if (typeof e === 'string') {
			return { result: `[${e}]: ${relayUri}`, connection: undefined };
		} else {
			return { result: `[failed]: ${relayUri}`, connection: undefined };
		}
	}

	return { result: `[accepted]: ${relayUri}`, connection: relay };
}
