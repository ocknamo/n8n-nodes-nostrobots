import { getNpubFromNsecOrHexpubkey } from './get-npub';

describe('get-npub', () => {
	describe('getNpubFromNsecOrHexpubkey', () => {
		it('should transform to npub from nsec or hex pubkey ', () => {
			// DONT USE THIS NSEC ANYTHING BUT TEST.
			expect(
				getNpubFromNsecOrHexpubkey(
					'nsec1t36eq3qq30uerv4q2l8r6yfsd9vc6anw52w4drggqwppum350eks8q4w7p',
				),
			).toBe('npub1tfslfq3v654l64vec6wka30cvwrmyxh0ushk7yvg9a0u6q9uvqrqgy4g92');
		});

		it('should not convert to hex from hex', () => {
			expect(
				getNpubFromNsecOrHexpubkey(
					'5a61f4822cd52bfd5599c69d6ec5f86387b21aefe42f6f11882f5fcd00bc6006',
				),
			).toBe('npub1tfslfq3v654l64vec6wka30cvwrmyxh0ushk7yvg9a0u6q9uvqrqgy4g92');
		});
	});
});
