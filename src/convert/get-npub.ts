import { hexToBytes } from '@noble/hashes/utils';
import { getHexSecKey } from './get-hex';
import { nip19, getPublicKey } from 'nostr-tools';

export function getNpubFromNsecOrHexpubkey(src: string): string {
	if (src.startsWith('nsec')) {
		return getNpubFromNsec(src);
	}

	return getNpubFromHexpubkey(src);
}

export function getNpubFromNsec(src: string): string {
	return getNpubFromHexpubkey(getPublicKey(hexToBytes(getHexSecKey(src))));
}

export function getNpubFromHexpubkey(src: string): string {
	return nip19.npubEncode(src);
}
