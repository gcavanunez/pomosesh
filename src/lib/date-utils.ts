import { addMinutes, differenceInMinutes, startOfMinute } from "date-fns";

export function convertTimeToDate(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const now = startOfMinute(new Date());
  now.setHours(hours);
  now.setMinutes(minutes);

  return now;
}
export function calculateChunksOfTime(
  chunk: number,
  endTime: Date,
  start = new Date(),
) {
  const diffInMins = differenceInMinutes(endTime, start);

  const rounds = Math.floor(diffInMins / chunk);

  return rounds;
}

export function periods(chunk: number, chunks: number, start = new Date()) {
  const periods = Array.from({ length: chunks }, (_, i) => {
    const startTime = addMinutes(start, i * chunk);

    return {
      start: startTime,
      end: addMinutes(startTime, chunk),
    };
  });

  return periods;
}
export function secondsToMinutesAndSeconds(seconds: number) {
  // Calculate the minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the minutes and seconds with leading zeros if necessary
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}
