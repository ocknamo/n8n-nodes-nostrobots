import { bech32 } from 'bech32';
import { getShareableIdentifier, ShareableIdentifier } from './parse-tlv-hex';

// TODO: To be injectable.
const LIMIT = 1000;

/**
 * Convert to Hex public key from src.
 * src: bech32 or HEX input
 * return: HEX public key
 */
export function getHexPubKey(src: string): string {
	return getHex(src, 'npub');
}

/**
 * Convert to Hex event id from src.
 * src: bech32 or HEX input
 * return: HEX event Id and metadata
 */
export function getHexEventId(src: string): ShareableIdentifier {
	const prefix = 'nevent';

	return getShareableIdentifier(getHex(src, prefix));
}

export function getHex(src: string, prefix: string): string {
	let res = '';
	if (src.startsWith(prefix)) {
		// Convert to hex
		const decode = bech32.decodeUnsafe(src, LIMIT);

		if (!decode) {
			return '';
		}

		res = Buffer.from(bech32.fromWords(decode.words)).toString('hex');
	} else {
		res = src;
	}
	return res;
}
