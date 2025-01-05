import { Event } from 'nostr-tools';
import { TimeLimitedKvStore } from '../common/time-limited-kv-store';

export class RateLimitGuard {
	private store: TimeLimitedKvStore;
	private limitedAll = false;
	private limitedPubkeys: string[] = [];

	private timerIds: any[] = [];

	constructor(
		private readonly countForAll: number,
		private readonly countForOne: number,
		private readonly period: number,
		private readonly duration: number,
	) {
		this.store = new TimeLimitedKvStore();

		const intervalId = setInterval(() => {
			this.store.clearExpierdId();
		}, Math.floor((this.period * 1000) / 10));

		this.timerIds.push(intervalId);
	}

	canActivate(event: Event): boolean {
		if (this.limitedAll) {
			return false;
		}

		if (this.limitedPubkeys.length !== 0 && this.limitedPubkeys.find((p) => p === event.pubkey)) {
			return false;
		}

		this.store.set(event, Date.now() + this.period * 1000);

		if (this.store.count() > this.countForAll) {
			this.durationHandling();

			return false;
		}

		console.log(this.countForOne);

		return true;
	}

	durationHandling(): void {
		this.limitedAll = true;
		const timeoutId = setTimeout(() => {
			this.store.clearExpierdId();
			this.limitedAll = false;
		}, this.duration);
		this.timerIds.push(timeoutId);
	}

	dispose(): void {
		this.timerIds.forEach((id) => {
			clearInterval(id);
		});
	}
}
