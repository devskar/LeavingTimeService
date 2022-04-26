import Bot from './bot';
import BVGClient from './bvg';
import { loadConfigurations } from './configurations';
import { formatJourneys, formatTime } from './helper';
import { loadTimetableData } from './untis';

const main = async () => {
	const bot = new Bot();
	bot.login();

	const bvgClient = new BVGClient('LeavingTimeService');

	bot.registerEvent('ready', async () => {
		const configs = loadConfigurations();

		configs.forEach(async config => {
			try {
				const { cancelledLessons, leavingTime } = await loadTimetableData(
					config.untis,
				);

				if (cancelledLessons.length > 0) {
					bot.addClientMessageToQueue(
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

				bvgClient.getJourney(start, end, leavingTime).then(async journey => {
					if (!journey.journeys) {
						bot.addClientMessageToQueue(
							config.discord.user_id,
							`No journey found for ${formatTime(leavingTime)} to ${
								config.trip.end_location
							} at ${formatTime(leavingTime)}`,
						);
					} else {
						bot.addClientMessageToQueue(
							config.discord.user_id,
							`Trips:\n${formatJourneys(journey.journeys)}`,
						);
					}
				});
			} catch (err) {
				console.log(err);
				bot.log(
					`An error occurred while parsing following config: \`${config.name}\`\ndata:\n${err}`,
				);
			}
		});
	});

	// Queuing messages like this to avoid bot shutting down, before all messages are sent.
	bot.sendQueuedServerMessages().then(() => {
		console.log('Done sending Server Messages');
		bot.sendQueuedClientMessages().then(() => {
			console.log('Done sending Client Messages');
			bot.destroy().then(() => {
				console.log('Shutting down...');
				process.exit(0);
			});
		});
	});
};

main();
