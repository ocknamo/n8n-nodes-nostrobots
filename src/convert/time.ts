export function getSecFromMsec(millisec: number): number {
	return Math.floor(millisec / 1000);
}

export function getUnixtimeFromDateString(dateString: string) {
	return getSecFromMsec(new Date(dateString).getTime());
}
