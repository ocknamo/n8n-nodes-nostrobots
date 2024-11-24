import { getNpubFromHexpubkey } from '../convert/get-npub';
import { blackListGuard } from './black-list-guard';

describe('black-list-guard', () => {
	it('should return false with black listed npub', () => {
		const blacklist = [
			'npub19dzc258s3l8ht547cktvqsgura8wj0ecyr02a9g6zgxq9r3scjqqqrg7sk',
			'npub1y6aja0kkc4fdvuxgqjcdv4fx0v7xv2epuqnddey2eyaxquznp9vq0tp75l',
		];
		const event: any = {
			pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
		};

		expect(getNpubFromHexpubkey(event.pubkey)).toBe(blacklist[0]);
		expect(blackListGuard(event, blacklist)).toBeFalsy();
	});

	it('should return true with no black listed npub', () => {
		const blacklist = ['npub1y6aja0kkc4fdvuxgqjcdv4fx0v7xv2epuqnddey2eyaxquznp9vq0tp75l'];
		const event: any = {
			pubkey: '2b458550f08fcf75d2bec596c0411c1f4ee93f3820deae951a120c028e30c480',
		};

		expect(blackListGuard(event, blacklist)).toBeTruthy();
	});
});
