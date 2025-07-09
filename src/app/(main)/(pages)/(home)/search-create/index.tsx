"use client";

import ButtonCreateNote from "@/app/(main)/components/modal-create-note/button";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import { useState } from "react";
import InputSearch from "../../../components/input-search";

export default function SearchCreate() {
  const [info, setInfo] = useState("");
  const navigate = useProgressNavigate();
  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <InputSearch
        className="max-w-none"
        value={info}
        onChange={setInfo}
        onSubmit={() => {
          navigate(`/quick-access/all-notes?query=${encodeURIComponent(info)}`);
        }}
      />
      <ButtonCreateNote subcategoryId={null} subcategoryName={null} />
    </div>
  );
}
