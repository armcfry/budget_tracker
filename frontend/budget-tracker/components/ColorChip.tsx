"use client";

import { getComplementaryBorderColor, getReadableTextColor } from "@/lib/color";

type ColorChipProps = {
  label: string;
  color?: string;
  size?: "sm" | "md";
  onClick?: () => void;
  onDelete?: () => void;
};

const DEFAULT_TAG_COLOR = "#71717a"; // zinc-500, used when a tag has no color

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

export default function ColorChip({
  label,
  color,
  size = "sm",
  onClick,
  onDelete,
}: Readonly<ColorChipProps>) {
  const background = color ?? DEFAULT_TAG_COLOR;
  const text = getReadableTextColor(background);
  const border = getComplementaryBorderColor(background);

  const className = `pxl-corner-sm inline-flex items-center border-2 font-pixel tracking-wide ${SIZE_CLASSES[size]} ${
    onClick ? "cursor-pointer transition-opacity hover:opacity-85" : ""
  }`;
  const style = { backgroundColor: background, borderColor: border, color: text };

  const content = (
    <>
      <span>{label}</span>
      {onDelete && (
        <button
          type="button"
          className="leading-none"
          style={{ color: text }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} style={style} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <span className={className} style={style}>
      {content}
    </span>
  );
}
