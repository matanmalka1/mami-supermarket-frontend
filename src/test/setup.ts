import "@testing-library/jest-dom";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

const ensureStorage = (name: "localStorage" | "sessionStorage") => {
  const existing = globalThis[name] as Storage | undefined;
  if (!existing || typeof existing.clear !== "function") {
    const store = new Map<string, string>();
    const stub: Storage = {
      get length() {
        return store.size;
      },
      clear: () => store.clear(),
      getItem: (key: string) => store.get(key) ?? null,
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    Object.defineProperty(globalThis, name, { value: stub, writable: true });
  }
  globalThis[name]?.clear();
};

beforeEach(() => {
  ensureStorage("sessionStorage");
  ensureStorage("localStorage");
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
