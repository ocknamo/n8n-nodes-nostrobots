import { TimeLimitedKvStore } from './time-limited-kv-store';
import { Event } from 'type';

describe('src/common/time-limited-ly-store.ts', () => {
	let store: TimeLimitedKvStore<Partial<Event>>;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		store = new TimeLimitedKvStore();
	});

	it('should set store', () => {
		store.set('mock_id_1', { id: 'mock_id_1' } as Event, Date.now() + 1000);

		expect(store.has('mock_id_1')).toBeTruthy();
	});

	it('should expierd id is not stored', () => {
		store.set('mock_id_2', { id: 'mock_id_2' } as Event, Date.now() - 1);

		expect(store.has('mock_id_2')).toBeFalsy();
	});

	it('should expierd id is deleted and not are stored', async () => {
		store.set('mock_id_1', { id: 'mock_id_1' } as Event, Date.now() - 1);
		store.set('mock_id_2', { id: 'mock_id_2' } as Event, Date.now() - 10);
		store.set('mock_id_3', { id: 'mock_id_3' } as Event, Date.now() - 100);
		store.set('mock_id_4', { id: 'mock_id_4' } as Event, Date.now() + 1);
		store.set('mock_id_5', { id: 'mock_id_5' } as Event, Date.now() + 1 * 1000);
		store.set('mock_id_6', { id: 'mock_id_6' } as Event, Date.now() + 2 * 1000);
		store.set('mock_id_7', { id: 'mock_id_7' } as Event, Date.now() + 10 * 1000);
		store.set('mock_id_8', { id: 'mock_id_8' } as Event, Date.now() + 100 * 1000);

		jest.advanceTimersByTime(500);

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
