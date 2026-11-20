type SpinMarkProps = {
  className?: string;
  /** Seconds for one full rotation */
  duration?: number;
  reverse?: boolean;
  tone?: "forest" | "ginger" | "sky" | "sand" | "moss";
};

const toneClass: Record<NonNullable<SpinMarkProps["tone"]>, string> = {
  forest: "text-forest",
  ginger: "text-ginger",
  sky: "text-sky",
  sand: "text-sand",
  moss: "text-moss",
};

/** 8B-style four-point mark that rotates constantly. */
export function SpinMark({
  className = "",
  duration = 28,
  reverse = false,
  tone = "forest",
}: SpinMarkProps) {
  return (
    <svg
      className={`spin-mark ${reverse ? "spin-mark--reverse" : ""} ${toneClass[tone]} ${className}`}
      style={{ ["--spin-duration" as string]: `${duration}s` }}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 1.2 13.7 10.3 22.8 12 13.7 13.7 12 22.8 10.3 13.7 1.2 12 10.3 10.3Z"
      />
    </svg>
  );
}
