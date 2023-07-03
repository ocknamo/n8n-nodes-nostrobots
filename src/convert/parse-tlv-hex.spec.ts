import { formatShareableIdentifier, getShareableIdentifier, parseTlvHex } from './parse-tlv-hex';

describe('parde-tlv-hex', () => {
	/**
	 * NIP-19
	 * Test sample data
	 * https://github.com/nostr-protocol/nips/blob/master/19.md#examples
	 */
	describe('parseTlvHex', () => {
		it('should decode into a profile', () => {
			const hex =
				'00203bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d010d7773733a2f2f722e782e636f6d01157773733a2f2f646a6261732e7361646b622e636f6d';

			expect(parseTlvHex(hex)).toEqual([
				['special', '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d'],
				['relay', 'wss://r.x.com'],
				['relay', 'wss://djbas.sadkb.com'],
			]);
		});
	});

	describe('formatShareableIdentifier', () => {
		it('should format into a ShareableIdentifier', () => {
			expect(
				formatShareableIdentifier([
					['special', '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d'],
					['relay', 'wss://r.x.com'],
					['relay', 'wss://djbas.sadkb.com'],
				]),
			).toEqual({
				special: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
				relay: ['wss://r.x.com', 'wss://djbas.sadkb.com'],
			});
		});
	});

	describe('getShareableIdentifier', () => {
		it('should format into a ShareableIdentifier from hex', () => {
			const hex =
				'00203bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d010d7773733a2f2f722e782e636f6d01157773733a2f2f646a6261732e7361646b622e636f6d';

			expect(getShareableIdentifier(hex)).toEqual({
				special: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
				relay: ['wss://r.x.com', 'wss://djbas.sadkb.com'],
			});
		});
	});
});
