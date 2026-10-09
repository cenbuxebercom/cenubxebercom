/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

const optimizable = (src: string) => {
  try {
    const h = new URL(src).hostname;
    return h === "ibb.co" || h.endsWith(".ibb.co");
  } catch {
    return false;
  }
};

/** Şəkil: ImgBB şəkilləri Next optimizasiyası ilə (WebP/AVIF, düzgün ölçü, lazy) təqdim olunur. */
export default function Img({
  src, alt = "", className = "", sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw", priority = false,
}: { src: string; alt?: string; className?: string; sizes?: string; priority?: boolean }) {
  if (!src) return <div className={`h-full w-full bg-[#eee9e3] ${className}`} />;
  const cls = `h-full w-full object-cover ${className}`;
  if (optimizable(src)) {
    return <Image src={src} alt={alt} width={1200} height={800} sizes={sizes} priority={priority} quality={72} className={cls} />;
  }
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={cls} />;
}
