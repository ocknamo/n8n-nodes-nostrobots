import { getSecFromMsec, getSince, getUnixtimeFromDateString } from './time';

describe('unixtime', () => {
	describe('getSecFromMsec', () => {
		it('should get unixtime by seconds unit from millisecond.', () => {
			expect(getSecFromMsec(1684169760352)).toBe(1684169760);
		});
	});

	describe('getUnixtimeFromDateString', () => {
		it('should get unixtime from date string.', () => {
			expect(getUnixtimeFromDateString('2023-05-15T17:08:34.339Z')).toBe(1684170514);
		});
	});
});

describe('relative', () => {
	describe('getSinceUntil', () => {
		it('should get since until from unit and from value', () => {
			const now = 1690552956;
			expect(getSince(1, 'day', now)).toBe(1690466556);
			expect(getSince(3, 'day', now)).toBe(1690293756);
			expect(getSince(30, 'day', now)).toBe(1687960956);
			expect(getSince(1, 'hour', now)).toBe(1690549356);
			expect(getSince(3, 'hour', now)).toBe(1690542156);
			expect(getSince(24, 'hour', now)).toBe(1690466556);
			expect(getSince(1, 'minute', now)).toBe(1690552896);
			expect(getSince(20, 'minute', now)).toBe(1690551756);
			expect(getSince(60, 'minute', now)).toBe(1690549356);
		});
	});
});
