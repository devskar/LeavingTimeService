import { MessageEmbed } from 'discord.js';
import { Journey } from 'hafas-client';
import { formatJourney, formatTime } from '../formatter';

class JourneyMessageEmbed extends MessageEmbed {
	constructor(journey: Journey) {
		super({ color: '#F0CA00' });

		const departure = journey.legs[0].departure;
		const arrival = journey.legs[journey.legs.length - 1].arrival;

		if (!departure || !arrival) {
			throw new Error('Journey has no departure or arrival');
		}

		this.setTitle(
			`🕗 Leave ${formatTime(new Date(departure))} to arrive at ${formatTime(
				new Date(arrival),
			)}`,
		);
		this.setDescription(formatJourney(journey));
	}
}

export default JourneyMessageEmbed;
