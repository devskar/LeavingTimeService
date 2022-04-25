import { Journey } from 'hafas-client';

export const formatJourneys = (journeys: readonly Journey[]): string => {
	return journeys
		.map(journ =>
			journ.legs
				.map(leg => {
					if (!leg.departure) return '';
					const departure = new Date(leg.departure);

					return `${formatTime(departure)} ${
						leg.walking ? '🚶‍♂️' : leg.line?.name
					}`;
				})
				.join(' -> '),
		)
		.join('\n');
};

export const formatTime = (date: Date): string => {
	return `[${formatTimeNumber(date.getHours())}:${formatTimeNumber(
		date.getMinutes(),
	)}]`;
};

export const formatTimeNumber = (time: number): string => {
	return time.toLocaleString('en-US', {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});
};
