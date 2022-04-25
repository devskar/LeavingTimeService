import fs from 'fs';
import { UntisConfiguration } from './untis';

type Configuration = {
	name: string;
	untis: UntisConfiguration;
	discord: {
		user_id: string;
	};
	trip: {
		time_buffer_min: number;
		start_location: string;
		end_location: string;
	};
};
export const CONFIG_FILE_FOLDER = './configs/';
export const CONFIG_FILE_SUFFIX = '.ltime.json';

export const loadConfigurations = (): Configuration[] => {
	const configs: Configuration[] = [];
	const configFiles = fs.readdirSync('./configs');
	// TODO: Check if is dir and then call recursively
	for (const configFile of configFiles) {
		if (!configFile.endsWith(CONFIG_FILE_SUFFIX)) {
			continue;
		}
		const configBuffer = fs.readFileSync(`${CONFIG_FILE_FOLDER}${configFile}`);
		const configObj = JSON.parse(configBuffer.toString());
		configObj.name = configFile.replace(CONFIG_FILE_SUFFIX, '');
		configs.push(configObj);
	}
	return configs;
};
