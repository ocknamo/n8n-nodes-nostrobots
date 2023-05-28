import { getHexPubKey } from './get-hex-pubkey';

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
