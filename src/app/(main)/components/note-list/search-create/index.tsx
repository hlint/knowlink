"use client";

import ButtonCreateNote from "../../modal-create-note/button";
import ButtonClearSearch from "./button-clear-search";
import InputSearchWarp from "./input-search-warp";
import { StoreProvider, useStore } from "./store";

export default function SearchCreate(props: {
  subcategoryId: string | null;
  subcategoryName: string | null;
  searchOnly?: boolean;
}) {
  return (
    <StoreProvider {...props}>
      <div className="flex flex-row items-center gap-4 w-full">
        <InputSearchWarp />
        <Actions />
      </div>
    </StoreProvider>
  );
}

function Actions() {
  const { searchOnly, subcategoryId, subcategoryName } = useStore((s) => s);
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
