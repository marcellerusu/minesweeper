import { useEffect } from "react";

export function useWindowEvent<E extends Event>(
  kind: string,
  cb: (e: E) => void
) {
  useEffect(() => {
    window.addEventListener(kind as any, cb);
    return () => window.removeEventListener(kind as any, cb);
  }, []);
}
