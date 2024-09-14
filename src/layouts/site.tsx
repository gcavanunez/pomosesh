import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

const SiteLayout = (props: ParentProps) => {
  // let myDiv: HTMLDialogElement;
  let myDiv: HTMLDivElement;
  return (
    <>
      {props.children}
      <div class="bottom-0 fixed right-0 isolate pointer-events-none ">
        <div class="mr-4 mb-4  pointer-events-auto">
          <button
            popovertarget="menu-popover"
            class="inline-flex items-center focus-visible:ring gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none"
          >
            Hey 👋
          </button>
          <div
            id="menu-popover"
            popover
            ref={myDiv!}
            class="p-0 rounded-lg shadow-xl backdrop:bg-gray-800/50  settings-popover max-w-sm min-w-0 w-full"
          >
            {/* open:animate-fade-in */}
            <div class="bg-white rounded-lg overflow-hidden p-6 w-full">
              <div>Hey 👋 also checkout</div>
              <ul class="space-y-2 mt-4">
                <li>
                  <A
                    href="/experiment"
                    onClick={(e) => {
                      myDiv.hidePopover();
                    }}
                    class="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 relative "
                  >
                    <span class="relative">🔬 Experiment</span>
                  </A>
                </li>

                <li class="">
                  <A
                    href="/"
                    onClick={(e) => {
                      myDiv.hidePopover();
                    }}
                    class="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                  >
                    🏠 Home
                  </A>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteLayout;
