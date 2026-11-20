import {
  createElement,
  type ElementType,
  type ReactNode,
} from "react";
import { useReveal } from "../hooks/useReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
  as?: ElementType;
};

export function Reveal({
  children,
  className = "",
  delay,
  as = "div",
}: RevealProps) {
  const ref = useReveal<HTMLElement>();
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return createElement(
    as,
    {
      ref,
      className: `reveal ${delayClass} ${className}`.trim(),
    },
    children,
  );
}
