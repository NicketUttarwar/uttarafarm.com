import { SpinMark } from "./SpinMark";

type AmbientDecorProps = {
  variant?: "light" | "dark";
};

/**
 * Non-content decorative layer: rotating rings, orbiting dots, spinning marks.
 * Depth wrappers keep GSAP parallax from fighting CSS spin transforms.
 */
export function AmbientDecor({ variant = "light" }: AmbientDecorProps) {
  const ring = variant === "dark" ? "border-sand/20" : "border-forest/15";
  const ringSoft = variant === "dark" ? "border-sky/25" : "border-ginger/20";
  const markTone = variant === "dark" ? "sand" : "ginger";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div data-depth data-speed="0.16" className="absolute inset-0">
        <div className={`ambient-ring ambient-ring--lg ${ring}`} />
      </div>
      <div data-depth data-speed="-0.2" className="absolute inset-0">
        <div className={`ambient-ring ambient-ring--md ${ringSoft}`} />
      </div>
      <div data-depth data-speed="0.1" className="absolute inset-0">
        <div className="ambient-orbit">
          <span className="ambient-orbit__dot bg-ginger" />
        </div>
      </div>
      <div data-depth data-speed="-0.12" className="absolute inset-0">
        <div className="ambient-orbit ambient-orbit--slow">
          <span className="ambient-orbit__dot bg-sky" />
        </div>
      </div>
      <div
        data-depth
        data-speed="0.24"
        className="absolute right-[8%] top-[12%] text-2xl opacity-50 sm:text-3xl"
      >
        <SpinMark tone={markTone} duration={32} />
      </div>
      <div
        data-depth
        data-speed="-0.18"
        className="absolute bottom-[18%] left-[6%] text-xl opacity-40 sm:text-2xl"
      >
        <SpinMark
          tone={variant === "dark" ? "sky" : "forest"}
          duration={40}
          reverse
        />
      </div>
    </div>
  );
}
