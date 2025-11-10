"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "group relative flex w-full select-none items-center touch-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-md border border-border bg-muted",
          "data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-11",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-6px_14px_rgba(0,0,0,0.6)]",
          "transition-all duration-200 ease-in-out group-hover:border-border/80 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-6px_14px_rgba(0,0,0,0.65)]"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute rounded-md data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "bg-linear-to-r from-muted-foreground/45 to-muted-foreground/5",
            "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-muted-foreground/10",
            "transition-all duration-200 ease-in-out"
          )}
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "h-2 w-3 -translate-y-px rounded-md",
            "bg-muted-foreground",
            "border-2 border-border",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.25),0_8px_20px_-8px_rgba(0,0,0,0.8)]",
            "transition-all duration-150 ease-in-out scale-105 outline-hidden",
            "hover:scale-[1.15] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.3),0_10px_24px_-8px_rgba(0,0,0,0.85),0_0_0_4px_rgba(59,130,246,0.1)]",
            "active:scale-[0.95]",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
