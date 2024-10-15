import { A } from '@solidjs/router';
import { ParentProps } from 'solid-js';
import { Suspense } from 'solid-js';
import { MetaProvider, Title } from '@solidjs/meta';
const SiteLayout = (props: ParentProps) => {
	// let myDiv: HTMLDialogElement;
	let myDiv: HTMLDivElement;
	return (
		<MetaProvider>
			{/* {props.children} */}
			<Title>SolidStart - Basic</Title>
			<Suspense>{props.children}</Suspense>
			<div class="pointer-events-none fixed bottom-0 right-0 isolate">
				<div class="pointer-events-auto mb-4 mr-4">
					<button
						popovertarget="menu-popover"
						class="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none focus-visible:ring"
					>
						Hey 👋
					</button>
					<div
						id="menu-popover"
						popover
						ref={myDiv!}
						class="settings-popover w-full min-w-0 max-w-sm rounded-lg p-0 shadow-xl backdrop:bg-gray-800/50"
					>
						{/* open:animate-fade-in */}
						<div class="w-full overflow-hidden rounded-lg bg-white p-6">
							<div>Hey 👋 also checkout</div>
							<ul class="mt-4 space-y-2">
								<li>
									<A
										href="/experiment"
										onClick={(e) => {
											myDiv.hidePopover();
										}}
										class="group relative flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
									>
										<span class="relative">
											🔬 Experiment
										</span>
									</A>
								</li>

								<li class="">
									<A
										href="/"
										onClick={(e) => {
											myDiv.hidePopover();
										}}
										class="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
									>
										🏠 Home
									</A>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</MetaProvider>
	);
};

export default SiteLayout;
