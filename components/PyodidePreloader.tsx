"use client";

import { useEffect } from "react";
import { getPyodide } from "@/lib/pyodide";

export default function PyodidePreloader() {
  useEffect(() => {
    const load = () => { getPyodide().catch(() => {}); };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(load, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(load, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
