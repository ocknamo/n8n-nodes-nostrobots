import { Event, relayInit } from 'nostr-tools';

type PostResult = 'accepted' | 'failed';

export async function oneTimePostToMultiRelay(event: Event, relayUris: string[]): Promise<PostResult[]> {
	const promises: Promise<PostResult>[] = [];
	relayUris.forEach(uri => {
		promises.push(oneTimePost(event, uri));
	});

	return Promise.all(promises);
}

export async function oneTimePost(event: Event, relayUri: string): Promise<PostResult> {
  const relay = relayInit(relayUri);
  relay.on('connect', () => {
    console.log(`connected to ${relay.url}`)
  })
  relay.on('error', () => {
    console.log(`failed to connect to ${relay.url}`)
  })

  await relay.connect()

	let result: PostResult = 'failed';

  let pub = relay.publish(event);
  pub.on('ok', () => {
    console.log(`${relay.url} has accepted our event`)
		result = 'accepted';
  });
  pub.on('failed', (reason: any) => {
    console.log(`failed to publish to ${relay.url}: ${reason}`)
		result = 'failed';
  });

  await relay.list([{kinds: [1]}]);

  relay.close();

	return result;
}
