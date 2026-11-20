type ParallaxFieldProps = {
  variant?: "light" | "dark";
};

/**
 * Extra 8B-style depth layers: soft discs, slanted bands, and scrub-spun marks.
 * Decorative only — no copy.
 */
export function ParallaxField({ variant = "light" }: ParallaxFieldProps) {
  const soft = variant === "dark" ? "bg-sand/10" : "bg-forest/8";
  const softAlt = variant === "dark" ? "bg-sky/15" : "bg-ginger/10";
  const band = variant === "dark" ? "bg-sand/5" : "bg-sky/15";
  const spin = variant === "dark" ? "border-sand/25" : "border-forest/20";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span
        data-depth
        data-speed="0.18"
        className={`absolute -left-10 top-[8%] h-40 w-40 rounded-full blur-2xl ${soft}`}
      />
      <span
        data-depth
        data-speed="-0.22"
        className={`absolute -right-8 top-[28%] h-52 w-52 rounded-full blur-3xl ${softAlt}`}
      />
      <span
        data-depth
        data-speed="0.3"
        className={`absolute left-[12%] bottom-[12%] h-28 w-28 rounded-full blur-xl ${soft}`}
      />
      <span
        data-depth
        data-speed="-0.14"
        className={`parallax-band absolute -left-[10%] top-[55%] h-24 w-[70%] -rotate-6 ${band}`}
      />
      <span
        data-depth
        data-speed="0.12"
        className={`parallax-band absolute -right-[15%] top-[18%] h-16 w-[55%] rotate-3 ${band}`}
      />
      <span
        data-spin
        className={`absolute right-[10%] top-[14%] h-16 w-16 rounded-full border border-dashed ${spin}`}
      />
      <span
        data-spin
        className={`absolute left-[6%] bottom-[20%] h-10 w-10 rounded-full border ${spin}`}
      />
    </div>
  );
}
