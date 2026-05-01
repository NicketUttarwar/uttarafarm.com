import type { ReactNode } from "react";

type DetailAlign = "center" | "leading" | "trailing";

export type LayoutStep = {
  nodeAngleDeg: number;
  detailAngleDeg: number;
  detailAlign: DetailAlign;
  segmentColorIndex: number;
};

export type LayoutSpec = {
  viewBoxSize: number;
  /** Extra margin around the square diagram so labels and arrows are not clipped (symmetric on all sides). */
  padding?: number;
  center: [number, number];
  segmentColors: string[];
  ring: {
    hubFill: string;
    hubStroke: string;
    hubRadius: number;
    innerRadius: number;
    outerRadius: number;
    segmentGapDeg: number;
    guideStroke: string;
    guideDotRadius: number;
  };
  badge: {
    radius: number;
    fill: string;
    stroke: string;
    textClass: string;
  };
  label: {
    radius: number;
    width: number;
    minHeight: number;
  };
  leader: {
    startShrink: number;
    endShrink: number;
  };
  /** Entry arrow targets step 1 (first wedge) by default; numbers are optional tuning in layout.json. */
  entry?: {
    arrowLength?: number;
    tipRadiusShrink?: number;
    /** Fraction of first wedge span (0–1) from wedge start — aim into step 1, not the left side of the ring. */
    firstWedgeBias?: number;
    labelMaxWidth?: number;
    /** Shift label along the arrow (positive = toward tip, in px). */
    labelOffsetAlongArrow?: number;
    /** Shift label perpendicular (negative = above in screen space for a westward arrow). */
    labelOffsetAboveCenter?: number;
  };
  steps: LayoutStep[];
};

export type CircularProcessCopy = {
  centerLine1: string;
  centerLine2: string;
  entryLabel: string;
  steps: { title: string; detail: string }[];
};

type CircularProcessDiagramProps = {
  layout: LayoutSpec;
  copy: CircularProcessCopy;
  className?: string;
};

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = degToRad(deg);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function nextBoundaryDeg(angles: readonly number[], idx: number): number {
  const cur = angles[idx]!;
  if (idx < angles.length - 1) {
    let nxt = angles[idx + 1]!;
    while (nxt <= cur) nxt += 360;
    return nxt;
  }
  let nxt = angles[0]! + 360;
  while (nxt <= cur) nxt += 360;
  return nxt;
}

function annulusSectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a1: number,
  a2: number,
): string {
  const [xOs, yOs] = polar(cx, cy, rOuter, a1);
  const [xOe, yOe] = polar(cx, cy, rOuter, a2);
  const [xIs, yIs] = polar(cx, cy, rInner, a1);
  const [xIe, yIe] = polar(cx, cy, rInner, a2);

  const delta = a2 - a1;
  const largeArcOuter = delta > 180 ? 1 : 0;
  const largeArcInner = delta > 180 ? 1 : 0;

  return [
    `M ${xOs} ${yOs}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcOuter} 1 ${xOe} ${yOe}`,
    `L ${xIe} ${yIe}`,
    `A ${rInner} ${rInner} 0 ${largeArcInner} 0 ${xIs} ${yIs}`,
    "Z",
  ].join(" ");
}

function whiteArrowTipPolygon(cx: number, cy: number, rOuter: number, endDeg: number, spanDeg: number) {
  const arcε = Math.min(1.8, Math.max(0.6, spanDeg * 0.05));
  const [b1x, b1y] = polar(cx, cy, rOuter, endDeg - arcε);
  const [b2x, b2y] = polar(cx, cy, rOuter, endDeg);
  const a = degToRad(endDeg);
  const tx = -Math.sin(a);
  const ty = Math.cos(a);
  const depth = 22;
  const tipX = b2x + tx * depth;
  const tipY = b2y + ty * depth;
  return `${b1x},${b1y} ${b2x},${b2y} ${tipX},${tipY}`;
}

function LabelCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5">
      <p className="text-[12px] font-semibold leading-snug text-forest sm:text-[13px] md:text-[14px]">{title}</p>
      <p className="text-[11px] leading-relaxed text-earth/90 sm:text-[12px] md:text-[13px]">{detail}</p>
    </div>
  );
}

function SvgForeignBody({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div className="box-border flex h-full w-full flex-col rounded-xl border border-forest/12 bg-white/96 p-2.5 sm:p-3 text-earth shadow-[0_2px_12px_rgba(0,0,0,.06)]">
        {children}
      </div>
    </foreignObject>
  );
}

export function CircularProcessDiagram({ layout, copy, className }: CircularProcessDiagramProps) {
  if (copy.steps.length !== layout.steps.length) {
    throw new Error(
      `CircularProcessDiagram: copy.steps (${copy.steps.length}) must match layout.steps (${layout.steps.length})`,
    );
  }

  const [cx, cy] = layout.center;
  const { viewBoxSize, ring, badge, label, leader, segmentColors } = layout;
  const padding = layout.padding ?? 96;
  const vbExtent = viewBoxSize + 2 * padding;
  const angles = layout.steps.map((s) => s.nodeAngleDeg);
  const halfGap = ring.segmentGapDeg / 2;

  const entryOpts = layout.entry ?? {};
  const boundary0 = nextBoundaryDeg(angles, 0);
  const firstSpan = boundary0 - angles[0]!;
  const aimDeg = angles[0]! + firstSpan * (entryOpts.firstWedgeBias ?? 0.2);
  const tipR = ring.outerRadius - (entryOpts.tipRadiusShrink ?? 10);
  const [xTip, yTip] = polar(cx, cy, tipR, aimDeg);
  const arrowLen = entryOpts.arrowLength ?? 230;
  const xStart = xTip - arrowLen;
  const yStart = yTip;
  const labelMaxW = entryOpts.labelMaxWidth ?? 218;
  const along = entryOpts.labelOffsetAlongArrow ?? 12;
  let labelEntryX = xStart + along;
  labelEntryX = Math.max(-padding + 12, Math.min(labelEntryX, vbExtent - padding - labelMaxW - 12));
  const labelEntryY = Math.min(yStart, yTip) + (entryOpts.labelOffsetAboveCenter ?? -54);

  return (
    <div className={`min-w-0 w-full ${className ?? ""}`}>
      <div className="relative mx-auto box-border min-w-0 w-full max-w-[min(940px,calc(100vw-2rem))] overflow-x-auto overflow-y-visible py-9 sm:px-5 sm:py-12 md:py-14">
        <svg
          role="img"
          viewBox={`${-padding} ${-padding} ${vbExtent} ${vbExtent}`}
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-square h-auto w-full max-w-full shrink-0"
          aria-labelledby="how-we-work-diagram-title"
        >
          <title id="how-we-work-diagram-title">{`${copy.centerLine1} ${copy.centerLine2}`}</title>
          <defs>
            <marker
              id="how-we-entry-arrow-head"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={segmentColors[0] ?? "#154a52"} />
            </marker>
          </defs>

          {layout.steps.map((step, idx) => {
            const boundary = nextBoundaryDeg(angles, idx);
            const span = boundary - angles[idx]!;
            const segStart = angles[idx]! + halfGap;
            const segEnd = boundary - halfGap;

            let colorIdx = step.segmentColorIndex % segmentColors.length;
            if (colorIdx < 0) colorIdx += segmentColors.length;
            const fill = segmentColors[colorIdx]!;

            const dPath = annulusSectorPath(cx, cy, ring.outerRadius, ring.innerRadius, segStart, segEnd);

            const midBadge = angles[idx]! + span / 2;
            const [bx, by] = polar(
              cx,
              cy,
              ring.innerRadius + (ring.outerRadius - ring.innerRadius) * 0.44,
              midBadge,
            );

            const arrowPoly = whiteArrowTipPolygon(cx, cy, ring.outerRadius, segEnd, span);

            return (
              <g key={`segment-${idx}`}>
                <path d={dPath} fill={fill} stroke="rgba(255,255,255,0.22)" strokeWidth="1.15" />
                <polygon points={arrowPoly} fill="rgba(248,251,246,0.96)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />

                <circle
                  cx={bx}
                  cy={by}
                  r={badge.radius}
                  fill={badge.fill}
                  stroke={badge.stroke}
                  strokeWidth="2.75"
                  className="drop-shadow-[0_1px_2px_rgba(0,0,0,.12)]"
                />
                <text
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className={`${badge.textClass} select-none`}
                  style={{ fontFamily: "var(--font-sans)", fontFeatureSettings: "'tnum'" }}
                  x={bx}
                  y={by + 0.75}
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}

          <circle
            cx={cx}
            cy={cy}
            r={ring.hubRadius}
            fill={ring.hubFill}
            stroke={ring.hubStroke}
            strokeWidth="2.75"
          />

          <foreignObject x={cx - ring.hubRadius} y={cy - ring.hubRadius} width={ring.hubRadius * 2} height={ring.hubRadius * 2}>
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center">
              <p className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-forest sm:text-[13px]">
                {copy.centerLine1}
              </p>
              <p className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-forest sm:text-[13px]">
                {copy.centerLine2}
              </p>
            </div>
          </foreignObject>

          <line
            x1={xStart}
            y1={yStart}
            x2={xTip}
            y2={yTip}
            stroke={segmentColors[0] ?? "#154a52"}
            strokeWidth="9"
            strokeLinecap="round"
            markerEnd="url(#how-we-entry-arrow-head)"
          />

          <foreignObject x={labelEntryX} y={labelEntryY} width={labelMaxW} height={106}>
            <div className="rounded-lg bg-white/94 px-2 py-1.5 text-[11px] font-semibold leading-snug text-forest shadow-[0_1px_8px_rgba(0,0,0,.1)] sm:text-xs">
              {copy.entryLabel}
            </div>
          </foreignObject>

          {layout.steps.map((step, idx) => {
            const boundary = nextBoundaryDeg(angles, idx);
            const span = boundary - angles[idx]!;
            const midBadge = angles[idx]! + span / 2;

            const [sx, sy] = polar(cx, cy, ring.outerRadius * leader.startShrink, midBadge);

            const [ex, ey] = polar(cx, cy, label.radius * leader.endShrink, step.detailAngleDeg);

            return (
              <g key={`guide-${idx}`}>
                <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={ring.guideStroke} strokeWidth="1.35" strokeLinecap="round" />
                <circle cx={sx} cy={sy} r={ring.guideDotRadius} fill="#fff" stroke={ring.guideStroke} strokeWidth="1.05" />
                <circle cx={ex} cy={ey} r={ring.guideDotRadius} fill="#fff" stroke={ring.guideStroke} strokeWidth="1.05" />
              </g>
            );
          })}

          {layout.steps.map((step, idx) => {
            const da = degToRad(step.detailAngleDeg);
            const lx = cx + label.radius * Math.cos(da);
            const ly = cy + label.radius * Math.sin(da);

            let x = lx - label.width / 2;
            if (step.detailAlign === "leading") x = lx + 8;
            if (step.detailAlign === "trailing") x = lx - label.width - 8;

            const y = ly - label.minHeight / 2;

            return (
              <SvgForeignBody key={`label-${idx}`} x={x} y={y} width={label.width} height={label.minHeight}>
                <LabelCard title={copy.steps[idx]!.title} detail={copy.steps[idx]!.detail} />
              </SvgForeignBody>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
