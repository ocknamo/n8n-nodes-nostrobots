import { Event } from 'nostr-tools';
import { TimeLimitedKvStore } from '../common/time-limited-kv-store';

export class RateLimitGuard {
	private store: TimeLimitedKvStore<Partial<Event>>;
	private limitedAll = false;
	private limitedPubkeysStore: TimeLimitedKvStore<number>;

	private timerIds: any[] = [];

	constructor(
		private readonly countForAll: number,
		private readonly countForOne: number,
		private readonly period: number,
		private readonly duration: number,
	) {
		this.store = new TimeLimitedKvStore();
		this.limitedPubkeysStore = new TimeLimitedKvStore();

		const intervalId = setInterval(() => {
			this.store.clearExpierd();
			this.limitedPubkeysStore.clearExpierd();
		}, Math.floor((this.period * 1000) / 10));

		this.timerIds.push(intervalId);
	}

	canActivate(event: Event): boolean {
		if (this.limitedAll) {
			return false;
		}

		if (this.limitedPubkeysStore.count() !== 0 && this.limitedPubkeysStore.has(event.pubkey)) {
			return false;
		}

		this.store.set(event.id, event, Date.now() + this.period * 1000);

		if (this.store.count() > this.countForAll) {
			this.limitedAll = true;
			this.durationHandling();

			return false;
		}

		const count = this.store.values().filter((v) => v.value.pubkey === event.pubkey).length;

		if (count > this.countForOne) {
			this.limitedPubkeysStore.set(event.pubkey, 1, this.duration * 1000);

			this.durationHandling();

			return false;
		}

		return true;
	}

	durationHandling(): void {
		const timeoutId = setTimeout(() => {
			this.store.clearExpierd();
			this.limitedPubkeysStore.clearExpierd();
			this.limitedAll = false;
		}, this.duration * 1000);
		this.timerIds.push(timeoutId);
	}

	dispose(): void {
		this.timerIds.forEach((id) => {
			clearInterval(id);
		});
	}
}
