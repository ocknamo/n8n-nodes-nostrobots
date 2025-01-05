import { Event } from 'nostr-tools';
import { TimeLimitedKvStore } from '../common/time-limited-kv-store';

export class RateLimitGuard {
	private store: TimeLimitedKvStore;
	private limitedAll = false;
	constructor(
		private readonly count: number,
		private readonly period: number,
		private readonly duration: number,
	) {
		this.store = new TimeLimitedKvStore();

		setInterval(() => {
			this.store.clearExpierdId();
		}, Math.floor((this.period * 1000) / 10));
	}

	canActivate(event: Event): boolean {
		if (this.limitedAll) {
			return false;
		}

		this.store.set(event.id, Date.now() + this.period * 1000);
		if (this.store.count(event.id) > this.count) {
			this.durationHandling();

			return false;
		}

		return true;
	}

	durationHandling(): void {
		this.limitedAll = true;
		setTimeout(() => {
			this.store.clearExpierdId();
			this.limitedAll = false;
		}, this.duration);
	}
}
