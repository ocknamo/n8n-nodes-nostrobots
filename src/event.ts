import { Event, getEventHash, signEvent, UnsignedEvent, validateEvent, verifySignature } from 'nostr-tools';

/**
 * get basic kind1 event.
 * @param text kind1 note text
 * @param pk account public key
 * @param sk account secret key
 * @returns kind1 Event
 */
export function getSignedEvent(unsignedEvent: UnsignedEvent, sk: string): Event {
  (unsignedEvent as Event)['id'] = getEventHash(unsignedEvent);
  (unsignedEvent as Event)['sig'] = signEvent(unsignedEvent, sk);

  const event = unsignedEvent as Event;

  let ok = validateEvent(event);
  let veryOk = verifySignature(event);

	if(!ok || !veryOk) {
		throw new Error('Cant create note event! not ok or not very ok.');
	}

  return event;
}
