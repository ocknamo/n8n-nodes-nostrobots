import { Event } from '../type';
import { getHexPubKey } from '../convert/get-hex';

export function whiteListGuard(event: Event, npubs: string[] = []): boolean {
	if (npubs.length === 0) {
		return true;
	}

	return npubs.some((npub) => {
		return event.pubkey.toUpperCase() === getHexPubKey(npub).toUpperCase();
	});
}
