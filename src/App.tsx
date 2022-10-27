import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';
import satori from 'satori';
import { html } from 'satori-html';

type TStatuses = 'STARTED' | 'PAUSED';
type TTimeLeft = {
  minutes: number;
  seconds: number;
};
const duration = 25;
async function init() {
  if (typeof window === 'undefined') return [];

  const [font, fontBold, fontIcon] =
    window.__resource ||
    (window.__resource = await Promise.all([
      fetch('/inter-latin-ext-400-normal.woff').then((res) =>
        res.arrayBuffer()
      ),
      fetch('/inter-latin-ext-700-normal.woff').then((res) =>
        res.arrayBuffer()
      ),
      fetch('/material-icons-base-400-normal.woff').then((res) =>
        res.arrayBuffer()
      ),
    ]));

  return [
    {
      name: 'Inter',
      data: font,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: fontBold,
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Material Icons',
      data: fontIcon,
      weight: 300,
      style: 'normal',
    },
  ];
}
const loadFonts = init();

const App: Component = () => {
  const [status, setStatus] = createSignal<TStatuses>('STARTED');
  const [satoriOutput, setSatoriOutput] = createSignal('');
  const [timerRef, setTimerRef] = createSignal<HTMLDivElement | undefined>();
  const [timerInterval, setTimerInterval] = createSignal<NodeJS.Timer>();
  let myDiv: HTMLDivElement | undefined;
  let renderSvg: string | undefined;

  const [timeLeft, setTimeLeft] = createSignal<TTimeLeft>({
    minutes: 25,
    seconds: 0,
  });
  createEffect(async () => {
    // if (setTimerRef()) {
    console.log({ timer: timeLeft() });
    const fonts = await loadFonts;
    console.log({ fonts });
    console.log({ myDiv: timerRef()?.outerHTML });
    const markup = html(timerRef()?.outerHTML!);

    const _result = await satori(
      // {
      //   type: 'div',
      //   props: {
      //     children: `hi: ${timeLeft().minutes}`,
      //     style: { color: 'black' },
      //   },
      // },
      markup,
      {
        width: 800,
        height: 400,
        // @ts-ignore
        fonts,
        embedFont: true,
      }
    );
    console.log({ _result });
    setSatoriOutput(_result);
    // }
  });

  const startTimer = () => {
    const endTime = new Date(
      new Date().getTime() +
        timeLeft().minutes * 60000 +
        timeLeft().seconds * 1000
    );

    const interval = setInterval(() => {
      const calculatedTimeLeft = calculateTimeLeft(endTime);
      const calculatedProgress = calculateProgress(
        duration,
        calculatedTimeLeft
      );
      setTimeLeft(calculatedTimeLeft);

      if (!calculatedProgress) {
        clearInterval(interval);
      }
    }, 200);

    setTimerInterval(interval);
  };

  const calculateTimeLeft = (endTime: Date) => {
    const difference = +endTime - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const calculateProgress = (duration: number, timeLeft: TTimeLeft) => {
    const secondsTotal = duration * 60;
    const secondsLeft = timeLeft.minutes * 60 + timeLeft.seconds;

    return 100 / (secondsTotal / secondsLeft);
  };
  const progress = createMemo(() => {
    const endTime = new Date(
      new Date().getTime() +
        timeLeft().minutes * 60000 +
        timeLeft().seconds * 1000
    );
    const calculatedTimeLeft = calculateTimeLeft(endTime);
    return calculateProgress(duration, calculatedTimeLeft);
  });

  const pauseCount = () => {
    clearInterval(timerInterval());
  };

  const displayedTime = createMemo(() => {
    const minutes =
      timeLeft().minutes < 10 ? '0' + timeLeft().minutes : timeLeft().minutes;
    const seconds =
      timeLeft().seconds < 10 ? '0' + timeLeft().seconds : timeLeft().seconds;

    return `${minutes}:${seconds}`;
  });
  return (
    <div class="flex h-full items-center justify-center">
      <div>
        <div
          ref={(el) => setTimerRef(el)}
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
            'background-color': 'white',
          }}
        >
          <h1 class="text-3xl font-bold underline">{displayedTime}</h1>
          <div>{progress()}</div>
        </div>
        <div innerHTML={satoriOutput()} />
        <div class="mt-10  flex space-x-4">
          <button
            onClick={startTimer}
            class="group inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white transition hover:bg-slate-700"
          >
            Start
          </button>
          <button
            onClick={pauseCount}
            class="group inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white transition hover:bg-slate-700"
          >
            Pause
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
