const bech32 = require('bech32-converting');

/**
 * Convert to Hex public key from src.
 * src: bech32 or HEX input
 * return: HEX public key
 */
export function getHexPubKey(src: string): string {
	let pk = '';
	if (src.startsWith('npub')) {
		// Convert to hex
		// emit 'Ox' and convert lower case.
		pk = bech32('npub').toHex(src).slice(2).toLowerCase();
	} else {
		pk = src;
	}
	return pk;
}
