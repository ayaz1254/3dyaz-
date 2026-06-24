"use client";

import dynamic from "next/dynamic";

export const DynamicModelViewer = dynamic(
  () => import("./ModelViewer"),
  { ssr: false }
);
