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
      {/* TRACK – píldora alta con brillo y sombras inset */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          // base
          "relative grow overflow-hidden rounded-md border border-white/10 bg-neutral-900/80",
          // tamaño tipo “Opacity” del screenshot
          "data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-11",
          // sombras/relieves
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-6px_14px_rgba(0,0,0,0.6)]",
          // hover
          "transition-all duration-300 ease-out group-hover:border-white/20"
        )}
      >
        {/* RANGE – relleno suave y discreto */}
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute rounded-md data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            "bg-linear-to-r from-white/15 to-white/5",
            "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-white/10"
          )}
        />
      </SliderPrimitive.Track>

      {/* THUMB – barrita blanca con relieve (no círculo) */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            // forma/tamaño del “knob” tipo iOS/macOS
            "h-1 w-2.5 -translate-y-px rounded-md",
            // material
            "bg-linear-to-b from-white to-neutral-200",
            "border border-black/30",
            // relieve/gloss
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.25),0_8px_20px_-8px_rgba(0,0,0,0.8)]",
            // estados
            "transition-transform duration-200 ease-out scale-105 outline-hidden ring-4 ring-white/50",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
