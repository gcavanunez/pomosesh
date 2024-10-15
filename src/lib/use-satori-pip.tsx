import satori from 'satori';
import { html } from 'satori-html';
import { Accessor, createEffect, createSignal, Signal } from 'solid-js';

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
	// const [tickSignal, setTickSignal] = createSignal(tick());
	const [satoriOutput, setSatoriOutput] = createSignal('');

	createEffect(async () => {
		console.log(tick());
		console.log(timerRef());
		if (!timerRef()) {
			return;
		}
		const fonts = await loadFonts;
		const markup = html(timerRef()?.outerHTML!);

		const _result = await satori(markup, {
			width: 640,
			height: 360,
			// @ts-ignore
			fonts,
			embedFont: true,
		});
		if (myCanvas()) {
			let ctx = myCanvas()!.getContext('2d');
			window.ctx = ctx;
			// const dpi = window.devicePixelRatio || 1;
			// myCanvas().width = 800 * dpi;
			// myCanvas().height = 400 * dpi;
			// ctx.scale(dpi, dpi);
			let data = _result;
			let DOMURL = window.URL || window.webkitURL || window;
			let img1 = new Image();
			let svg = new Blob([data], { type: 'image/svg+xml' });
			let url = DOMURL.createObjectURL(svg);
			img1.onload = function () {
				ctx!.drawImage(
					img1,
					0,
					0,
					myCanvas()!.width,
					myCanvas()!.height,
				);
				DOMURL.revokeObjectURL(url);
			};
			img1.src = url;
		}
		// Remove any characters outside the Latin1 range
		// var decoded = unescape(encodeURIComponent(svgString));

		// Now we can use btoa to convert the svg to base64
		console.log({ _result });
		setSatoriOutput(_result);
	});

	function pip() {
		if (!myCanvas()) {
			return;
		}
		if (!myVideo()) {
			return;
		}
		const canvas = myCanvas()!;

		const video = myVideo()!;
		video.muted = true;
		video.srcObject = canvas.captureStream();
		video.addEventListener('loadedmetadata', () => {
			video.requestPictureInPicture();
		});
		video.play();

		// document.getElementById('pip-button').disabled = true;
	}

	return {
		pip,
	};
};
