import { useSyncExternalStore } from "react";

let ready = false;
const subs = new Set<() => void>();

export const setReady = () => {
  if (ready) return;
  ready = true;
  subs.forEach((f) => f());
};

/** Preloader bitəndən sonra true olur (hero animasiyaları bunu gözləyir). */
export const useReady = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => ready,
    () => false,
  );
