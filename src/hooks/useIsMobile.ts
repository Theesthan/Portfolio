"use client";

import { useState, useEffect } from "react";

/**
 * Detect mobile / low-capability devices that shouldn't run WebGL.
 * Returns true if mobile-width or backdrop-filter not supported.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const narrow = window.innerWidth < 768;
      const noBackdrop = !CSS.supports("backdrop-filter", "blur(10px)");
      setIsMobile(narrow || noBackdrop);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
