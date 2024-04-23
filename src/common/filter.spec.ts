import * as getHex from '../convert/get-hex';
import { FilterStrategy, buildFilter } from './filter';

describe('filter.ts', () => {
	describe('buildFilter', () => {
		it('should build eventid filter.', () => {
			jest.spyOn(getHex, 'getHexEventId').mockReturnValueOnce({ special: '1234567890', relay: [] });
			const info = { eventid: 'neventxxxxxxxxxxxxxxxxxxxxxxx' };

			expect(buildFilter(FilterStrategy.eventid, info, 10000, 90000)).toEqual({
				ids: ['1234567890'],
				limit: 1,
			});

			expect(getHex.getHexEventId).toHaveBeenCalledWith(info.eventid);
		});

		it('should build hashtag filter.', () => {
			const info = { hashtag: '#hashtag' };

			expect(buildFilter(FilterStrategy.hashtag, info, 10000, 90000)).toEqual({
				kinds: [1],
				'#t': ['hashtag'],
				since: 10000,
				until: 90000,
			});
		});

		it('should build mention filter.', () => {
			jest.spyOn(getHex, 'getHexPubKey').mockReturnValueOnce('12345678901234567890');
			const info = { mention: 'npubyyyyyyyyyyyyyyyyyyyy' };

			expect(buildFilter(FilterStrategy.mention, info, 10000, 90000)).toEqual({
				kinds: [1],
				'#p': ['12345678901234567890'],
				since: 10000,
				until: 90000,
			});

			expect(getHex.getHexPubKey).toHaveBeenCalledWith(info.mention);
		});

		it('should build raw filter.', () => {
			const info = { rawFilter: '{ "kinds": [1],  "#t": ["foodstr"]}' };

			expect(buildFilter(FilterStrategy.rawFilter, info, 10000, 90000)).toEqual({
				kinds: [1],
				'#t': ['foodstr'],
				since: 10000,
				until: 90000,
			});
		});

		it('should build text filter.', () => {
			const info = { textSearch: 'search text' };

			expect(buildFilter(FilterStrategy.textSearch, info, 10000, 90000)).toEqual({
				kinds: [1],
				search: 'search text',
				since: 10000,
				until: 90000,
			});
		});

		it('should build pubkey filter.', () => {
			jest.spyOn(getHex, 'getHexPubKey').mockReturnValueOnce('12345678901234567890');
			const info = { pubkey: 'npubzzzzzzzzzzzzzzzzzzzzz' };

			expect(buildFilter(FilterStrategy.pubkey, info, 10000, 90000)).toEqual({
				kinds: [1],
				authors: ['12345678901234567890'],
				since: 10000,
				until: 90000,
			});

			expect(getHex.getHexPubKey).toHaveBeenCalledWith(info.pubkey);
		});

		it('should thorw error with invalid strategy info.', () => {
			const info = { invalid: 'search text' };

			try {
				expect(buildFilter(FilterStrategy.textSearch, info as any, 10000, 90000));
				throw new Error('Should not reach here.');
			} catch (error) {
				expect(error.message).toBe('No data');
			}
		});
	});
});
