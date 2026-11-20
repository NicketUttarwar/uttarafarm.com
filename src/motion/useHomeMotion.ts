import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Port of the 8B GSAP scenes that fit our bilingual Home layout. */
export function useHomeMotion(
  rootRef: RefObject<HTMLElement | null>,
  locale: string,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("js-motion", !reduce);

    if (reduce) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Entrance reveals (8B expo.out)
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: "expo.out",
            clearProps: "transform",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      // Staggered children (offer cards, tools, join plans)
      root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((list) => {
        const kids = Array.from(list.children) as HTMLElement[];
        if (!kids.length) return;
        gsap.fromTo(
          kids,
          { yPercent: 14, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "expo.out",
            stagger: 0.12,
            clearProps: "transform",
            immediateRender: false,
            scrollTrigger: {
              trigger: list,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });

      // Headline stretch scrub (locale-safe)
      root.querySelectorAll<HTMLElement>("[data-stretch]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.25, letterSpacing: locale === "mr" ? "0.05em" : "-0.08em" },
          {
            opacity: 1,
            letterSpacing: locale === "mr" ? "0.01em" : "-0.04em",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 45%",
              scrub: true,
            },
          },
        );
      });

      // Image clip + parallax (8B data-parallax)
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((box) => {
        const img = box.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          box,
          { clipPath: "inset(16% 7% 0% 7%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: box,
              start: "top 92%",
              end: "top 42%",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.18 },
          {
            yPercent: 8,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: box,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Depth layers — different scroll speeds (8B multi-plane feel)
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        const speed = Number(el.dataset.speed ?? "0.2");
        const amp = Math.round(window.innerHeight * Math.min(Math.abs(speed), 0.45) * 0.35);
        const dir = speed < 0 ? -1 : 1;
        gsap.fromTo(
          el,
          { y: amp * dir },
          {
            y: -amp * dir,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Scroll-scrubbed spin marks (8B data-spin)
      root.querySelectorAll<HTMLElement>("[data-spin]").forEach((el) => {
        gsap.fromTo(
          el,
          { rotation: -90 },
          {
            rotation: 90,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Alternating card-rail parallax (8B crew pattern)
      // Prefer inner [data-parallax-card] so entrance stagger can clearProps safely.
      root.querySelectorAll<HTMLElement>("[data-parallax-rail]").forEach((rail) => {
        const items = Array.from(rail.children) as HTMLElement[];
        const cards = items.map(
          (item) => item.querySelector<HTMLElement>("[data-parallax-card]") ?? item,
        );
        if (cards.length < 2) return;
        let amps: number[] = [];
        const measure = () => {
          const lefts = [...new Set(items.map((c) => c.offsetLeft))].sort((a, b) => a - b);
          amps = items.map((c) => (lefts.indexOf(c.offsetLeft) % 2 ? 56 : 18));
        };
        measure();
        gsap.fromTo(
          cards,
          { y: (i) => amps[i] * 0.5 },
          {
            y: (i) => -amps[i] * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: rail,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
            },
          },
        );
      });

      // Contact art CSS-variable shift (8B contact-art)
      root.querySelectorAll<HTMLElement>("[data-contact-art]").forEach((art) => {
        gsap.fromTo(
          art,
          { "--shift": "-60px" } as gsap.TweenVars,
          {
            "--shift": "60px",
            ease: "none",
            scrollTrigger: {
              trigger: art,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          } as gsap.TweenVars,
        );
      });

      // Season path line + steps
      const path = root.querySelector<HTMLElement>("[data-path]");
      if (path) {
        const line = path.querySelector<HTMLElement>("[data-path-line]");
        const steps = Array.from(path.querySelectorAll<HTMLElement>("[data-path-step]"));
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: path,
                start: "top 75%",
                end: "bottom 35%",
                scrub: true,
              },
            },
          );
        }
        steps.forEach((step) => {
          gsap.fromTo(
            step,
            { x: 20, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.95,
              ease: "expo.out",
              clearProps: "transform",
              immediateRender: false,
              scrollTrigger: {
                trigger: step,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true,
              },
            },
          );
          const dot = step.querySelector<HTMLElement>("[data-path-dot]");
          if (dot) {
            gsap.fromTo(
              dot,
              { scale: 0.35 },
              {
                scale: 1,
                ease: "back.out(1.9)",
                scrollTrigger: {
                  trigger: step,
                  start: "top 88%",
                  toggleActions: "play none none none",
                  once: true,
                },
              },
            );
          }
        });
      }

      const kharif = root.querySelector<HTMLElement>("[data-kharif]");
      if (kharif) {
        gsap.fromTo(
          kharif,
          { y: 44, autoAlpha: 0, rotate: -0.5 },
          {
            y: 0,
            autoAlpha: 1,
            rotate: 0,
            duration: 1.2,
            ease: "expo.out",
            clearProps: "transform",
            immediateRender: false,
            scrollTrigger: {
              trigger: kharif,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }

      // Desktop pinned hero scrub (8B)
      mm.add("(min-width: 900px)", () => {
        const hero = root.querySelector<HTMLElement>("[data-hero]");
        const frame = root.querySelector<HTMLElement>("[data-hero-frame]");
        const word = root.querySelector<HTMLElement>("[data-hero-word]");
        const facts = root.querySelector<HTMLElement>("[data-hero-facts]");
        const cap = root.querySelector<HTMLElement>("[data-hero-cap]");
        const img = frame?.querySelector("img");
        if (!hero || !frame) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 0.85)}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          frame,
          { clipPath: "inset(12% 6% 0% 6%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
          0,
        );
        if (img) tl.fromTo(img, { scale: 1 }, { scale: 1.12, duration: 1 }, 0);
        if (word) tl.to(word, { yPercent: 32, duration: 0.75 }, 0);
        if (facts) tl.to(facts, { yPercent: -42, autoAlpha: 0, duration: 0.4 }, 0);
        if (cap) tl.to(cap, { y: () => -window.innerHeight * 0.05, duration: 1 }, 0);
      });

      // Soft orbs: scroll-linked parallax
      root.querySelectorAll<HTMLElement>("[data-orb]").forEach((orb, i) => {
        gsap.fromTo(
          orb,
          { yPercent: i % 2 === 0 ? 16 : -14, xPercent: i % 3 === 0 ? -4 : 3 },
          {
            yPercent: i % 2 === 0 ? -22 : 18,
            xPercent: i % 3 === 0 ? 5 : -4,
            ease: "none",
            scrollTrigger: {
              trigger: orb.parentElement ?? orb,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready?.then(refresh);
    requestAnimationFrame(() => {
      refresh();
      requestAnimationFrame(refresh);
    });

    return () => {
      document.documentElement.classList.remove("js-motion");
      ctx.revert();
    };
  }, [locale, rootRef]);
}
