import clsx from 'clsx';
import { For, JSX } from 'solid-js';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from 'terracotta';

export function RadioGroupInput(props: {
	selected: string;
	setSelected: (val: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<RadioGroup
			value={props.selected}
			onChange={(val) => props.setSelected(val!)}
		>
			{({ isSelected, isActive }): JSX.Element => (
				<>
					<RadioGroupLabel class="sr-only">Workflow</RadioGroupLabel>
					<div class="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
						<For each={props.options}>
							{(plan): JSX.Element => (
								<RadioGroupOption
									value={plan.value}
									class={clsx(
										'inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
									)}
									data-state={
										isSelected(plan.value)
											? 'active'
											: 'inactive'
									}
								>
									<RadioGroupLabel as="p">
										{plan.label}
									</RadioGroupLabel>
								</RadioGroupOption>
							)}
						</For>
					</div>
				</>
			)}
		</RadioGroup>
	);
}
