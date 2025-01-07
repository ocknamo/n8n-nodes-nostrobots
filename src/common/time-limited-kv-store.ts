/**
 * This is a simple Store service that stores IDs with a time limit.
 * Suitable for frequently referenced use cases as expired IDs are removed when referenced.
 */
export class TimeLimitedKvStore<T> {
	// NOTE: The period is unixtime in milliseconds.
	private keyValueMap: Map<string, { value: T; period: number }>;
	constructor() {
		this.keyValueMap = new Map();
	}

	set(key: string, value: T, period: number): void {
		this.keyValueMap.set(key, { value, period });
	}

	has(key: string): boolean {
		this.clearExpierd();
		return this.keyValueMap.has(key);
	}

	count(): number {
		return this.keyValueMap.size;
	}

	values(): {
		value: T;
		period: number;
	}[] {
		return Array.from(this.keyValueMap.values());
	}

	clearExpierd(): void {
		const now = Date.now();

		this.keyValueMap.forEach((v, k, m) => {
			if (v.period < now) {
				m.delete(k);
			}
		});
	}
}
