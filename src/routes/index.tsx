import { Title } from '@solidjs/meta';
import {
	addMinutes,
	differenceInMinutes,
	differenceInSeconds,
	format,
	startOfDay,
	startOfMinute,
} from 'date-fns';
import { createMemo, createSignal, For, onCleanup, onMount } from 'solid-js';
import {
	calculateChunksOfTime,
	convertTimeToDate,
	periods,
	secondsToMinutesAndSeconds,
} from '../lib/date-utils';
import { useSatoriPip } from '../lib/use-satori-pip';
import { Backdrop } from '../components/backdrop';

export default function Page() {
	const [startTime, setStartTime] = createSignal(
		format(addMinutes(startOfDay(new Date()), 60 * 9), 'HH:mm'),
	);

	const [endTime, setEndTime] = createSignal(
		format(addMinutes(new Date(), 60), 'HH:mm'),
	);

	const [timer, setTimer] = createSignal(20);
	const [check, setCheck] = createSignal(new Date());

	// let timerRef: HTMLDivElement | undefined;
	// let myCanvas: HTMLCanvasElement | undefined;
	// let myVideo: HTMLVideoElement | undefined;

	const [timerRef, setTimerRef] = createSignal<HTMLDivElement | undefined>();
	const [myCanvas, setMyCanvas] = createSignal<
		HTMLCanvasElement | undefined
	>();
	const [myVideo, setMyVideo] = createSignal<HTMLVideoElement | undefined>();
	// const { pip } = useSatoriPip(check, timerRef, myCanvas, myVideo);

	const chunks = createMemo(() => {
		const now = convertTimeToDate(startTime());
		const end = convertTimeToDate(endTime(), now);

		return periods(
			timer(),
			calculateChunksOfTime(timer(), end, now),
			now,
		).map((p, i) => ({
			idx: i,
			start: format(p.start, 'hh:mm a'),
			start_timestamp: p.start,
			end: format(p.end, 'hh:mm a'),
			end_timestamp: p.end,
		}));
	});

	const [timerInterval, setTimerInterval] = createSignal<
		NodeJS.Timeout | string | number | undefined
	>();

	const progress = createMemo(() => {
		const timeSlot = chunks().find((c) => {
			const start = c.start_timestamp;
			const end = c.end_timestamp;

			return check() >= start && check() <= end;
		});

		const timerInSeconds = timer() * 60;
		const timeSlotIndex = timeSlot?.idx;

		if (timeSlotIndex === undefined) {
			return {
				index: 0,
				status: 100 + '%',
				stroke: 126.92 + 'px',
				timeLeft: secondsToMinutesAndSeconds(timerInSeconds),
			};
		}

		const diff = differenceInSeconds(check(), timeSlot!.start_timestamp);

		return {
			index: timeSlotIndex,
			status: Math.floor((diff / timerInSeconds) * 100) + '%',
			stroke: Math.floor((diff / timerInSeconds) * 126.92) + 'px',
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

	const startNow = () => {
		setStartTime(format(startOfMinute(new Date()), 'HH:mm'));
		setEndTime(
			format(addMinutes(startOfMinute(new Date()), 60 * 4), 'HH:mm'),
		);
	};
	const resetTimer = () => {
		setStartTime(format(startOfMinute(new Date()), 'HH:mm'));
	};

	return (
		<>
			<Title>{progress()?.timeLeft}</Title>
			<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
				<Backdrop />
				<div class="relative w-full bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
					<div class="mx-auto w-full max-w-md">
						<div class="divide-y divide-gray-300/50">
							<div class="py-6">
								{/* <SatoriPip tick={check()} timerRef={timerRef} /> */}

								{/* <div class="flex flex-col items-center"> */}
								{/* 	<canvas */}
								{/* 		ref={setMyCanvas!} */}
								{/* 		class="h-[400px] w-[800px]" */}
								{/* 		width={1600} */}
								{/* 		height={600} */}
								{/* 	/> */}
								{/* 	<video */}
								{/* 		ref={setMyVideo!} */}
								{/* 		class="h-[400px] w-[800px]" */}
								{/* 		controls */}
								{/* 	/> */}
								{/* </div> */}
								<h2 class="text-2xl font-semibold leading-7 text-gray-900">
									Pomosesh
								</h2>
								<div class="mt-4 flex gap-x-2">
									<button
										type="button"
										class="inline-flex items-center gap-x-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
										onClick={startNow}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="-ml-0.5 size-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
											/>
										</svg>
										4 hours
									</button>
									<button
										type="button"
										class="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50"
										onClick={resetTimer}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="-ml-0.5 size-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
											/>
										</svg>
										Reset
									</button>
									{/* <button onClick={pip}>Pip</button> */}
								</div>
							</div>
							<div class="space-y-6 py-6 text-base leading-7 text-gray-600">
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
												onInput={(e) =>
													setStartTime(e.target.value)
												}
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
												onInput={(e) =>
													setTimer(
														Number(e.target.value),
													)
												}
												id="chunk"
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
												onInput={(e) =>
													setEndTime(e.target.value)
												}
												class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
								</div>
							</div>

							<div class="py-4">
								{/* <div */}
								{/* 	ref={setTimerRef!} */}
								{/* 	style={{ */}
								{/* 		height: '100%', */}
								{/* 		width: '100%', */}
								{/* 		display: 'flex', */}
								{/* 		'flex-direction': 'column', */}
								{/* 		'align-items': 'center', */}
								{/* 		'justify-content': 'center', */}
								{/* 		'background-color': 'white', */}
								{/* 	}} */}
								{/* > */}
								{/* 	<h1 class="text-3xl font-bold underline"> */}
								{/* 		{progress()?.timeLeft} */}
								{/* 	</h1> */}
								{/* 	<div>{progress().status}</div> */}
								{/* </div> */}

								{/* <div */}
								{/* 	ref={setTimerRef!} */}
								{/* 	style={{ */}
								{/* 		height: '100%', */}
								{/* 		width: '100%', */}
								{/* 		display: 'flex', */}
								{/* 		'text-align': 'center', */}
								{/* 		'align-items': 'center', */}
								{/* 		'justify-content': 'center', */}
								{/* 		'flex-direction': 'column', */}
								{/* 		'flex-wrap': 'nowrap', */}
								{/* 		'background-color': 'white', */}
								{/* 		'background-image': */}
								{/* 			'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)', */}
								{/* 		'background-size': '100px 100px', */}
								{/* 	}} */}
								{/* > */}
								{/* 	<div */}
								{/* 		style={{ */}
								{/* 			display: 'flex', */}
								{/* 			'align-items': 'center', */}
								{/* 			'justify-content': 'center', */}
								{/* 		}} */}
								{/* 	> */}
								{/* 		<svg */}
								{/* 			height={80} */}
								{/* 			viewBox="0 0 75 65" */}
								{/* 			fill="black" */}
								{/* 			style={{ margin: '0 75px' }} */}
								{/* 		> */}
								{/* 			<path d="M37.59.25l36.95 64H.64l36.95-64z"></path> */}
								{/* 		</svg> */}
								{/* 	</div> */}
								{/* 	<div */}
								{/* 		style={{ */}
								{/* 			display: 'flex', */}
								{/* 			'font-size': '40', */}
								{/* 			'font-style': 'normal', */}
								{/* 			color: 'black', */}
								{/* 			'margin-top': '30', */}
								{/* 			'line-height': '1.8', */}
								{/* 			'white-space': 'pre-wrap', */}
								{/* 		}} */}
								{/* 	> */}
								{/* 		<b>Vercel Edge Network</b> */}
								{/* 	</div> */}
								{/* </div> */}

								<div class="flex items-center justify-center">
									<div class="relative h-[340px] w-[340px]">
										<div
											class="text-[#0037FF]"
											role="progressbar"
											aria-valuenow="100"
											style="width: 340px; height: 340px; transform: rotate(-90deg);"
										>
											<svg
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
											class="absolute inset-0 text-blue-200"
											role="progressbar"
											aria-valuenow="100"
											style="width: 340px; height: 340px; transform: rotate(-90deg);"
										>
											<svg
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
														'stroke-dasharray':
															'126.92',
														'stroke-dashoffset':
															progress()?.stroke,
													}}
												></circle>
											</svg>
										</div>
										<div class="absolute inset-0 flex items-center justify-center">
											<div class="text-center font-mono text-4xl">
												<div class="text-gray-700">
													{progress()?.timeLeft}
												</div>
												<div class="mt-1 text-gray-400">
													{progress().status}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="pt-8 text-base font-semibold leading-7">
								<ul class="space-y-2.5 font-mono text-sm">
									<For each={active()}>
										{(chunk, _i) => (
											<>
												<li class="relative pb-1">
													<div
														class="absolute bottom-0 left-0 right-0 h-1 w-[--width] rounded-full bg-blue-500 transition-all"
														style={{
															'--width':
																progress()
																	?.index ===
																chunk.idx
																	? progress()
																			?.status
																	: '0%',
														}}
													></div>
													<div>
														Period {chunk.idx + 1}
													</div>
													<div class="flex justify-between">
														<div>Start</div>{' '}
														<div>{chunk.start}</div>
													</div>
													<div class="flex justify-between">
														<div>End</div>{' '}
														<div>{chunk.end}</div>
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
