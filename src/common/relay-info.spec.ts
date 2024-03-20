import { convertWssToHttps, fetchRelayInfo } from './relay-info';

describe('convertWssToHttps', () => {
	it('should fetch relay info', async () => {
		jest.spyOn(global, 'fetch').mockImplementation((arg) =>
			Promise.resolve({
				json: () => Promise.resolve({ arg }),
			} as any),
		);
		const info = (await fetchRelayInfo('wss://relay.damus.io')) as unknown as { arg: Request };
		const arg = info.arg;

		expect(fetch).toHaveBeenCalled();
		expect(arg.url).toBe('https://relay.damus.io/');
		expect(arg.method).toBe('GET');
		expect(arg.headers.has('Accept')).toBe(true);
		expect(arg.headers.get('Accept')).toBe('application/nostr+json');
	});

	it('should convert to https url from wss url', () => {
		expect(convertWssToHttps('wss://relay.damus.io')).toBe('https://relay.damus.io');
	});
});
