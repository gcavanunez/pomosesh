import { Title } from '@solidjs/meta';
import {
	addMinutes,
	differenceInMinutes,
	differenceInSeconds,
	endOfHour,
	format,
	startOfDay,
	startOfHour,
	startOfMinute,
} from 'date-fns';
import {
	Accessor,
	createMemo,
	createSignal,
	For,
	JSX,
	Match,
	onCleanup,
	onMount,
	ParentProps,
	Setter,
	Show,
	Switch,
} from 'solid-js';
import {
	calculateChunksOfTime,
	convertTimeToDate,
	formatSecondsToMinutes,
	periods,
	secondsToMinutesAndSeconds,
} from '../lib/date-utils';

import { Backdrop } from '../components/backdrop';
import { Button } from '../components/button';
import { HackyPictureInPictureEl } from '../components/picture-in-picture';
import { useSoundNotification } from '../lib/use-sound-notification';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from 'terracotta';
import clsx from 'clsx';

// function SettingsForm(props: {
// 	isSingle: Accessor<boolean>;
// 	startTime: Accessor<string>;
// 	setStartTime: Setter<string>;
// 	playAudio: () => void;
// }) {
// 	return (
// 		<div class="relative pb-2 pt-6">
// 			<div class="relative space-y-6 rounded-lg border px-4 py-6 text-base leading-7 text-gray-600">
// 				<Show when={!props.isSingle()}>
// 					<div>
// 						<div>
// 							<label
// 								for="starttime"
// 								class="block text-sm font-medium leading-6 text-gray-900"
// 							>
// 								Start time
// 							</label>
// 							<div class="mt-2">
// 								<input
// 									type="time"
// 									name="starttime"
// 									id="starttime"
// 									value={props.startTime()}
// 									onInput={(e) =>
// 										props.setStartTime(e.target.value)
// 									}
// 									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 					<div class="grid grid-cols-2 gap-x-6">
// 						<div>
// 							<label
// 								for="chunk"
// 								class="block text-sm font-medium leading-6 text-gray-900"
// 							>
// 								Chunk of time
// 							</label>
// 							<div class="mt-2">
// 								<input
// 									type="number"
// 									name="chunk"
// 									value={timer()}
// 									onInput={(e) =>
// 										setTimer(Number(e.target.value))
// 									}
// 									id="chunk"
// 									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
// 									placeholder="25"
// 								/>
// 							</div>
// 						</div>
// 						<div>
// 							<label
// 								for="email"
// 								class="block text-sm font-medium leading-6 text-gray-900"
// 							>
// 								End time
// 							</label>
// 							<div class="mt-2">
// 								<input
// 									type="time"
// 									name="endtime"
// 									id="endtime"
// 									value={endTime()}
// 									onInput={(e) => setEndTime(e.target.value)}
// 									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 				</Show>

// 				<div
// 					class={clsx(
// 						!props.isSingle() && 'border-t pt-4',
// 						'grid grid-cols-2 gap-x-6',
// 					)}
// 				>
// 					<div>
// 						<label
// 							for="volume"
// 							class="block text-sm font-medium leading-6 text-gray-900"
// 						>
// 							Volume
// 						</label>

// 						<div class="mt-2 flex flex-col space-y-2">
// 							<input
// 								id="volume"
// 								type="range"
// 								min="0"
// 								onInput={(e) => {
// 									setVolume(Number(e.target.value));
// 								}}
// 								max="1"
// 								step="0.05"
// 							/>

// 							<Button onClick={playAudio} size={'icon'}>
// 								<svg
// 									xmlns="http://www.w3.org/2000/svg"
// 									fill="none"
// 									viewBox="0 0 24 24"
// 									stroke-width="1.5"
// 									stroke="currentColor"
// 									class="size-5"
// 								>
// 									<path
// 										stroke-linecap="round"
// 										stroke-linejoin="round"
// 										d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
// 									/>
// 								</svg>
// 							</Button>
// 						</div>
// 					</div>
// 					<div>
// 						<label class="inline-flex items-center">
// 							<input
// 								type="checkbox"
// 								class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:ring-offset-0"
// 								onChange={() => setHasBreaks((val) => !val)}
// 							/>
// 							<span class="ml-2">With breaks</span>
// 						</label>
// 					</div>
// 				</div>
// 			</div>
// 			<div class="absolute right-2 top-2">
// 				<Button
// 					onClick={() => {
// 						toggleSettings((val) => !val);
// 					}}
// 					size={'sm'}
// 				>
// 					<svg
// 						xmlns="http://www.w3.org/2000/svg"
// 						fill="none"
// 						viewBox="0 0 24 24"
// 						stroke-width="1.5"
// 						stroke="currentColor"
// 						class="mr-2 size-4"
// 					>
// 						<path
// 							stroke-linecap="round"
// 							stroke-linejoin="round"
// 							d="m4.5 12.75 6 6 9-13.5"
// 						/>
// 					</svg>
// 					Save
// 				</Button>
// 			</div>
// 		</div>
// 	);
// }
function Logo() {
	return (
		<div class="flex items-center gap-x-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
				/>
				<rect
					width="2"
					height="7"
					x="11"
					y="6"
					fill="currentColor"
					rx="1"
				>
					<animateTransform
						attributeName="transform"
						dur="9s"
						repeatCount="indefinite"
						type="rotate"
						values="0 12 12;360 12 12"
					/>
				</rect>
				<rect
					width="2"
					height="9"
					x="11"
					y="11"
					fill="currentColor"
					rx="1"
				>
					<animateTransform
						attributeName="transform"
						dur="0.75s"
						repeatCount="indefinite"
						type="rotate"
						values="0 12 12;360 12 12"
					/>
				</rect>
			</svg>
			<h2 class="font-mono text-2xl font-semibold leading-7 text-gray-900">
				Pomosesh
			</h2>
		</div>
	);
}

const SINGLE = 'single';
const WORKFLOW = 'workflow';
const options = [
	{
		value: SINGLE,
		label: 'Single',
	},
	{
		value: WORKFLOW,
		label: 'Workflow',
	},
];

export default function Page() {
	const [selected, setSelected] = createSignal(WORKFLOW);

	const isSingle = createMemo(() => selected() === SINGLE);

	const [startTime, setStartTime] = createSignal(
		format(startOfHour(new Date()), 'HH:mm'),
	);
	const [hasBreaks, setHasBreaks] = createSignal(false);
	const [breakSpan, setBreakSpan] = createSignal(5);

	const [endTime, setEndTime] = createSignal(
		format(addMinutes(startOfHour(new Date()), 120), 'HH:mm'),
	);
	const [settings, toggleSettings] = createSignal(false);

	const [timer, setTimer] = createSignal(25);
	const [check, setCheck] = createSignal(new Date());
	const [togglePictureInPicture, setTogglePictureInPicture] =
		createSignal(false);

	const [timerInterval, setTimerInterval] = createSignal<
		NodeJS.Timeout | string | number | undefined
	>();

	const chunks = createMemo(() => {
		const now = convertTimeToDate(startTime());
		const end = convertTimeToDate(endTime(), now);

		return periods(
			timer(),
			calculateChunksOfTime(
				timer() || 1,
				end,
				now,
				hasBreaks(),
				breakSpan(),
			),
			now,
			hasBreaks(),
			breakSpan(),
		).map((p, i) => ({
			idx: i,
			kind: p.kind,
			start: format(p.start, 'hh:mm a'),
			start_timestamp: p.start,
			end: format(p.end, 'hh:mm a'),
			end_timestamp: p.end,
		}));
	});

	const progress = createMemo(() => {
		const timeSlot = chunks().find((c) => {
			const start = c.start_timestamp;
			const end = c.end_timestamp;

			return check() >= start && check() <= end;
		});

		const timerInSeconds =
			timeSlot?.kind === 'work' ? timer() * 60 : breakSpan() * 60;
		const timeSlotIndex = timeSlot?.idx;

		// if no time slot is found given it may be the complete start
		if (timeSlotIndex === undefined) {
			return {
				timePassed: 0,
				index: 0,
				status: 100 + '%',
				stroke: 126.92 + 'px',
				timeLeft: secondsToMinutesAndSeconds(timerInSeconds),
			};
		}

		let totalConsumedSeconds = timeSlotIndex * timerInSeconds;

		if (hasBreaks()) {
			const elapsedChunks = chunks().filter((chunk) => {
				return chunk.start_timestamp <= check();
			});

			totalConsumedSeconds = elapsedChunks.reduce((acc, chunk) => {
				const chunkTime = differenceInMinutes(
					chunk.end_timestamp,
					chunk.start_timestamp,
				);
				return acc + chunkTime;
			}, 0);
		}

		const diff = differenceInSeconds(check(), timeSlot!.start_timestamp);

		const timeLeft = secondsToMinutesAndSeconds(timerInSeconds - diff);

		return {
			timePassed: diff + totalConsumedSeconds,
			index: timeSlotIndex,
			status: Math.floor((diff / timerInSeconds) * 100) + '%',
			stroke: Math.floor((diff / timerInSeconds) * 126.92) + 'px',
			timeLeft,
		};
	});

	const realEndTime = createMemo(() => {
		return chunks().at(-1)?.end_timestamp;
	});
	const totalTimeLeft = createMemo(() => {
		const now = convertTimeToDate(startTime());
		const end = realEndTime();
		if (!end) {
			return 'n/a';
		}
		const totalSeconds = differenceInSeconds(end, now);
		return formatSecondsToMinutes(totalSeconds - progress()?.timePassed);
	});

	const ring = createMemo(
		() => progress()?.status === `0%` && progress()?.index !== 0,
	);

	const [_volume, setVolume, playAudio] = useSoundNotification(ring);

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

	const fourHourChunk = () => {
		setStartTime(format(startOfMinute(new Date()), 'HH:mm'));
		setEndTime(
			format(addMinutes(startOfMinute(new Date()), 60 * 4), 'HH:mm'),
		);
	};

	const startNow = () => {
		setStartTime(format(startOfMinute(new Date()), 'HH:mm'));
		setEndTime(
			format(addMinutes(startOfMinute(new Date()), 60 * 2), 'HH:mm'),
		);
	};

	const resetTimer = () => {
		setStartTime(format(startOfMinute(new Date()), 'HH:mm'));
	};

	return (
		<>
			<Title>{progress()?.timeLeft || ''}</Title>
			<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
				<Backdrop />
				<div class="relative w-full bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-3xl sm:rounded-lg sm:px-10">
					<div class="mx-auto w-full">
						{/* divide-y divide-gray-300/50 */}
						<div class="">
							<div class="py-6">
								<Switch fallback={<div></div>}>
									<Match
										when={togglePictureInPicture() === true}
									>
										<HackyPictureInPictureEl
											progress={progress}
											check={check}
										/>
									</Match>
								</Switch>

								<div class="flex items-center justify-between">
									<Logo />
									<div>
										<RadioGroup
											value={selected()}
											onChange={setSelected}
										>
											{({
												isSelected,
												isActive,
											}): JSX.Element => (
												<>
													<RadioGroupLabel class="sr-only">
														Workflow
													</RadioGroupLabel>
													<div class="inline-flex h-10 w-full rounded-lg bg-gray-800/5 p-1 lg:max-w-96">
														<For each={options}>
															{(
																plan,
															): JSX.Element => (
																<RadioGroupOption
																	value={
																		plan.value
																	}
																	class={clsx(
																		isSelected(
																			plan.value,
																		)
																			? 'bg-white text-gray-800 shadow-sm'
																			: 'border-transparent',
																		'flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 font-medium text-gray-600 hover:text-gray-800',
																	)}
																>
																	<RadioGroupLabel as="p">
																		{
																			plan.label
																		}
																	</RadioGroupLabel>
																</RadioGroupOption>
															)}
														</For>
													</div>
												</>
											)}
										</RadioGroup>
									</div>
								</div>
								<div class="mt-4 flex flex-col gap-x-2 md:flex-row md:items-center">
									<div class="flex gap-x-2">
										<Button onClick={startNow}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="mr-2 size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
												/>
											</svg>
											2 hours
										</Button>
										<Button
											onClick={fourHourChunk}
											variant={'secondary'}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="mr-2 size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
												/>
											</svg>
											4 hours
										</Button>

										<Button
											onClick={resetTimer}
											variant={'ghost'}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="mr-2 size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
												/>
											</svg>
											Reset
										</Button>
										<Button
											onClick={() =>
												setTogglePictureInPicture(
													(val) => !val,
												)
											}
											variant={'ghost'}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="mr-2 size-5"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
												/>
											</svg>
											Pip
										</Button>
									</div>

									<div class="ml-auto hidden h-6 w-[1px] bg-gray-300/50 md:block" />

									<div class="mt-4 font-mono text-xs text-gray-500 md:ml-1 md:mt-0 md:text-right">
										<div>
											{startTime()} {'→'} {endTime()}
											<span class="ml-1">•</span>
											<span class="ml-1">
												{totalTimeLeft()}
											</span>
										</div>
									</div>
								</div>
							</div>
							<div
								class={clsx(
									!isSingle() && 'md:grid md:grid-cols-3',
									'w-full gap-8 border-t border-gray-300/50',
								)}
							>
								<div class="col-span-2 col-start-2">
									<Show when={settings()}>
										<div class="relative pb-2 pt-6">
											<div class="relative space-y-6 rounded-lg border px-4 py-6 text-base leading-7 text-gray-600">
												<Show when={!isSingle()}>
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
																	onInput={(
																		e,
																	) =>
																		setStartTime(
																			e
																				.target
																				.value,
																		)
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
																	onInput={(
																		e,
																	) =>
																		setTimer(
																			Number(
																				e
																					.target
																					.value,
																			),
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
																	onInput={(
																		e,
																	) =>
																		setEndTime(
																			e
																				.target
																				.value,
																		)
																	}
																	class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
																/>
															</div>
														</div>
													</div>
												</Show>

												<div
													class={clsx(
														!isSingle() &&
															'border-t pt-4',
														'grid grid-cols-2 gap-x-6',
													)}
												>
													<div>
														<label
															for="volume"
															class="block text-sm font-medium leading-6 text-gray-900"
														>
															Volume
														</label>

														<div class="mt-2 flex flex-col space-y-2">
															<input
																id="volume"
																type="range"
																min="0"
																onInput={(
																	e,
																) => {
																	setVolume(
																		Number(
																			e
																				.target
																				.value,
																		),
																	);
																}}
																max="1"
																step="0.05"
															/>

															<Button
																onClick={
																	playAudio
																}
																size={'icon'}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke-width="1.5"
																	stroke="currentColor"
																	class="size-5"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
																	/>
																</svg>
															</Button>
														</div>
													</div>
													<div>
														<label class="inline-flex items-center">
															<input
																type="checkbox"
																class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:ring-offset-0"
																onChange={() =>
																	setHasBreaks(
																		(val) =>
																			!val,
																	)
																}
															/>
															<span class="ml-2">
																With breaks
															</span>
														</label>
													</div>
												</div>
											</div>
											<div class="absolute right-2 top-2">
												<Button
													onClick={() => {
														toggleSettings(
															(val) => !val,
														);
													}}
													size={'sm'}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="mr-2 size-4"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="m4.5 12.75 6 6 9-13.5"
														/>
													</svg>
													Save
												</Button>
											</div>
										</div>
									</Show>

									<div class="py-4">
										<div class="relative flex items-center justify-center">
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
																	progress()
																		?.stroke,
															}}
														></circle>
													</svg>
												</div>
												<div class="absolute inset-0 flex items-center justify-center">
													<div class="text-center font-mono text-4xl">
														<div class="text-gray-700">
															{
																progress()
																	?.timeLeft
															}
														</div>
														<div class="mt-1 text-gray-400">
															{progress().status}
														</div>
													</div>
												</div>
											</div>

											<div class="absolute right-2 top-2">
												<Button
													variant={'outline'}
													onClick={() => {
														toggleSettings(
															(val) => !val,
														);
													}}
													size={'icon'}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="size-5"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
														/>
													</svg>
												</Button>
											</div>
										</div>
									</div>
								</div>
								<Show when={!isSingle()}>
									<div class="col-span-1 col-start-1 row-start-1 grid-rows-1 pt-8 text-base font-semibold leading-7">
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
																Period{' '}
																{chunk.kind}{' '}
																{chunk.idx + 1}
															</div>
															<div class="flex justify-between">
																<div>Start</div>{' '}
																<div>
																	{
																		chunk.start
																	}
																</div>
															</div>
															<div class="flex justify-between">
																<div>End</div>{' '}
																<div>
																	{chunk.end}
																</div>
															</div>
														</li>
													</>
												)}
											</For>
										</ul>
									</div>
								</Show>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
