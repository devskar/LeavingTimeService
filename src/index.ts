import { loadConfigurations } from './configurations';
import Bot from './discord/bot';
import { loadTimetableData } from './untis';

const main = () => {
	const bot = new Bot();
	bot.login();

	bot.registerEvent('ready', () => {
		const configs = loadConfigurations();

		bot.log(`Found ${configs.length} configuration(s)`);

		configs.forEach(async config => {
			try {
				const { cancelledLessons, leavingTime } = await loadTimetableData(
					config.untis,
				);

				if (cancelledLessons.length > 0) {
					bot.sendMessageToUserById(
						config.discord.user_id,
						`Today following lessons are cancelled:\n ${cancelledLessons
							.map(l => `\t${l.su[0].longname}`)
							.join('\n')}`,
					);
				}
			} catch (err) {
				bot.log(
					`An error occurred while parsing following config: ${config.name}\ndata: \n${err}`,
				);
			}
		});
	});
};

main();
