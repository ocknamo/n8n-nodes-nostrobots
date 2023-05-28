import { SimplePool, Event, Filter } from 'nostr-tools';

export async function fetchEvents(filter: Filter, relays: string[]): Promise<Event[]> {
	const pool = new SimplePool();

	const results = await pool.list(relays, [filter]);

	pool.close(relays);

	return results;
}
