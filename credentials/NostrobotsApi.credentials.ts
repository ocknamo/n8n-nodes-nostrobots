import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NostrobotsApi implements ICredentialType {
	name = 'nostrobotsApi';
	displayName = 'Nostrobots API';
	documentationUrl = 'https://github.com/ocknamo/n8n-nodes-nostrobots';
	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secKey',
			type: 'string',
			typeOptions: { password: true },
			description: 'Nostr secret key',
			default: '',
		},
	];
}
