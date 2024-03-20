export async function fetchSupportedNips(relayUrl: string): Promise<number[]> {
	const info = await fetchRelayInfo(relayUrl);
	return info.supported_nips ?? [];
}

// https://github.com/nostr-jp/nips-ja/blob/main/11.md
export interface RelayInformationDocument {
	name: string; // <string identifying relay>,
	description: string; // <string with detailed information>,
	pubkey: string; // <administrative contact pubkey>,
	contact: string; // <administrative alternate contact>,
	supported_nips: number[]; // <a list of NIP numbers supported by the relay>,
	software: string; // <string identifying relay software URL>,
	version: string; // <string version identifier>
	limitation?: any;
	retention?: any;
	relay_countries?: any;
	language_tags?: string[];
	tags?: string[];
	posting_policy?: string;
	payments_url?: string;
	fees?: any;
	icon?: string;
}

// https://github.com/nostr-jp/nips-ja/blob/main/11.md
export function fetchRelayInfo(relayUrl: string): Promise<RelayInformationDocument> {
	const request = new Request(convertWssToHttps(relayUrl));
	request.headers.append('Accept', 'application/nostr+json');

	return fetch(request)
		.then((res) => res.json())
		.then((json) => json) as Promise<RelayInformationDocument>;
}

export function convertWssToHttps(wssUrl: string): string {
	return wssUrl.replace('wss', 'https');
}
