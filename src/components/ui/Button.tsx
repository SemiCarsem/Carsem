import * as React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "../../lib/utils";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children?: React.ReactNode;
};

export function Button({ className, variant = "primary", children, type = "button", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-white text-black hover:bg-white/92 shadow-[0_16px_40px_rgba(255,255,255,0.08)]",
    secondary:
      "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]",
    ghost: "text-white/70 hover:bg-white/[0.07] hover:text-white",
    danger: "bg-danger/15 text-danger hover:bg-danger/20"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold outline-none transition-all duration-300 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
}
