"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ColorChip from "./ColorChip";
import ColorGradientPicker from "./ColorGradientPicker";
import { updateTag } from "@/lib/client-api";
import type { Tag } from "@/lib/types";

const DEFAULT_TAG_COLOR = "#71717a"; // zinc-500, matches ColorChip's fallback

type TagInputProps = {
  /** Form field name; renders a hidden comma-joined input under this name. */
  name: string;
  /** All known tags — powers autocomplete, color lookup, and inline recolor. */
  tags: Tag[];
  defaultValue?: string[];
  label?: string;
  placeholder?: string;
};

function splitTagList(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function TagInput({
  name,
  tags,
  defaultValue = [],
  label = "Tags",
  placeholder = "e.g. groceries, rent",
}: Readonly<TagInputProps>) {
  const router = useRouter();
  const inputId = useId();
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [text, setText] = useState("");
  const [colorOverrides, setColorOverrides] = useState<Record<number, string>>({});

  const byNameLower = useMemo(() => {
    const map = new Map<string, Tag>();
    tags.forEach((tag) => map.set(tag.name.toLowerCase(), tag));
    return map;
  }, [tags]);

  function colorFor(tagName: string): string | undefined {
    const known = byNameLower.get(tagName.toLowerCase());
    if (!known) return undefined;
    return colorOverrides[known.id] ?? known.color;
  }

  function addTag(raw: string) {
    const name = raw.trim();
    if (!name) return;
    setSelected((prev) =>
      prev.some((t) => t.toLowerCase() === name.toLowerCase()) ? prev : [...prev, name]
    );
  }

  function removeTag(name: string) {
    setSelected((prev) => prev.filter((t) => t !== name));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(text);
      setText("");
    } else if (event.key === "Backspace" && text === "" && selected.length > 0) {
      setSelected((prev) => prev.slice(0, -1));
    }
  }

  async function handleColorChange(tag: Tag, color: string) {
    const previous = colorOverrides[tag.id];
    setColorOverrides((prev) => ({ ...prev, [tag.id]: color })); // optimistic
    try {
      await updateTag(tag.id, { color });
      // This tag's color is shared everywhere it's used — refresh server data
      // (other chips, transaction lists, filters) so it stays in sync.
      router.refresh();
    } catch {
      setColorOverrides((prev) => ({ ...prev, [tag.id]: previous ?? tag.color ?? DEFAULT_TAG_COLOR }));
    }
  }

  const suggestions = text.trim()
    ? tags
        .filter(
          (tag) =>
            tag.name.toLowerCase().startsWith(text.trim().toLowerCase()) &&
            !selected.some((s) => s.toLowerCase() === tag.name.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="font-mono text-xs text-retro-muted">
        {label}
      </label>
      <div className="relative">
        <div className="pxl-corner-sm flex flex-wrap items-center gap-1.5 border-2 border-retro-border-strong bg-retro-surface/40 px-2 py-1.5">
          {selected.map((tagName) => {
            const known = byNameLower.get(tagName.toLowerCase());
            const chip = (
              <ColorChip label={tagName} color={colorFor(tagName)} onDelete={() => removeTag(tagName)} />
            );
            if (!known) {
              return <span key={tagName}>{chip}</span>;
            }
            return (
              <span key={tagName} className="inline-flex items-center gap-1">
                <ColorGradientPicker
                  value={colorFor(tagName) ?? DEFAULT_TAG_COLOR}
                  onChange={(next) => handleColorChange(known, next)}
                  size="sm"
                />
                {chip}
              </span>
            );
          })}
          <input
            id={inputId}
            type="text"
            value={text}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="min-w-[6rem] flex-1 bg-transparent text-sm text-retro-text outline-none placeholder:text-retro-muted"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border-2 border-retro-border-strong bg-retro-bg p-1 shadow-xl">
            {suggestions.map((tag) => (
              <li key={tag.id}>
                <button
                  type="button"
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-left hover:bg-retro-surface"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    addTag(tag.name);
                    setText("");
                  }}
                >
                  <ColorChip label={tag.name} color={tag.color} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input type="hidden" name={name} value={selected.join(",")} />
    </div>
  );
}
