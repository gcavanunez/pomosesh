import {
  addMinutes,
  differenceInMinutes,
  differenceInSeconds,
  format,
  startOfDay,
} from "date-fns";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import {
  calculateChunksOfTime,
  convertTimeToDate,
  periods,
  secondsToMinutesAndSeconds,
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
    const diff = differenceInSeconds(check(), timeSlot!.start_timestamp);
    const timerInSeconds = timer() * 60;

    return {
      index: timeSlotIndex,
      status: Math.floor((diff / timerInSeconds) * 100) + "%",
      stroke: Math.floor((diff / timerInSeconds) * 126.92) + "px",
      timeLeft: secondsToMinutesAndSeconds(timerInSeconds - diff),
    };
  });

  const startTimer = () => {
    const interval = setInterval(() => {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          class="absolute inset-0"
          viewBox="0 0 700 700"
        >
          <defs>
            <radialGradient id="ffflux-gradient">
              <stop offset="0%" stop-color="hsl(227, 100%, 50%)"></stop>
              <stop offset="100%" stop-color="hsl(0, 0%, 100%)"></stop>
            </radialGradient>
            <filter
              id="ffflux-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.005 0.003"
                numOctaves="1"
                seed="2"
                stitchTiles="stitch"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                result="turbulence"
              ></feTurbulence>
              <feGaussianBlur
                stdDeviation="20 0"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="turbulence"
                // @ts-ignore
                edgeMode="duplicate"
                result="blur"
              ></feGaussianBlur>
              <feBlend
                // @ts-ignore
                mode="color-dodge"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                in="SourceGraphic"
                in2="blur"
                result="blend"
              ></feBlend>
            </filter>
          </defs>
          <rect
            width="700"
            height="700"
            fill="url(#ffflux-gradient)"
            filter="url(#ffflux-filter)"
          ></rect>
        </svg>
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
              <div class="py-4">
                <div class="flex items-center justify-center">
                  <div class="h-[340px] w-[340px] relative">
                    <div
                      class="text-[#0037FF]"
                      role="progressbar"
                      aria-valuenow="100"
                      style="width: 340px; height: 340px; transform: rotate(-90deg);"
                    >
                      <svg
                        class="MuiCircularProgress-svg"
                        fill="currentColor"
                        viewBox="22 22 44 44"
                      >
                        <circle
                          class="MuiCircularProgress-circle MuiCircularProgress-circleDeterminate"
                          cx="44"
                          cy="44"
                          r="20.2"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3.6"
                          style="stroke-dasharray: 126.92; stroke-dashoffset: 0px;"
                        ></circle>
                      </svg>
                    </div>
                    <div
                      class="text-blue-200 absolute inset-0 "
                      role="progressbar"
                      aria-valuenow="100"
                      style="width: 340px; height: 340px; transform: rotate(-90deg);"
                    >
                      <svg
                        class="MuiCircularProgress-svg"
                        fill="currentColor"
                        viewBox="22 22 44 44"
                      >
                        <circle
                          class="circular"
                          cx="44"
                          cy="44"
                          r="20.2"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3.6"
                          // style="stroke-dasharray: 126.92; stroke-dashoffset: 0px;"
                          style={{
                            "stroke-dasharray": "126.92",
                            "stroke-dashoffset": progress()?.stroke,
                          }}
                        ></circle>
                      </svg>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center font-mono text-4xl">
                        <div class="text-gray-700">{progress()?.timeLeft}</div>
                        <div class="text-gray-400 mt-1">
                          {progress().status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pt-8 text-base font-semibold leading-7">
                <ul class="space-y-2.5 font-mono  text-sm">
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
    </>
  );
}
