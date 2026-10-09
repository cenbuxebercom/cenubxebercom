/* eslint-disable @next/next/no-img-element */
export default function Img({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
}
