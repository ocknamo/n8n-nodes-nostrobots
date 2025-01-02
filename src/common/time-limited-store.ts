/**
 * This is a simple Store service that stores IDs with a time limit.
 * Suitable for frequently referenced use cases as expired IDs are removed when referenced.
 */
export class TimeLimitedStore {
	// NOTE: The period is unixtime in milliseconds.
	private idPeriodMap: Map<string, number>;
	private idSet: Set<string>;
	constructor() {
		this.idPeriodMap = new Map();
		this.idSet = new Set();
	}

	set(id: string, period: number): void {
		this.idSet.add(id);
		this.idPeriodMap.set(id, period);
	}

	has(id: string): boolean {
		this.clearExpierdId();
		return this.idSet.has(id);
	}

	count(id: string): number {
		return this.idPeriodMap.size;
	}

	clearExpierdId(): void {
		const now = Date.now();

		this.idPeriodMap.forEach((v, k, m) => {
			if (v < now) {
				m.delete(k);
				this.idSet.delete(k);
			}
		});
	}
}
