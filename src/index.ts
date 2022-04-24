import { loadConfigurations } from './configurations';
import Bot from './discord/bot';

const main = () => {
	const bot = new Bot();
	bot.login();

	bot.registerEvent('ready', () => {
		const configs = loadConfigurations();

		bot.log(`Found ${configs.length} configuration(s)`);
	});
};

main();
