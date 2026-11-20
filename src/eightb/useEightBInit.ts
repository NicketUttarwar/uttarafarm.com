import { useEffect, type RefObject } from "react";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(src)), {
        once: true,
      });
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => {
      s.dataset.loaded = "1";
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureLibs(): Promise<void> {
  await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js");
  await loadScript(
    "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js",
  );
  await loadScript(
    "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js",
  );
  await loadScript("https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js");
}

function wireBasics(root: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(".finishes").forEach((sec) => {
    const preview = sec.querySelector<HTMLElement>(".finishes__preview");
    const chips = [...sec.querySelectorAll<HTMLElement>(".chip")];
    if (!preview || !chips.length) return;
    const name = preview.querySelector(".finishes__name");
    const note = preview.querySelector(".finishes__note");
    chips.forEach((chip) => {
      const onClick = () => {
        chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        const sw = chip.querySelector<HTMLElement>(".chip__swatch") || chip;
        ["--tone", "--on"].forEach((v) => {
          const val = sw.style.getPropertyValue(v);
          if (val) preview.style.setProperty(v, val);
        });
        const n = chip.querySelector(".chip__name");
        const t = chip.querySelector(".chip__note");
        if (name && n) name.textContent = n.textContent;
        if (note && t) note.textContent = t.textContent;
      };
      chip.addEventListener("click", onClick);
      cleanups.push(() => chip.removeEventListener("click", onClick));
    });
  });

  root.querySelectorAll<HTMLElement>("[data-chart]").forEach((chart) => {
    chart.querySelectorAll<HTMLElement>(".bar").forEach((bar) => {
      const fill = bar.querySelector<HTMLElement>(".bar__fill");
      const raw = bar.dataset.value || bar.querySelector(".bar__value")?.textContent || "";
      const v = parseFloat(String(raw).replace(/[^\d.]/g, ""));
      if (fill && !Number.isNaN(v)) fill.style.setProperty("--v", String(Math.min(1, v / 100)));
    });
  });

  // Persist numeric bar values for Marathi display
  root.querySelectorAll<HTMLElement>(".bar").forEach((bar, i) => {
    if (!bar.dataset.value) {
      const defaults = ["100", "100", "100", "80"];
      bar.dataset.value = defaults[i] ?? "100";
      const fill = bar.querySelector<HTMLElement>(".bar__fill");
      const v = parseFloat(bar.dataset.value);
      if (fill) fill.style.setProperty("--v", String(v / 100));
    }
  });

  root.querySelectorAll<HTMLFormElement>(".contact__form").forEach((form) => {
    const status = form.querySelector(".contact__status");
    const onSubmit = (e: Event) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status && form.dataset.sent) status.textContent = form.dataset.sent;
      form.reset();
    };
    form.addEventListener("submit", onSubmit);
    cleanups.push(() => form.removeEventListener("submit", onSubmit));
  });

  root.querySelectorAll<HTMLElement>(".foot__word").forEach((el) => {
    const text = (el.textContent || "").trim();
    if (text) el.style.setProperty("--len", String(Math.max(text.length, 6)));
  });

  return () => cleanups.forEach((fn) => fn());
}

function runMotionScript(): () => void {
  const gsap = (window as unknown as { gsap?: { killTweensOf: (t: unknown) => void } }).gsap;
  const ScrollTrigger = (
    window as unknown as {
      ScrollTrigger?: { getAll: () => Array<{ kill: () => void }> };
    }
  ).ScrollTrigger;

  // Original 8B IIFE (scenes + Lenis). Basics already wired above; script also
  // wires menu/chips/form again (idempotent enough for listeners — so we only
  // run the motion half by fetching and evaluating the second IIFE).
  let aborted = false;

  fetch(new URL("./eightb-init.js", import.meta.url))
    .then((r) => r.text())
    .then((code) => {
      if (aborted) return;
      const nl = code.indexOf("\n");
      let motionIife = nl >= 0 ? code.slice(nl + 1) : code;
      // Expose Lenis + clear the fixed header when jumping to #sections.
      motionIife = motionIife
        .replace(
          "lenis=new Lenis({lerp:.1});",
          "lenis=new Lenis({lerp:.1});window.__uttaraLenis=lenis;",
        )
        .replace(
          "lenis.scrollTo(target,{offset:0,duration:1.4})",
          "lenis.scrollTo(target,{offset:-80,duration:1.4})",
        );
      // eslint-disable-next-line no-new-func
      new Function(motionIife)();
    })
    .catch(console.error);

  return () => {
    aborted = true;
    try {
      ScrollTrigger?.getAll?.().forEach((t) => t.kill());
      gsap?.killTweensOf?.("*");
    } catch {
      /* ignore */
    }
    document.documentElement.classList.remove("head-dark", "menu-open");
    document.body.style.overflow = "";
  };
}

/** Boot 8B interactions + scroll motion for the hydrated craft-workshop page. */
export function useEightBInit(
  rootRef: RefObject<HTMLElement | null>,
  locale: string,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("motion", !reduce);

    let basicCleanup: (() => void) | undefined;
    let motionCleanup: (() => void) | undefined;
    let cancelled = false;

    basicCleanup = wireBasics(root);

    if (!reduce) {
      ensureLibs()
        .then(() => {
          if (cancelled) return;
          motionCleanup = runMotionScript();
        })
        .catch(console.error);
    }

    return () => {
      cancelled = true;
      motionCleanup?.();
      basicCleanup?.();
      document.documentElement.classList.remove("motion", "head-dark", "menu-open");
      document.body.style.overflow = "";
    };
  }, [rootRef, locale]);
}
