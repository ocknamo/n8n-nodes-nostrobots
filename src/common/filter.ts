import { Filter } from 'nostr-tools';
import { getHexEventId, getHexPubKey } from '../convert/get-hex';

export enum FilterStrategy {
	eventid = 'eventid',
	hashtag = 'hashtag',
	mention = 'mention',
	rawFilter = 'rawFilter',
	textSearch = 'textSearch',
	pubkey = 'pubkey',
}

export function buildFilter(
	strategy: FilterStrategy,
	info: Partial<Record<FilterStrategy, string | undefined>>,
	since?: number,
	until?: number,
	kinds = [1],
): Filter {
	let filter = {};

	const specificData = info[strategy];

	if (!specificData) {
		throw new Error('No data');
	}

	switch (strategy) {
		case 'pubkey':
			const pubkey = getHexPubKey(specificData);

			filter = {
				kinds,
				authors: [pubkey],
				since,
				until,
			};
			break;

		case 'eventid':
			const si = getHexEventId(specificData);

			filter = {
				ids: [si.special],
				limit: 1,
			};
			break;

		case 'textSearch':
			const searchWord = specificData;

			filter = {
				kinds,
				search: searchWord,
				since,
				until,
			};

			break;

		case 'hashtag':
			let tagString = specificData;
			tagString = tagString.replace('#', '');

			filter = {
				kinds,
				'#t': [tagString],
				since,
				until,
			};

			break;

		case 'rawFilter':
			const filterJsonString = specificData;

			let json;
			try {
				json = JSON.parse(filterJsonString);
			} catch (error) {
				console.warn('Json parse failed.');
				throw error;
			}

			filter = { ...json, since, until };

			break;

		case 'mention':
			const mentionedpubkey = getHexPubKey(specificData);

			filter = {
				kinds,
				'#p': [mentionedpubkey],
				since,
				until,
			};

			break;

		default:
			console.warn('Invalid strategy provided.');
	}

	return filter;
}
