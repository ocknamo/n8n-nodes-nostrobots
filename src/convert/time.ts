export function getSecFromMsec(millisec: number): number {
	return Math.floor(millisec / 1000);
}

export function getUnixtimeFromDateString(dateString: string) {
	return getSecFromMsec(new Date(dateString).getTime());
}

export function getSince(
	from: number,
	unit: 'day' | 'hour' | 'minute',
	now = Math.floor(Date.now() / 1000),
): number {
	enum Unit {
		day = 60 * 60 * 24,
		hour = 60 * 60,
		minute = 60,
	}

	return now - from * Unit[unit];
}

export function getUntilNow() {
	const futureBuffer = 10;

	return Math.floor(Date.now() / 1000) + futureBuffer;
}
