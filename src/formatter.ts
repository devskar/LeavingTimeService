import { Journey } from 'hafas-client';
import { Lesson } from 'webuntis';

export const formatJourneys = (journeys: readonly Journey[]): string => {
	return journeys.map(formatJourney).join('\n');
};

export const formatJourney = (journey: Journey): string => {
	return journey.legs
		.map(leg => {
			if (!leg.departure) return '';
			const departure = new Date(leg.departure);

			return `${leg.walking ? '🚶‍♂️' : '🚋 ' + leg.line?.name} ${formatTime(
				departure,
			)}`;
		})
		.join(' -> ');
};

export const formatLessons = (lessons: readonly Lesson[]): string => {
	return lessons.map(formatLesson).join('\n');
};

export const formatLesson = (lesson: Lesson): string => {
	return `${lesson.su[0].longname}`;
};

export const formatTime = (date: Date): string => {
	return `${formatTimeNumber(date.getHours())}:${formatTimeNumber(
		date.getMinutes(),
	)}`;
};

export const formatTimeNumber = (time: number): string => {
	return time.toLocaleString('en-US', {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});
};
