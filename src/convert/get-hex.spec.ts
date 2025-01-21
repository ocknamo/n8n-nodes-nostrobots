import { getHexEventId, getHexPubKey, getHexpubkeyfromNpubOrNsecOrHexseckey } from './get-hex';

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

	describe('getHexpubkeyfromNpubOrNsecOrHexseckey', () => {
		it('should get hex pubkey from npub', async () => {
			await expect(
				getHexpubkeyfromNpubOrNsecOrHexseckey(
					'npub1tfslfq3v654l64vec6wka30cvwrmyxh0ushk7yvg9a0u6q9uvqrqgy4g92',
				),
			).resolves.toBe('5a61f4822cd52bfd5599c69d6ec5f86387b21aefe42f6f11882f5fcd00bc6006');
		});
		it('should get hex pubkey from nsec', async () => {
			// DONT USE THIS NSEC ANYTHING BUT TEST.
			await expect(
				getHexpubkeyfromNpubOrNsecOrHexseckey(
					'nsec1t36eq3qq30uerv4q2l8r6yfsd9vc6anw52w4drggqwppum350eks8q4w7p',
				),
			).resolves.toBe('5a61f4822cd52bfd5599c69d6ec5f86387b21aefe42f6f11882f5fcd00bc6006');
		});
		it('should get hex pubkey from hexseckey', async () => {
			await expect(
				getHexpubkeyfromNpubOrNsecOrHexseckey(
					'5c759044008bf991b2a057ce3d113069598d766ea29d568d0803821e6e347e6d',
				),
			).resolves.toBe('5a61f4822cd52bfd5599c69d6ec5f86387b21aefe42f6f11882f5fcd00bc6006');
		});
	});
});
