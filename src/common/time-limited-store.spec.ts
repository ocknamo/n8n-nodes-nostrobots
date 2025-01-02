import { sleep } from '../test/utils';
import { TimeLimitedStore } from './time-limited-store';

describe('src/common/time-limited-store.ts', () => {
	let store: TimeLimitedStore;
	beforeEach(() => {
		store = new TimeLimitedStore();
	});

	it('should set store', () => {
		store.set('mock_id_1', Date.now());

		expect(store.has('mock_id_1')).toBeTruthy();
	});

	it('should expierd id is not stored', () => {
		store.set('mock_id_2', Date.now() - 1);

		expect(store.has('mock_id_2')).toBeFalsy();
	});

	it('should expierd id is deleted and not are stored', async () => {
		store.set('mock_id_1', Date.now() - 1);
		store.set('mock_id_2', Date.now() - 10);
		store.set('mock_id_3', Date.now() - 100);
		store.set('mock_id_4', Date.now() + 1);
		store.set('mock_id_5', Date.now() + 1 * 1000);
		store.set('mock_id_6', Date.now() + 2 * 1000);
		store.set('mock_id_7', Date.now() + 10 * 1000);
		store.set('mock_id_8', Date.now() + 100 * 1000);

		await sleep(500);

		expect(store.has('mock_id_1')).toBeFalsy();
		expect(store.has('mock_id_2')).toBeFalsy();
		expect(store.has('mock_id_3')).toBeFalsy();
		expect(store.has('mock_id_4')).toBeFalsy();
		expect(store.has('mock_id_5')).toBeTruthy();
		expect(store.has('mock_id_6')).toBeTruthy();
		expect(store.has('mock_id_7')).toBeTruthy();
		expect(store.has('mock_id_8')).toBeTruthy();
	});
});
