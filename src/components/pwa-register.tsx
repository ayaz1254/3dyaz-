"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(() => {
          // Registered
        })
        .catch(() => {
          // Registration failed — no big deal
        });
    }
  }, []);

  return null;
}
