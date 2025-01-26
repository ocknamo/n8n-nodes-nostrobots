export function log(message: string, info?: any): void {
	if (info) {
		console.log(`${new Date().toISOString()}: ${message}`, info);
	} else {
		console.log(`${new Date().toISOString()}: ${message}`);
	}
}
