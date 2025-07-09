import { useProgressAction } from "@/components/advance/progress-bar";
import { useQueryState } from "nuqs";
import { useState } from "react";
import InputSearch from "../../input-search";

export default function InputSearchWarp() {
  const [query, setQuery] = useQueryState("query");
  const [info, setInfo] = useState(query || "");
  const action = useProgressAction();
  return (
    <InputSearch
      value={info}
      onChange={setInfo}
      onSubmit={() => {
        action(async () => {
          await setQuery(info, { shallow: false });
        });
      }}
    />
  );
}
