import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpinMark } from "./SpinMark";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide fixed constellation of tiny rotating marks.
 * Marks sit in depth wrappers so scroll parallax does not fight CSS spin.
 */
export function SiteConstellation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el, i) => {
        const speed = Number(el.dataset.speed ?? (i % 2 === 0 ? 0.12 : -0.1));
        const amp = 40 + Math.abs(speed) * 120;
        gsap.fromTo(
          el,
          { y: amp * (speed < 0 ? -1 : 1) },
          {
            y: -amp * (speed < 0 ? -1 : 1),
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="site-constellation pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div data-depth data-speed="0.14" className="absolute left-[4%] top-[18%] text-sm opacity-25">
        <SpinMark tone="ginger" duration={36} />
      </div>
      <div data-depth data-speed="-0.18" className="absolute right-[5%] top-[32%] text-xs opacity-20">
        <SpinMark tone="forest" duration={28} reverse />
      </div>
      <div data-depth data-speed="0.1" className="absolute left-[8%] top-[62%] text-base opacity-20">
        <SpinMark tone="sky" duration={44} />
      </div>
      <div data-depth data-speed="-0.22" className="absolute right-[7%] top-[70%] text-sm opacity-25">
        <SpinMark tone="ginger" duration={24} reverse />
      </div>
      <div data-depth data-speed="0.08" className="absolute left-[48%] top-[12%] text-xs opacity-15">
        <SpinMark tone="forest" duration={52} />
      </div>
      <div data-depth data-speed="-0.12" className="absolute left-[42%] bottom-[10%] text-sm opacity-20">
        <SpinMark tone="sky" duration={30} reverse />
      </div>
      <div data-depth data-speed="0.2" className="absolute right-[18%] top-[14%] text-[0.65rem] opacity-20">
        <SpinMark tone="forest" duration={40} />
      </div>
      <div data-depth data-speed="-0.16" className="absolute left-[16%] bottom-[16%] text-xs opacity-20">
        <SpinMark tone="ginger" duration={22} />
      </div>
      <span data-depth data-speed="0.06" className="constellation-ring constellation-ring--a" />
      <span data-depth data-speed="-0.08" className="constellation-ring constellation-ring--b" />
      <span data-depth data-speed="0.11" className="drift-slash drift-slash--a" />
      <span data-depth data-speed="-0.09" className="drift-slash drift-slash--b" />
    </div>
  );
}
