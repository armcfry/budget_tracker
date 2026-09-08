"use client";

import Link from "next/link";
import { PixelButton } from "@pxlkit/ui-kit";
import type { Tone, Variant, Size } from "@pxlkit/ui-kit";

// TODO: figure out what this class is for

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  variant?: Variant;
  size?: Size;
};

export default function LinkButton({
  href,
  children,
  tone = "cyan",
  variant = "solid",
  size = "sm",
}: Readonly<LinkButtonProps>) {
  return (
    <PixelButton asChild tone={tone} variant={variant} size={size}>
      <Link href={href}>{children}</Link>
    </PixelButton>
  );
}
