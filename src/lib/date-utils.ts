import { addMinutes, differenceInMinutes } from "date-fns";

export function convertTimeToDate(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date();
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
