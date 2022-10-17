import { Component, createMemo, createSignal, onCleanup } from 'solid-js';

type TStatuses = 'STARTED' | 'PAUSED';
type TTimeLeft = {
  minutes: number;
  seconds: number;
};
const duration = 25;

const App: Component = () => {
  const [status, setStatus] = createSignal<TStatuses>('STARTED');
  const [timerInterval, setTimerInterval] = createSignal<number>();

  const [timeLeft, setTimeLeft] = createSignal<TTimeLeft>({
    minutes: 25,
    seconds: 0,
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
    <div class="flex items-center justify-center h-full">
      <div>
        <div>
          <h1 class="text-3xl font-bold underline">{displayedTime}</h1>
          <div>{progress()}</div>
        </div>
        <div class="flex  mt-10 space-x-4">
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
