import { useEffect } from "react";

export function useKeyPressed(key: string, cb: () => void) {
  useEffect(() => {
    window.addEventListener("keypress", cb);
    return () => window.removeEventListener("keypress", cb);
  }, [key]);
}
