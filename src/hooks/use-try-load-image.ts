import { useEffect, useState } from "react";

export function useTryLoadImage(src: string) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!src) {
      setImgLoaded(false);
      setTried(true);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setImgLoaded(true);
      setTried(true);
    };
    img.onerror = () => {
      setImgLoaded(false);
      setTried(true);
    };
    img.src = src;
  }, [src]);

  return { imgLoaded, tried };
}
