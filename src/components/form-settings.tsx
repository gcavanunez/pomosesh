import clsx from 'clsx';
import { Accessor, Setter, Show } from 'solid-js';
import { Button } from './button';
import { CheckboxInput } from './checkbox';

export type FormSettingsProps = {
	startTime: string;
	endTime: string;
	timer: number;
	hasBreaks: boolean;
	breakSpan: number;
	task: string;
};

export function FormSettings(props: {
	formSettings: Accessor<FormSettingsProps>;
	setFormSettings: Setter<FormSettingsProps>;

	isSingle: Accessor<boolean>;

	setVolume: Setter<number>;

	toggleSettings: Setter<boolean>;
	playAudio: () => void;
}) {
	return (
		<div class="relative pb-2 pt-6">
			<div class="relative space-y-6 rounded-lg border px-4 py-6 text-base leading-7 text-gray-600">
				<Show when={!props.isSingle()}>
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
									value={props.formSettings().startTime}
									onInput={(e) =>
										props.setFormSettings((val) => ({
											...val,
											startTime: e.target.value,
										}))
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
									value={props.formSettings().timer}
									onInput={(e) =>
										props.setFormSettings((val) => ({
											...val,
											timer: Number(e.target.value),
										}))
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
									value={props.formSettings().endTime}
									onInput={(e) =>
										props.setFormSettings((val) => ({
											...val,
											endTime: e.target.value,
										}))
									}
									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</Show>

				<div class={clsx(!props.isSingle() && 'border-t pt-4')}>
					<div>
						<div>
							<label
								for="task"
								class="block text-sm font-medium leading-6 text-gray-900"
							>
								Task
							</label>
							<div class="mt-2">
								<input
									type="text"
									name="task"
									id="task"
									value={props.formSettings().task}
									onInput={(e) =>
										props.setFormSettings((val) => ({
											...val,
											task: e.target.value,
										}))
									}
									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</div>
				<div class={clsx('grid grid-cols-2 gap-x-6')}>
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
								onInput={(e) => {
									props.setVolume(Number(e.target.value));
								}}
								max="1"
								step="0.05"
							/>

							<Button onClick={props.playAudio} size={'icon'}>
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
						<CheckboxInput
							checked={props.formSettings().hasBreaks}
							setChecked={(bool) =>
								props.setFormSettings((val) => ({
									...val,
									hasBreaks: !!bool,
								}))
							}
							label="With breaks"
						/>
					</div>
				</div>
			</div>
			<div class="absolute right-2 top-2">
				<Button
					onClick={() => {
						props.toggleSettings((val) => !val);
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
	);
}
