"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn, focusRing, sizeHeight } from "@pxlkit/ui-kit";
import type { Account } from "@/lib/types";

type AccountSelectProps = {
  accounts: Account[];
  name: string;
  defaultValue?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
};

// Bounded + scrollable, same pattern as TransactionsList's panel — keeps the
// dropdown from being clipped by the modal's pixel-corner clip-path instead
// of relying on unbounded growth.
const LIST_MAX_HEIGHT = 192;

export default function AccountSelect({
  accounts,
  name,
  defaultValue = "",
  required,
  size = "sm",
}: Readonly<AccountSelectProps>) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number } | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = accounts.find((account) => String(account.id) === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      setMenuStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <span className="font-mono text-xs text-retro-muted">Account</span>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between bg-retro-surface/40 px-3 outline-none",
          "pxl-corner-sm border-2 border-retro-border-strong font-mono transition-all",
          sizeHeight[size],
          focusRing,
          "focus-visible:ring-retro-border/60"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={cn("truncate", selected ? "text-retro-text" : "text-retro-muted")}>
          {selected?.name ?? "Select an account"}
        </span>
        <span
          className={cn(
            "ml-2 flex-shrink-0 text-retro-muted transition-transform",
            open && "rotate-180"
          )}
        >
          ▾
        </span>
      </button>

      {mounted &&
        open &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              maxHeight: LIST_MAX_HEIGHT,
              zIndex: 100,
            }}
            className="overflow-y-auto rounded-lg border-2 border-retro-border-strong bg-retro-bg p-1 shadow-xl"
          >
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                role="option"
                aria-selected={String(account.id) === value}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2 text-left font-mono text-xs transition-colors",
                  String(account.id) === value
                    ? "bg-retro-cyan/8 text-retro-cyan"
                    : "text-retro-muted",
                  "hover:bg-retro-surface hover:text-retro-text"
                )}
                onClick={() => {
                  setValue(String(account.id));
                  setOpen(false);
                }}
              >
                {account.name}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
