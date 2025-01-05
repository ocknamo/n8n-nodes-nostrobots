import { sleep } from '../test/utils';
import { RateLimitGuard } from './rate-limit-guard';

describe('rate-limit-guard', () => {
	let guard: RateLimitGuard;

	beforeEach(() => {
		const count = 10;
		const period = 2;
		const duration = 5;
		guard = new RateLimitGuard(count, period, duration);
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
				pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
				sig: '566a5f94aed2503249c5644c8c37c9a1690fdb87d1ae50a7a72277e71ab5a5090445138d7ae90303c46b2fb1c52b9c50851dcfc16596c127d3bf77ad6666588d',
				tags: [],
			},
		];

		for (let index = 0; index < 10; index++) {
			expect(guard.canActivate({ ...event, id: `mock_id_${index}` })).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();
	});

	it('should return true when the count is exceeded in period and wait the duration secounds', async () => {
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
			expect(guard.canActivate({ ...event, id: `mock_id_${index}` })).toBeTruthy();
		}

		expect(guard.canActivate(event)).toBeFalsy();

		await sleep(2 * 1000);
		expect(guard.canActivate(event)).toBeFalsy();
		await sleep(3.5 * 1000);
		expect(guard.canActivate(event)).toBeTruthy();
	});
});
