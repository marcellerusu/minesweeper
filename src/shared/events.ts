import { useEffect } from "react";

export function useWindowEvent<K extends keyof WindowEventMap>(
  kind: K,
  cb: (e: WindowEventMap[K]) => void
) {
  useEffect(() => {
    window.addEventListener(kind, cb);
    return () => window.removeEventListener(kind, cb);
  }, []);
}
