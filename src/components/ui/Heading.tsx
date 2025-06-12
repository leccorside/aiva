import { ReactNode } from "react";
import { cn } from "../../utils/cn";
import type { JSX } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const base = "font-bold text-gray-900";

  const sizes: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  return <Tag className={cn(base, sizes[level], className)}>{children}</Tag>;
}
