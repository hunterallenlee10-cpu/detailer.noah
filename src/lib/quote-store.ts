"use client";

import { useSyncExternalStore } from "react";

// Tiny shared store so service tiles ("Add to quote") and the quote form stay in sync.
let selected: string[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const quoteStore = {
  get: () => selected,
  set(next: string[]) {
    selected = next;
    emit();
  },
  add(name: string) {
    if (!selected.includes(name)) quoteStore.set([...selected, name]);
  },
  toggle(name: string) {
    quoteStore.set(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

const empty: string[] = [];
export const useQuoteServices = () => useSyncExternalStore(quoteStore.subscribe, quoteStore.get, () => empty);
