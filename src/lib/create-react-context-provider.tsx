import { createContext, useContext as useReactContext } from "react";

export default function createReactContextProvider<T>(initialValues: T) {
  const Context = createContext<T>(initialValues);
  const Provider = ({
    children,
    ...values
  }: { children: React.ReactNode } & Partial<T>) => {
    return (
      <Context.Provider value={{ ...initialValues, ...values }}>
        {children}
      </Context.Provider>
    );
  };
  const useContext = () => useReactContext(Context);
  return { Provider, useContext };
}
