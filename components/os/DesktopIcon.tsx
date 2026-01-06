"use client";

import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  title: string;
  icon: React.ReactNode;
  onDoubleClick?: () => void;
  defaultPosition?: { x: number; y: number };
  className?: string;
}

export function DesktopIcon({
  title,
  icon,
  onDoubleClick,
  defaultPosition = { x: 0, y: 0 },
  className,
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={defaultPosition}
      onStart={() => setIsDragging(true)}
      onStop={() => {
        // Small delay to prevent double click from firing immediately after drag
        setTimeout(() => setIsDragging(false), 100);
      }}
      grid={[80, 80]}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute flex flex-col items-center justify-center gap-1 w-20 h-24 cursor-pointer select-none group",
          isDragging ? "z-50" : "z-10",
          className
        )}
        onDoubleClick={() => {
          if (!isDragging) onDoubleClick?.();
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-background/10 backdrop-blur-md border border-white/10 shadow-lg group-hover:bg-background/20 transition-colors"
        >
          <div className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors">
            {icon}
          </div>
        </motion.div>
        <span className="text-[11px] font-medium text-white drop-shadow-md text-center px-1.5 py-0.5 rounded-lg backdrop-blur-[2px] line-clamp-2 max-w-full">
          {title}
        </span>
      </div>
    </Draggable>
  );
}
