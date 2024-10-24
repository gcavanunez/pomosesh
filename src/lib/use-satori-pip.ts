import satori from 'satori';
import { html } from 'satori-html';
import { Accessor, createEffect, onCleanup, onMount } from 'solid-js';

async function init() {
	if (typeof window === 'undefined') return [];

	const [font, fontBold, fontIcon] =
		window.__resource ||
		(window.__resource = await Promise.all([
			fetch('/inter-latin-ext-400-normal.woff').then((res) =>
				res.arrayBuffer(),
			),
			fetch('/inter-latin-ext-700-normal.woff').then((res) =>
				res.arrayBuffer(),
			),
			fetch('/material-icons-base-400-normal.woff').then((res) =>
				res.arrayBuffer(),
			),
		]));

	return [
		{
			name: 'Inter',
			data: font,
			weight: 400,
			style: 'normal',
		},
		{
			name: 'Inter',
			data: fontBold,
			weight: 700,
			style: 'normal',
		},
		{
			name: 'Material Icons',
			data: fontIcon,
			weight: 300,
			style: 'normal',
		},
	];
}
const loadFonts = init();

export const useSatoriPip = (
	tick: Accessor<Date>,
	timerRef: Accessor<HTMLDivElement | undefined>,
	myCanvas: Accessor<HTMLCanvasElement | undefined>,
	myVideo: Accessor<HTMLVideoElement | undefined>,
) => {
	const renderFrame = async () => {
		if (!timerRef()) {
			return;
		}
		const fonts = await loadFonts;
		const markup = html(timerRef()?.outerHTML!);

		const svgResult = await satori(markup, {
			width: 640,
			height: 360,
			// @ts-ignore
			fonts,
			embedFont: true,
		});
		if (myCanvas()) {
			const canvas = myCanvas();

			let ctx = canvas!.getContext('2d');
			let DOMURL = window.URL || window.webkitURL || window;
			let image = new Image();
			let svg = new Blob([svgResult], { type: 'image/svg+xml' });
			let url = DOMURL.createObjectURL(svg);
			image.onload = function () {
				ctx!.drawImage(
					image,
					0,
					0,
					myCanvas()!.width,
					myCanvas()!.height,
				);
				DOMURL.revokeObjectURL(url);
			};
			image.src = url;
		}

		console.log('frame');
	};
	onMount(async () => {
		await renderFrame();
		const canvas = myCanvas();
		const video = myVideo()!;

		video.muted = true;
		video.srcObject = canvas!.captureStream();
		await video.play();

		pip();
	});

	createEffect(async () => {
		// hack so that we don't make another setInterval + setInterval would also have some offset
		tick();
		renderFrame();
	});
	onCleanup(() => {
		pip();
	});

	function pip() {
		const video = myVideo()!;

		if (document.pictureInPictureElement) {
			document.exitPictureInPicture();
		} else if (document.pictureInPictureEnabled) {
			video.requestPictureInPicture();
		}
	}

	return {
		pip,
	};
};
