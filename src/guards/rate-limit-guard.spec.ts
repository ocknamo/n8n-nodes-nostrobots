import { RateLimitGuard } from './rate-limit-guard';

describe('rate-limit-guard', () => {
	let guard: RateLimitGuard;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		const countForAll = 10;
		const countForOne = 5;
		const period = 4;
		const duration = 8;
		guard = new RateLimitGuard(countForAll, countForOne, period, duration);
	});

	afterEach(() => {
		guard.dispose();
	});

	it('should return true with first event', () => {
		const event: any = [
			{
				content: 'test',
				created_at: 1735829387,
				id: '4d1127d92bb3986cbae70f82217ec47d11348fd3bde731959fa2e445be1bf44e',
				kind: 1,
				pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		expect(guard.canActivate(event)).toBeTruthy();
	});

	it('should return false when the count is exceeded in period', () => {
		const event: any = [
			{
				content: 'test',
				created_at: 1735829387,
				id: 'mock_id',
				kind: 1,
				pubkey: 'mock_pubkey',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		for (let index = 0; index < 10; index++) {
			expect(
				guard.canActivate({ ...event, id: `mock_id_${index}`, pubkey: `mock_pubkey_${index}` }),
			).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();
	});

	it('should return true when the count of all events is exceeded in period and wait the duration secounds', () => {
		const event: any = [
			{
				content: 'test',
				created_at: 1735829387,
				id: 'mock_id',
				kind: 1,
				pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		for (let index = 0; index < 10; index++) {
			expect(
				guard.canActivate({ ...event, id: `mock_id_${index}`, pubkey: `mock_pubkey_${index}` }),
			).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();
		jest.advanceTimersByTime(3 * 1000);
		expect(guard.canActivate(event)).toBeFalsy();
		jest.advanceTimersByTime(6 * 1000);
		expect(guard.canActivate(event)).toBeTruthy();
	});

	it('should return false when the count of same pubkey events is exceeded in period and wait the duration secounds', () => {
		const event: any = [
			{
				content: 'test',
				created_at: 1735829387,
				id: 'mock_id',
				kind: 1,
				pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		for (let index = 0; index < 5; index++) {
			expect(guard.canActivate({ ...event, id: `mock_id_${index}` })).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();
		expect(guard.canActivate({ ...event, pubkey: 'other_pub_key' })).toBeTruthy();
	});

	it('should return true when the count of same pubkey events is exceeded in period', () => {
		const event: any = [
			{
				content: 'test',
				created_at: 1735829387,
				id: 'mock_id',
				kind: 1,
				pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		for (let index = 0; index < 5; index++) {
			expect(guard.canActivate({ ...event, id: `mock_id_${index}` })).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();
		jest.advanceTimersByTime(3 * 1000);
		expect(guard.canActivate(event)).toBeFalsy();
		jest.advanceTimersByTime(6 * 1000);
		expect(guard.canActivate(event)).toBeTruthy();
	});
});
