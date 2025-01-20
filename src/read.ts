import { Filter, Event } from 'nostr-tools';

// Timeout(millisecond).
const EVENT_FETACH_TIMEOUT = 30000;

export async function fetchEvents(filter: Filter, relays: string[]): Promise<Event[]> {
	const SimplePool = (await import('nostr-tools')).SimplePool;
	const pool = new SimplePool();

	const results = await pool.querySync(relays, filter, { maxWait: EVENT_FETACH_TIMEOUT });
	pool.close(relays);

	return results;
}
