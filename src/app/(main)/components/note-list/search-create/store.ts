import createReactContextProvider from "@/lib/create-react-context-provider";

const initialState: {
  subcategoryId: string | null;
  subcategoryName: string | null;
  searchOnly: boolean;
} = {
  subcategoryId: null,
  subcategoryName: null,
  searchOnly: false,
};

export const { Provider, useContext } =
  createReactContextProvider(initialState);
