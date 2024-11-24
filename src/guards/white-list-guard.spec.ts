import { getNpubFromHexpubkey } from '../convert/get-npub';
import { whiteListGuard } from './white-list-guard';

describe('white-list-guard', () => {
	it('should return true with white listed npub', () => {
		const whitelist = [
			'npub19dzc258s3l8ht547cktvqsgura8wj0ecyr02a9g6zgxq9r3scjqqqrg7sk',
			'npub1y6aja0kkc4fdvuxgqjcdv4fx0v7xv2epuqnddey2eyaxquznp9vq0tp75l',
		];
		const event: any = {
			pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
		};

		expect(getNpubFromHexpubkey(event.pubkey)).toBe(whitelist[0]);
		expect(whiteListGuard(event, whitelist)).toBeTruthy();
	});

	it('should return false with no white listed npub', () => {
		const whitelist = ['npub1y6aja0kkc4fdvuxgqjcdv4fx0v7xv2epuqnddey2eyaxquznp9vq0tp75l'];
		const event: any = {
			pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
		};

		expect(whiteListGuard(event, whitelist)).toBeFalsy();
	});

	it('should return true with empty whitelist', () => {
		const whitelist: string[] = [];
		const event: any = {
			pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
		};

		expect(whiteListGuard(event, whitelist)).toBeTruthy();
	});
});
