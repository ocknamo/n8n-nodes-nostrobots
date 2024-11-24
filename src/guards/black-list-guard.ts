import { Event } from 'nostr-tools';
import { getHexPubKey } from '../convert/get-hex';

export function blackListGuard(event: Event, npubs: string[]): boolean {
	return !npubs.some((npub) => {
		return event.pubkey.toUpperCase() === getHexPubKey(npub).toUpperCase();
	});
}
