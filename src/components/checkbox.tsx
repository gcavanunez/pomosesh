import type { Accessor, JSX, Setter } from 'solid-js';
import { Match, Switch, createSignal } from 'solid-js';
import {
	Checkbox,
	CheckboxDescription,
	CheckboxIndicator,
	CheckboxLabel,
} from 'terracotta';

function CheckIcon(
	props: JSX.IntrinsicElements['svg'] & { title: string },
): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}
		>
			<title>{props.title}</title>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M5 13l4 4L19 7"
			/>
		</svg>
	);
}

function CloseIcon(
	props: JSX.IntrinsicElements['svg'] & { title: string },
): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}
		>
			<title>{props.title}</title>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={2}
				d="M6 18L18 6M6 6l12 12"
			/>
		</svg>
	);
}

function UndefinedIcon(
	props: JSX.IntrinsicElements['svg'] & { title: string },
): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			{...props}
		>
			<title>{props.title}</title>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20 12H4"
			/>
		</svg>
	);
}

export function CheckboxInput(props: {
	checked: boolean;
	setChecked: (val?: boolean) => void;
	label: string;
}): JSX.Element {
	return (
		<Checkbox
			checked={props.checked}
			onChange={(val) => props.setChecked(val)}
			as="div"
			class="flex flex-row items-center space-x-2"
		>
			<CheckboxIndicator class="group size-6 rounded-md border bg-white/10 p-1 ring-1 ring-inset ring-white/15 data-[checked]:bg-white">
				<Switch>
					<Match when={props.checked === undefined}>
						<span class="sr-only">Mixed</span>
						<UndefinedIcon title="Indeterminate" />
					</Match>
					<Match when={props.checked === true}>
						<span class="sr-only">Checked</span>
						<CheckIcon title="Checked" />
					</Match>
					<Match when={props.checked === false}>
						<span class="sr-only">Unchecked</span>
					</Match>
				</Switch>
			</CheckboxIndicator>
			<div class="flex flex-1 flex-col">
				<CheckboxLabel class="">{props.label}</CheckboxLabel>
				{/* <CheckboxDescription class="text-xs font-semibold opacity-50"> */}
				{/* 	This is a checkbox description */}
				{/* </CheckboxDescription> */}
			</div>
		</Checkbox>
	);
}
