import {
	addDays,
	addMinutes,
	differenceInMinutes,
	secondsToMinutes,
	startOfMinute,
	subMinutes,
} from 'date-fns';

export function convertTimeToDate(time: string, current?: Date) {
	const [hours, minutes] = time.split(':').map(Number);

	const now = startOfMinute(new Date());
	now.setHours(hours);
	now.setMinutes(minutes);

	if (current) {
		if (now.getTime() < current.getTime()) {
			now.setDate(addDays(current, 1).getDate());
		}
	}

	return now;
}
export function calculateChunksOfTime(
	chunk: number,
	endTime: Date,
	start = new Date(),
	withBreaks = false,
	breakLength = 5,
) {
	const diffInMins = differenceInMinutes(endTime, start);

	if (!withBreaks) {
		return Math.floor(diffInMins / chunk);
	}

	let rounds = 0;
	let currentChunk = chunk;
	let total = 0;
	let idx = 0;
	for (
		let i = start.getTime();
		i <= subMinutes(endTime.getTime(), currentChunk).getTime();
		i + currentChunk
	) {
		i = addMinutes(start, total + currentChunk).getTime();
		total = total + currentChunk;
		currentChunk = idx % 2 !== 0 ? chunk : breakLength;
		idx++;
		rounds++;
	}

	return rounds;
}

export function periods(
	chunk: number,
	chunks: number,
	start = new Date(),
	hasBreaks = false,
	breakLength = 5,
) {
	// const count = hasBreaks ? 2 * chunks - 1 : chunks;

	const periods = Array.from({ length: chunks }, (_, i) => {
		if (!hasBreaks) {
			const startTime = addMinutes(start, i * chunk);

			return {
				start: startTime,
				end: addMinutes(startTime, chunk),
				kind: 'work',
			};
		}

		const kind = i % 2 === 1 && i !== 0 ? 'break' : 'work';

		let minutesToAdd = 0;
		let span = chunk;

		if (kind === 'break' && i !== 0) {
			span = breakLength;
			const multipleChunk = Math.floor(i / 2) + 1;
			const multipleSpan = Math.floor(i / 2);
			minutesToAdd = multipleChunk * chunk + multipleSpan * breakLength;
		}
		// will always be even
		if (kind === 'work' && i !== 0) {
			minutesToAdd = (i / 2) * chunk + (i / 2) * breakLength;
		}

		const startTime = addMinutes(start, minutesToAdd);

		return {
			start: startTime,
			end: addMinutes(startTime, span),
			kind,
		};
	});
	return periods;
}
export function secondsToMinutesAndSeconds(seconds: number) {
	// Calculate the minutes and remaining seconds
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Format the minutes and seconds with leading zeros if necessary
	const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
	const formattedSeconds =
		remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

	// Return the formatted time
	return `${formattedMinutes}:${formattedSeconds}`;
}
export function formatSecondsToMinutes(seconds: number) {
	const remainingSeconds = seconds % 60;
	const formattedSeconds =
		remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

	// Return the formatted time
	return `${secondsToMinutes(seconds)}:${formattedSeconds}`;
}
