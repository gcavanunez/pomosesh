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
  let myCanvas: HTMLCanvasElement | undefined;
  let myVideo: HTMLVideoElement | undefined;

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

    const _result = await satori(markup, {
      width: 600,
      height: 200,
      // @ts-ignore
      fonts,
      embedFont: true,
    });
    if (myCanvas) {
      let ctx = myCanvas.getContext('2d');
      let data = _result;
      let DOMURL = window.URL || window.webkitURL || window;
      let img1 = new Image();
      let svg = new Blob([data], { type: 'image/svg+xml' });
      let url = DOMURL.createObjectURL(svg);
      img1.onload = function () {
        ctx!.drawImage(img1, -150, -50);
        DOMURL.revokeObjectURL(url);
      };
      img1.src = url;
    }
    // Remove any characters outside the Latin1 range
    // var decoded = unescape(encodeURIComponent(svgString));

    // Now we can use btoa to convert the svg to base64

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

  function pip() {
    if (!myCanvas) {
      return;
    }
    if (!myVideo) {
      return;
    }
    const canvas = myCanvas;

    const video = myVideo;
    video.muted = true;
    video.srcObject = canvas.captureStream();
    video.addEventListener('loadedmetadata', () => {
      video.requestPictureInPicture();
    });
    video.play();

    // document.getElementById('pip-button').disabled = true;
  }

  return (
    <div class="flex  items-center justify-center">
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
        <canvas ref={myCanvas} class="h-[300px] w-[600px] " />
        <video ref={myVideo} class="h-[300px] w-[600px] " controls />
        <div class="mt-10  flex justify-center space-x-4">
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
          <button
            onClick={pip}
            class="group inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white transition hover:bg-slate-700"
          >
            pip
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
