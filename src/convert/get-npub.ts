import { getPublicKey, nip19 } from 'nostr-tools';
import { getHexSecKey } from './get-hex';

export function getNpubFromNsecOrHexpubkey(src: string): string {
	if (src.startsWith('nsec')) {
		return getNpubFromNsec(src);
	}

	return getNpubFromHexpubkey(src);
}

export function getNpubFromNsec(src: string): string {
	return getNpubFromHexpubkey(getPublicKey(getHexSecKey(src)));
}

export function getNpubFromHexpubkey(src: string): string {
	return nip19.npubEncode(src);
}
