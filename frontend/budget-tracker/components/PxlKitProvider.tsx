"use client";

import { PxlKitSurfaceProvider } from "@pxlkit/ui-kit";

export default function PxlKitProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PxlKitSurfaceProvider surface="pixel">{children}</PxlKitSurfaceProvider>;
}
