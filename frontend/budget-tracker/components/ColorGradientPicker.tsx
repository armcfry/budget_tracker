"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { PixelPopover, cn } from "@pxlkit/ui-kit";

type ColorGradientPickerProps = {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  size?: "sm" | "md";
};

// Re-skins react-colorful's internals (opaque class names it renders itself,
// so plain Tailwind classes on our own JSX can't reach them) to match the
// pixel-art theme: square corners, the app's border token, a square pointer
// instead of the library's default rounded/gray look.
const PICKER_THEME_CLASSES = cn(
  "[&_.react-colorful]:w-40 [&_.react-colorful]:h-40 [&_.react-colorful]:gap-2 [&_.react-colorful]:p-1",
  "[&_.react-colorful]:border-2 [&_.react-colorful]:border-retro-border-strong",
  "[&_.react-colorful__saturation]:rounded-none [&_.react-colorful__saturation]:border-b-0",
  "[&_.react-colorful__hue]:rounded-none [&_.react-colorful__hue]:h-3.5",
  "[&_.react-colorful__last-control]:rounded-none",
  "[&_.react-colorful__pointer]:w-3.5 [&_.react-colorful__pointer]:h-3.5",
  "[&_.react-colorful__pointer]:rounded-none [&_.react-colorful__pointer]:border-2"
);

export default function ColorGradientPicker({
  value,
  onChange,
  label,
  size = "sm",
}: Readonly<ColorGradientPickerProps>) {
  const [open, setOpen] = useState(false);
  const swatchSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <div className="space-y-1.5">
      {label && <span className="block font-mono text-xs text-retro-muted">{label}</span>}
      <PixelPopover open={open} onOpenChange={setOpen}>
        <PixelPopover.Trigger>
          <button
            type="button"
            aria-label={label ? `Change ${label}` : "Change color"}
            title="Change color"
            className={`pxl-corner-sm shrink-0 border-2 border-retro-border-strong ${swatchSize}`}
            style={{ backgroundColor: value }}
          />
        </PixelPopover.Trigger>
        <PixelPopover.Content
          className={cn("flex flex-col gap-2 p-3", PICKER_THEME_CLASSES)}
          style={{ zIndex: 90 }}
        >
          <HexColorPicker color={value} onChange={onChange} />
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 shrink-0 rounded-full border-2 border-retro-border-strong"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-xs text-retro-muted">{value}</span>
          </div>
        </PixelPopover.Content>
      </PixelPopover>
    </div>
  );
}
