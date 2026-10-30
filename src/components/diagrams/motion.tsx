"use client";

import type { ComponentProps } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FlowPathProps = Omit<ComponentProps<typeof motion.path>, "animate" | "transition"> & {
  duration?: number;
  distance?: number;
};

type PulseGroupProps = Omit<ComponentProps<typeof motion.g>, "animate" | "transition"> & {
  duration?: number;
  delay?: number;
};

export function FlowPath({ duration = 2, distance = 14, ...props }: FlowPathProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.path
      {...props}
      initial={false}
      animate={reduceMotion ? undefined : { strokeDashoffset: -distance }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function PulseGroup({ duration = 3.6, delay = 0, ...props }: PulseGroupProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.g
      {...props}
      initial={false}
      animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
