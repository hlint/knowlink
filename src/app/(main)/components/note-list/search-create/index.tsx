"use client";

import ButtonCreateNote from "../../modal-create-note/button";
import ButtonClearSearch from "./button-clear-search";
import InputSearchWarp from "./input-search-warp";
import { Provider, useContext } from "./store";

export default function SearchCreate(props: {
  subcategoryId: string | null;
  subcategoryName: string | null;
  searchOnly?: boolean;
}) {
  return (
    <Provider {...props}>
      <div className="flex flex-row items-center gap-4 w-full">
        <InputSearchWarp />
        <Actions />
      </div>
    </Provider>
  );
}

function Actions() {
  const { searchOnly, subcategoryId, subcategoryName } = useContext();
  return (
    <div className="flex items-center gap-4">
      <ButtonClearSearch />
      {!searchOnly && (
        <ButtonCreateNote
          subcategoryId={subcategoryId}
          subcategoryName={subcategoryName}
        />
      )}
    </div>
  );
}
