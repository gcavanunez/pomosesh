import { Accessor, createEffect, createSignal } from 'solid-js';

export function useSoundNotification(condition: Accessor<boolean>) {
	const audio = new Audio('/notify.mp3');
	const [volume, setVolume] = createSignal(0.5);

	audio.volume = volume();

	createEffect(() => {
		audio.volume = volume();
	});

	createEffect(() => {
		if (condition()) {
			audio.play();
		}
	});
	const play = () => audio.play();

	return [volume, setVolume, play] as const;
}
