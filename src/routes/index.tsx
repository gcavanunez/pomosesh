import { addMinutes, differenceInMinutes, format, startOfDay } from "date-fns";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import {
  calculateChunksOfTime,
  convertTimeToDate,
  periods,
} from "../lib/date-utils";

export default function Page() {
  const [startTime, setStartTime] = createSignal(
    format(addMinutes(startOfDay(new Date()), 60 * 9), "HH:mm"),
  );

  const [endTime, setEndTime] = createSignal(
    format(addMinutes(new Date(), 60), "HH:mm"),
  );

  const [timer, setTimer] = createSignal(20);

  const chunks = createMemo(() => {
    const end = convertTimeToDate(endTime());
    const now = convertTimeToDate(startTime());

    return periods(timer(), calculateChunksOfTime(timer(), end, now), now).map(
      (p, i) => ({
        idx: i,
        start: format(p.start, "hh:mm a"),
        start_timestamp: p.start,
        end: format(p.end, "hh:mm a"),
        end_timestamp: p.end,
      }),
    );
  });

  const [check, setCheck] = createSignal(new Date());

  const [timerInterval, setTimerInterval] = createSignal<
    NodeJS.Timeout | string | number | undefined
  >();

  const progress = createMemo(() => {
    const timeSlot = chunks().find((c) => {
      const start = c.start_timestamp;
      const end = c.end_timestamp;

      return check() >= start && check() <= end;
    });

    const timeSlotIndex = timeSlot!.idx;
    const diff = differenceInMinutes(check(), timeSlot!.start_timestamp);

    return {
      index: timeSlotIndex,
      status: Math.floor((diff / timer()) * 100) + "%",
      timeLeft: timer() - diff,
    };
  });

  const startTimer = () => {
    const interval = setInterval(() => {
      console.log("hit");
      setCheck(new Date());
    }, 1000);

    setTimerInterval(interval);
  };

  onMount(() => {
    startTimer();
  });

  onCleanup(() => {
    clearInterval(timerInterval());
  });
  const active = createMemo(() => {
    return chunks().filter((chunk) => {
      return chunk.end_timestamp >= check();
    });
  });

  return (
    <>
      <div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <img
          src="https://play.tailwindcss.com/img/beams.jpg"
          alt=""
          class="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          width="1308"
        />
        <div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 w-full">
          <div class="mx-auto max-w-md w-full">
            <div class="divide-y divide-gray-300/50">
              <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
                <div>
                  <div>
                    <label
                      for="starttime"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Start time
                    </label>
                    <div class="mt-2">
                      <input
                        type="time"
                        name="starttime"
                        id="starttime"
                        value={startTime()}
                        onInput={(e) => setStartTime(e.target.value)}
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-x-6">
                  <div>
                    <label
                      for="chunk"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Chunk of time
                    </label>
                    <div class="mt-2">
                      <input
                        type="number"
                        name="chunk"
                        value={timer()}
                        onInput={(e) => setTimer(Number(e.target.value))}
                        id="chunk"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      End time
                    </label>
                    <div class="mt-2">
                      <input
                        type="time"
                        name="endtime"
                        id="endtime"
                        value={endTime()}
                        onInput={(e) => setEndTime(e.target.value)}
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pt-8 text-base font-semibold leading-7">
                <p class="text-gray-900">Periods</p>
                <div>
                  <div>
                    {chunks().length} chunks of {timer()} minutes
                  </div>
                  <div>
                    Current period: {progress().timeLeft} mins left (
                    {progress()?.status})
                  </div>

                  <ul class="border-t mt-4 space-y-2.5 font-mono pt-2.5 text-sm">
                    <For each={active()}>
                      {(chunk, i) => (
                        <>
                          <li class="relative pb-1">
                            <div
                              class="right-0 bottom-0 left-0 h-1 bg-blue-500 absolute rounded-full w-[--width] transition-all"
                              style={{
                                "--width":
                                  progress()?.index === chunk.idx
                                    ? progress()?.status
                                    : "0%",
                              }}
                            ></div>
                            <div>Period {chunk.idx + 1}</div>
                            <div class="flex justify-between">
                              <div>Start</div> <div>{chunk.start}</div>
                            </div>
                            <div class="flex justify-between">
                              <div>End</div> <div>{chunk.end}</div>
                            </div>
                          </li>
                        </>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
