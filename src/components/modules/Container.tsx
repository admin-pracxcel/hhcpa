import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's single content wrapper: 1340px, max-width 100%, 20px inline
 * padding, centred. `.hhcp-container` is defined in globals.css and is the same
 * wrapper the cloned sections use — see PAGE_TOPOLOGY.md, "Layout model".
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("hhcp-container", className)}>{children}</div>;
}
