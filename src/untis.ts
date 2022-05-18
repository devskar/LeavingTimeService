import Webuntis, { Lesson } from 'webuntis';
export type UntisConfiguration = {
	anonymous?: boolean;
	username?: string;
	password?: string;
	school_name: string;
	base_url: string;
};

export type TimetableLoadingResult = {
	cancelledLessons: Lesson[];
	schoolStart?: Date;
};

export const loadTimetableData = (
	config: UntisConfiguration,
): Promise<TimetableLoadingResult> => {
	return config.anonymous
		? loadTimetableDataAnonymous(config)
		: loadTimetableDataAuthenticated(config);
};

const loadTimetableDataAnonymous = (
	config: UntisConfiguration,
): Promise<TimetableLoadingResult> => {
	throw new Error('Not implemented yet!');
};

const loadTimetableDataAuthenticated = async (
	config: UntisConfiguration,
): Promise<TimetableLoadingResult> => {
	if (!config.password || !config.username) {
		throw new Error('Missing username or password!');
	}

	const untis = new Webuntis(
		config.school_name,
		config.username,
		Buffer.from(config.password, 'base64').toString('binary'),
		config.base_url,
	);

	return untis
		.login()
		.then(() => untis.getOwnClassTimetableForToday())
		.then(lessons => {
			const { filteredLessons, cancelledLessons } =
				filterAndSortLessons(lessons);

			if (filteredLessons.length === 0) {
				return { cancelledLessons };
			}
			const schoolStart = untisTimeToDate(filteredLessons[0].startTime);
			return { cancelledLessons, schoolStart };
		});
};

//#region Helper

// e.g. 800 => Date(8am)
const untisTimeToDate = (
	untisTime: number,
	baseDate: Date = new Date(),
): Date => {
	const date = new Date(baseDate.getTime());

	const untisTimeString = String(untisTime);

	const tmpstr = untisTimeString.slice(-2); // 👉️ '00'
	const minutes = Number(tmpstr); // 👉️ 00

	const length = untisTimeString.length;
	// TODO: Cleaner way to handle this
	const tmpstr2 = untisTimeString.slice(0, length === 4 ? 2 : 1);
	const hours = Number(tmpstr2); // 👉️ '08'

	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);

	return date;
};

const filterAndSortLessons = (
	lessons: Lesson[],
): { filteredLessons: Lesson[]; cancelledLessons: Lesson[] } => {
	const filteredLessons: Lesson[] = [];
	const cancelledLessons: Lesson[] = [];

	lessons.sort((a, b) => a.startTime - b.startTime);

	lessons.forEach(lesson =>
		lesson.code === 'cancelled'
			? cancelledLessons.push(lesson)
			: filteredLessons.push(lesson),
	);

	return { filteredLessons, cancelledLessons };
};

//#endregion
