"use client";

import { PixelStatCard } from "@pxlkit/ui-kit";
import type { Tone, Size } from "@pxlkit/ui-kit";

type StatCardProps = {
  label: string;
  value: string;
  tone?: Tone;
  size?: Size;
};

export default function StatCard({ label, value, tone, size = "lg" }: Readonly<StatCardProps>) {
  return <PixelStatCard label={label} value={value} tone={tone} size={size} />;
}
