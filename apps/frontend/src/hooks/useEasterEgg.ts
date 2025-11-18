import { useEffect, useState, useCallback } from "react";

export function useEasterEgg() {
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => setVisible(false), []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const ctrl = e.ctrlKey;
      const inTopRight =
        e.clientX > window.innerWidth - 50 && e.clientY < 50;

      if (ctrl && inTopRight) {
        setVisible(true);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { visible, close };
}
