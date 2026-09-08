"use client";

import { PxlKitSurfaceProvider } from "@pxlkit/ui-kit";

// TODO: figure out what this is for
export default function PxlKitProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PxlKitSurfaceProvider surface="pixel">{children}</PxlKitSurfaceProvider>;
}
