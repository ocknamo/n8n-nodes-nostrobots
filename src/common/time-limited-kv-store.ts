import { Event } from 'nostr-tools';

/**
 * This is a simple Store service that stores IDs with a time limit.
 * Suitable for frequently referenced use cases as expired IDs are removed when referenced.
 */
export class TimeLimitedKvStore {
	// NOTE: The period is unixtime in milliseconds.
	// private idPeriodMap: Map<string, number>;
	private idEventMap: Map<string, Partial<Event> & { period: number }>;
	constructor() {
		// this.idPeriodMap = new Map();
		this.idEventMap = new Map();
	}

	set(event: Event, period: number): void {
		this.idEventMap.set(event.id, { ...event, period });
	}

	has(id: string): boolean {
		this.clearExpierdId();
		return this.idEventMap.has(id);
	}

	count(): number {
		return this.idEventMap.size;
	}

	clearExpierdId(): void {
		const now = Date.now();

		this.idEventMap.forEach((v, k, m) => {
			if (v.period < now) {
				m.delete(k);
			}
		});
	}
}
