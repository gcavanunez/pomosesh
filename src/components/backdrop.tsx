export function Backdrop() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			class="fixed inset-0"
			viewBox="0 0 700 700"
		>
			<defs>
				<radialGradient id="ffflux-gradient">
					<stop offset="0%" stop-color="hsl(227, 100%, 50%)"></stop>
					<stop offset="100%" stop-color="hsl(0, 0%, 100%)"></stop>
				</radialGradient>
				<filter
					id="ffflux-filter"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
					filterUnits="objectBoundingBox"
					primitiveUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.005 0.003"
						numOctaves="1"
						seed="2"
						stitchTiles="stitch"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						result="turbulence"
					></feTurbulence>
					<feGaussianBlur
						stdDeviation="20 0"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="turbulence"
						// @ts-ignore
						edgeMode="duplicate"
						result="blur"
					></feGaussianBlur>
					<feBlend
						// @ts-ignore
						mode="color-dodge"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="SourceGraphic"
						in2="blur"
						result="blend"
					></feBlend>
				</filter>
			</defs>
			<rect
				width="700"
				height="700"
				fill="url(#ffflux-gradient)"
				filter="url(#ffflux-filter)"
			></rect>
		</svg>
	);
}
