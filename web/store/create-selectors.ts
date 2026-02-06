import type { StoreApi, UseBoundStore } from "zustand";

/**
 * Enhances a Zustand store with auto-generated `.use.field()` selector hooks.
 *
 * Each state key gets a `store.use.key()` method that returns the value
 * using an atomic selector — components only re-render when that specific
 * field changes.
 *
 * @see https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
 *
 * @example
 * ```ts
 * const useStoreBase = create<MyState>()(() => ({ count: 0, name: "" }));
 * export const useStore = createSelectors(useStoreBase);
 *
 * // In a component:
 * const count = useStore.use.count(); // only re-renders when count changes
 * const name = useStore.use.name();   // only re-renders when name changes
 * ```
 */

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as Record<string, () => unknown>;
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () =>
      store((s) => s[k as keyof typeof s]);
  }
  return store;
};
