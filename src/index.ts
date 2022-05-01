import Bot from './bot';
import BVGClient from './bvg';
import { loadConfigurations } from './configurations';
import { formatJourneys, formatTime } from './helper';
import { loadTimetableData } from './untis';

let bot: Bot;
let bvgClient: BVGClient;

const main = () => {
	bot = new Bot();
	bot.login();

	bvgClient = new BVGClient('LeavingTimeService');

	bot.registerEvent('ready', async () => {
		processConfigs().then(exit);
	});
};

const processConfigs = async () => {
	const configs = loadConfigurations();
	for (const config of configs) {
		const { cancelledLessons, schoolStart } = await loadTimetableData(
			config.untis,
		);

		if (cancelledLessons.length > 0) {
			const message = `Today following lessons are cancelled:\n${cancelledLessons
				.map(l => `\t${l.su[0].longname}`)
				.join('\n')}`;

			await bot.sendMessageToUserById(config.discord.user_id, message);
		}

		if (!schoolStart) {
			continue;
		}

		const start = await bvgClient.getLocation(config.trip.start_location);
		const end = await bvgClient.getLocation(config.trip.end_location);

		// subtract buffer from arrival time
		schoolStart.setMinutes(
			schoolStart.getMinutes() - config.trip.time_buffer_min,
		);

		const journey = await bvgClient.getJourney(start, end, schoolStart);

		if (!journey.journeys) {
			await bot.sendMessageToUserById(
				config.discord.user_id,
				`No journey found from ${config.trip.start_location} to ${
					config.trip.end_location
				} at ${formatTime(schoolStart)}`,
			);
		} else {
			await bot.sendMessageToUserById(
				config.discord.user_id,
				`Trips:\n${formatJourneys(journey.journeys)}`,
			);
		}
	}
};

const exit = () => {
	bot.log('Shutting down').then(() => {
		bot.destroy();
		process.exit(0);
	});
};

main();
