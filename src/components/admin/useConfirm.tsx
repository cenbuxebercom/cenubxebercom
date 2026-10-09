"use client";
import { useCallback, useRef, useState } from "react";

/** Brauzerin (Chrome) `confirm()` pəncərəsi əvəzinə saytın öz təsdiq pəncərəsi. */
export function useConfirm() {
  const [state, setState] = useState<{ message: string; danger: boolean; ok: string } | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const ask = useCallback(
    (message: string, opts: { danger?: boolean; ok?: string } = {}) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setState({ message, danger: opts.danger ?? true, ok: opts.ok ?? "Sil" });
      }),
    [],
  );

  const close = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setState(null);
  };

  const dialog = state && (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4" onClick={() => close(false)} role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] leading-[1.6] text-ink">{state.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => close(false)} className="rounded-lg bg-[#f4f2ee] px-4 py-2.5 text-[14px] font-medium hover:bg-[#e9e5df]">Ləğv et</button>
          <button
            autoFocus
            onClick={() => close(true)}
            className={`rounded-lg px-4 py-2.5 text-[14px] font-medium text-white ${state.danger ? "bg-red-600 hover:bg-red-700" : "bg-navy hover:bg-[#1a1a80]"}`}
          >{state.ok}</button>
        </div>
      </div>
    </div>
  );

  return [ask, dialog] as const;
}
