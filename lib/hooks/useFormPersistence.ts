"use client";

import { useEffect, useRef } from "react";

export function useFormPersistence<T extends Record<string, unknown>>(
  storageKey: string,
  values: T,
  setValues: (values: T) => void,
  enabled = true
) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!enabled || hydrated.current) return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        setValues(parsed);
      }
    } catch {
      // negeer corrupte data
    } finally {
      hydrated.current = true;
    }
  }, [storageKey, enabled, setValues]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      // negeer quota errors
    }
  }, [storageKey, values, enabled]);
}
