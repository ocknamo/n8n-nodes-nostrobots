export interface ShareableIdentifier {
	special: string;
	relay: string[];
	author?: string;
	kind?: string;
}

type TlvType = 'special' | 'relay' | 'author' | 'kind';

const tlvTypes: { [key: string]: TlvType } = {
	'00': 'special',
	'01': 'relay',
	'02': 'author',
	'03': 'kind',
};

/**
 * NIP-19
 */
export function parseTlvHex(hex: string, res: [TlvType, string][] = []): [TlvType, string][] {
	const t = hex.slice(0, 2);
	const l = hex.slice(2, 4);

	const tlvType = tlvTypes[t];

	const byteLength = Number('0x' + l);
	const hexLength = byteLength * 2;
	let value = hex.slice(4, 4 + hexLength);

	if (tlvType === 'relay') {
		// Convert hex to buffer and Buffer to ascii
		value = Buffer.from(value, 'hex').toString('ascii');
	}

	res.push([tlvType, value]);
	if (isNaN(hexLength)) {
		throw new Error(`Invalid hex input hex: ${hex}`);
	}

	if (hex.length === 4 + hexLength) {
		return res;
	}

	return parseTlvHex(hex.slice(4 + hexLength), res);
}

export function formatShareableIdentifier(parsedTlv: [TlvType, string][]): ShareableIdentifier {
	// special
	const special = parsedTlv.find((v) => v[0] === 'special')?.[1];
	if (!special) {
		throw new Error('special is required');
	}

	// relay
	const relay = parsedTlv.filter((v) => v[0] === 'relay').map((v) => v[1]);
	// author
	const author = parsedTlv.find((v) => v[0] === 'author')?.[1];
	// kind
	const kind = parsedTlv.find((v) => v[0] === 'kind')?.[1];

	return {
		special,
		relay,
		author,
		kind,
	};
}

export function getShareableIdentifier(hex: string): ShareableIdentifier {
	return formatShareableIdentifier(parseTlvHex(hex));
}
