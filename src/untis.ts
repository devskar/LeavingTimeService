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
	leavingTime: Date;
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

	// TODO: Remove
	const date = new Date();
	date.setMonth(2, 23);

	return untis
		.login()
		.then(() => untis.getOwnClassTimetableFor(date))
		.then(lessons => {
			const { filteredLessons, cancelledLessons } =
				filterAndSortLessons(lessons);
			const leavingTime = Webuntis.convertUntisDate(
				filteredLessons[0].startTime,
				date,
			);

			return { cancelledLessons, leavingTime };
		});
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
