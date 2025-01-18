import { Title } from '@solidjs/meta';
import {
	addMinutes,
	differenceInSeconds,
	format,
	startOfHour,
	startOfMinute,
} from 'date-fns';
import {
	createMemo,
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
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
import clsx from 'clsx';
import { Logo } from '../components/app-logo';
import { FormSettings, FormSettingsProps } from '../components/form-settings';
import { RadioGroupInput } from '../components/radio-group';

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

	const [formSettings, setFormSettings] = createSignal<FormSettingsProps>({
		startTime: format(startOfHour(new Date()), 'HH:mm'),
		endTime: format(addMinutes(startOfHour(new Date()), 120), 'HH:mm'),
		timer: 25,
		hasBreaks: false,
		breakSpan: 5,
	});

	const [settings, toggleSettings] = createSignal(false);

	// Tick State
	const [check, setCheck] = createSignal(new Date());
	const [togglePictureInPicture, setTogglePictureInPicture] =
		createSignal(false);

	const [timerInterval, setTimerInterval] = createSignal<
		NodeJS.Timeout | string | number | undefined
	>();

	const chunks = createMemo(() => {
		const now = convertTimeToDate(formSettings().startTime);
		const end = convertTimeToDate(formSettings().endTime, now);

		return periods(
			formSettings().timer,
			calculateChunksOfTime(
				formSettings().timer || 1,
				end,
				now,
				formSettings().hasBreaks,
				formSettings().breakSpan,
			),
			now,
			formSettings().hasBreaks,
			formSettings().breakSpan,
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
			timeSlot?.kind === 'work'
				? formSettings().timer * 60
				: formSettings().breakSpan * 60;
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

		if (formSettings().hasBreaks) {
			const elapsedChunks = chunks().filter((chunk) => {
				return chunk.end_timestamp <= check();
			});

			totalConsumedSeconds = elapsedChunks.reduce((acc, chunk) => {
				const chunkTime = differenceInSeconds(
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
		const now = convertTimeToDate(formSettings().startTime);
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
		setFormSettings((val) => ({
			...val,
			startTime: format(startOfMinute(new Date()), 'HH:mm'),
			endTime: format(
				addMinutes(startOfMinute(new Date()), 60 * 4),
				'HH:mm',
			),
		}));
	};

	const startNow = () => {
		setFormSettings((val) => ({
			...val,
			startTime: format(startOfMinute(new Date()), 'HH:mm'),
			endTime: format(
				addMinutes(startOfMinute(new Date()), 60 * 2),
				'HH:mm',
			),
		}));
	};

	const resetTimer = () => {
		setFormSettings((val) => ({
			...val,
			startTime: format(startOfMinute(new Date()), 'HH:mm'),
		}));
	};

	return (
		<>
			<Title>{progress()?.timeLeft || ''}</Title>
			<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
				<Backdrop />
				<div class="relative w-full bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-3xl sm:rounded-lg sm:px-10">
					<div class="mx-auto w-full">
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
										<RadioGroupInput
											selected={selected()}
											setSelected={setSelected}
											options={options}
										/>
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
										<FormSettings
											setFormSettings={setFormSettings}
											formSettings={formSettings}
											isSingle={isSingle}
											playAudio={playAudio}
											setVolume={setVolume}
											toggleSettings={toggleSettings}
										/>
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
										<div class="scrollbars-hidden max-h-[340px] overflow-hidden overflow-y-scroll">
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
																	{chunk.idx +
																		1}
																</div>
																<div class="flex justify-between">
																	<div>
																		Start
																	</div>{' '}
																	<div>
																		{
																			chunk.start
																		}
																	</div>
																</div>
																<div class="flex justify-between">
																	<div>
																		End
																	</div>{' '}
																	<div>
																		{
																			chunk.end
																		}
																	</div>
																</div>
															</li>
														</>
													)}
												</For>
											</ul>
										</div>
									</div>
								</Show>
							</div>
							{/* Footing total time */}
							<div class="mt-16 font-mono text-xs text-gray-500 md:text-center">
								<div>
									{formSettings().startTime} {'→'}{' '}
									{formSettings().endTime}
									<span class="ml-1">•</span>
									<span class="ml-1">{totalTimeLeft()}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
