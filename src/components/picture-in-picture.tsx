import { Accessor, createSignal, ParentProps } from 'solid-js';
import { useSatoriPip } from '../lib/use-satori-pip';

export function HackyPictureInPictureEl(
	props: ParentProps<{
		check: Accessor<Date>;
		progress: Accessor<{
			index: number;
			status: string;
			stroke: string;
			timeLeft: string;
		}>;
	}>,
) {
	const [timerRef, setTimerRef] = createSignal<HTMLDivElement | undefined>();
	const [myCanvas, setMyCanvas] = createSignal<
		HTMLCanvasElement | undefined
	>();
	const [myVideo, setMyVideo] = createSignal<HTMLVideoElement | undefined>();

	useSatoriPip(props.check, timerRef, myCanvas, myVideo);

	return (
		<div class="md:hidden">
			<div class="flex flex-col items-center">
				<canvas
					ref={setMyCanvas!}
					class="hidden aspect-video"
					width={1280}
					height={720}
				/>
				<video ref={setMyVideo!} class="aspect-video" controls />
			</div>
			<div class="hidden">
				<div
					ref={setTimerRef!}
					style={{
						position: 'relative',
						display: 'flex',
						height: '100%',
						width: '100%',
						'align-items': 'center',
						'justify-content': 'center',
						'letter-spacing': '-.02em',
						'font-weight': 700,
						background: 'white',
					}}
				>
					<div
						style={{
							right: '0px',
							left: '0px',
							top: '42px',
							position: 'absolute',
							display: 'flex',
							'align-items': 'center',
						}}
					>
						<span
							style={{
								width: '24px',
								height: '24px',
								background: 'black',
							}}
						/>
						<span
							style={{
								'margin-left': '8px',
								'line-height': 1.4,
								'font-size': '32px',
							}}
						>
							The Thing! do the thing!!
						</span>
					</div>
					<div
						style={{
							display: 'flex',
							'flex-wrap': 'wrap',
							'justify-content': 'center',
							padding: '20px 50px',
							margin: '0 42px',
							'font-size': '90px',
							width: 'auto',
							'max-width': '550px',
							'text-align': 'center',
							'background-color': 'black',
							color: 'white',
							'line-height': 1.4,
						}}
					>
						{props.progress()?.timeLeft}
					</div>
				</div>
			</div>
		</div>
	);
}
