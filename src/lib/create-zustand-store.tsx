import { createContext, useContext, useRef } from "react";
import { type StateCreator, create } from "zustand";
import { combine, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type StateCreatorFixed<T extends object, U extends object> = StateCreator<
  T,
  [
    ["zustand/devtools", never],
    ["zustand/subscribeWithSelector", never],
    ["zustand/immer", never],
  ],
  [],
  U
>;

// create a zustand store with the given initial state and additional state creator
export function createZustandStore<T extends object, U extends object>(
  initialState: T,
  additionalStateCreator: StateCreatorFixed<T, U>,
) {
  const useStore = create(
    devtools(
      subscribeWithSelector(
        immer(combine(initialState, additionalStateCreator)),
      ),
    ),
  );
  return useStore;
}

type Store<T extends object, U extends object> = ReturnType<
  typeof createZustandStore<T, U>
>;

// create a zustand store provider which can be used to provide a instance of the store to the children
export function createZustandStoreProvider<T extends object, U extends object>(
  initialState: T,
  additionalStateCreator: StateCreatorFixed<T, U>,
) {
  const Context = createContext({} as Store<T, U>);

  const StoreProvider = ({
    children,
    overrideInitialState,
  }: {
    children: React.ReactNode;
    overrideInitialState?: Partial<T>;
  }) => {
    const refStore = useRef(
      createZustandStore(
        { ...initialState, ...overrideInitialState },
        additionalStateCreator,
      ),
    );
    return (
      <Context.Provider value={refStore.current}>{children}</Context.Provider>
    );
  };

  function useStore<R>(
    selector: (state: Parameters<Parameters<Store<T, U>>[0]>[0]) => R,
  ) {
    const useStoreInstance = useContext(Context);
    return useStoreInstance(selector) as R;
  }

  return { StoreProvider, useStore };
}
