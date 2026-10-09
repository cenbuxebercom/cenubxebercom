"use client";
import { useEffect, useState } from "react";
import { FacebookIcon, InstagramIcon, LinkIcon, TelegramIcon, WhatsappIcon, XIcon } from "./icons";

const b = "flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5";

/** Xəbəri sosial şəbəkələrdə post kimi paylaşmaq. */
export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [msg, setMsg] = useState("");
  const [canShare, setCanShare] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  useEffect(() => {
    // brauzerin yerli paylaşma pəncərəsi varsa göstər
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const copy = async (m = "Link kopyalandı") => {
    try { await navigator.clipboard.writeText(url); flash(m); }
    catch { window.prompt("Linki kopyalayın:", url); }
  };

  return (
    <div className="mt-10 border-t border-[#e6e1db] pt-6">
      <p className="mb-3 text-[14px] font-semibold">Xəbəri paylaş</p>
      <div className="flex flex-wrap items-center gap-2.5">
        <a aria-label="Facebook-da paylaş" className={`${b} bg-[#1877f2]`} target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}><FacebookIcon className="h-5 w-5" /></a>
        <button aria-label="Instagram-da paylaş" className={`${b} bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]`}
          onClick={async () => {
            if (canShare) { try { await navigator.share({ title, url }); return; } catch { return; } }
            await copy("Link kopyalandı — Instagram-da story/post-a yapışdırın");
          }}><InstagramIcon className="h-5 w-5" /></button>
        <a aria-label="WhatsApp-da paylaş" className={`${b} bg-[#25d366]`} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${t}%20${u}`}><WhatsappIcon className="h-5 w-5" /></a>
        <a aria-label="Telegram-da paylaş" className={`${b} bg-[#229ed9]`} target="_blank" rel="noopener noreferrer" href={`https://t.me/share/url?url=${u}&text=${t}`}><TelegramIcon className="h-5 w-5" /></a>
        <a aria-label="X-də paylaş" className={`${b} bg-black`} target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}><XIcon className="h-4 w-4" /></a>
        <button aria-label="Linki kopyala" onClick={() => copy()} className={`${b} bg-navy`}><LinkIcon className="h-5 w-5" /></button>
        {canShare && (
          <button onClick={() => navigator.share({ title, url }).catch(() => {})} className="ml-1 rounded-full border border-[#d9d3cc] px-4 py-2 text-[13px] font-medium hover:border-navy">Digər…</button>
        )}
      </div>
      <p className="mt-3 min-h-5 text-[13px] text-brand" role="status">{msg}</p>
    </div>
  );
}
