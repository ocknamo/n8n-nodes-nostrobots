import { getHexEventId, getHexPubKey } from './get-hex';

describe('get-hex', () => {
	describe('getHexPubKey', () => {
		it('should convert to hex from bech32', () => {
			expect(getHexPubKey('npub1fcrtdcrlsvqcnzkhy6m37v48sl30wms3m7e4vs0tkmp644hr8pqqwrqnef')).toBe(
				'4e06b6e07f8301898ad726b71f32a787e2f76e11dfb35641ebb6c3aad6e33840',
			);
		});

		it('should not convert to hex from hex', () => {
			expect(getHexPubKey('4e06b6e07f8301898ad726b71f32a787e2f76e11dfb35641ebb6c3aad6e33840')).toBe(
				'4e06b6e07f8301898ad726b71f32a787e2f76e11dfb35641ebb6c3aad6e33840',
			);
		});
	});

	describe('getHexEventId', () => {
		it('should get hex event and metadata with ', () => {
			expect(
				getHexEventId('nevent1qqsgznr20a3nt0lkxqmunrtgk5u222u4n3mc4xjwdwqmnaseuaxnsng5p9cxy'),
			).toEqual({
				special: '814c6a7f6335bff63037c98d68b538a52b959c778a9a4e6b81b9f619e74d384d',
				relay: [],
			});
		});
	});
});
