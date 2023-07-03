import { getSecFromMsec, getUnixtimeFromDateString } from './time';

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
