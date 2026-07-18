import * as React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "../../lib/utils";

type PanelProps = HTMLMotionProps<"div"> & {
  delay?: number;
  children?: React.ReactNode;
};

export function Panel({ className, delay = 0, children, ...props }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[28px] border border-white/[0.08] bg-white/[0.045] shadow-premium backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
