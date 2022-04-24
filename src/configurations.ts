import fs from 'fs';

type Configuration = {
	untis: {
		anonymous?: boolean;
		username?: string;
		password?: string;
		school_name: string;
		base_url: string;
	};
};

export const loadConfigurations = (): Configuration[] => {
	const configs: Configuration[] = [];
	const configFiles = fs.readdirSync('./configs');
	// TODO: Check if is dir and then call recursively
	for (const configFile of configFiles) {
		const config = fs.readFileSync(`./configs/${configFile}`);
		configs.push(JSON.parse(config.toString()));
	}
	return configs;
};
