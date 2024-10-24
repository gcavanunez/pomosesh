import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { JSX, ParentProps } from 'solid-js';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-2xl px-3 text-xs',
				lg: 'h-10 rounded-2xl px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>,
		VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, ...props }: ButtonProps) {
	return (
		<button
			class={clsx(buttonVariants({ variant, size, class: props.class }))}
			{...props}
		/>
	);
}
