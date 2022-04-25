import Bot from './bot';
import BVGClient from './bvg';
import { loadConfigurations } from './configurations';
import { formatJourneys } from './helper';
import { loadTimetableData } from './untis';

const main = () => {
	const bot = new Bot();
	bot.login();

	const bvgClient = new BVGClient('LeavingTimeService');

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

				const start = await bvgClient.getLocation(config.trip.start_location);
				const end = await bvgClient.getLocation(config.trip.end_location);

				leavingTime.setMinutes(
					leavingTime.getMinutes() - config.trip.time_buffer_min,
				);

				bvgClient.getJourney(start, end, leavingTime).then(journey => {
					if (!journey.journeys) return;

					bot.sendMessageToUserById(
						config.discord.user_id,
						`Trips:\n${formatJourneys(journey.journeys)}`,
					);
				});
			} catch (err) {
				console.log(err);
				bot.log(
					`An error occurred while parsing following config: \`${config.name}\`\ndata:\n${err}`,
				);
			}
		});
	});
};

main();
