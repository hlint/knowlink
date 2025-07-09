import { useProgressAction } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useQueryState } from "nuqs";

export default function ButtonClearSearch() {
  const [query, setQuery] = useQueryState("query");
  const action = useProgressAction();
  if (!query) return null;
  return (
    <Button
      variant="default"
      type="button"
      onClick={() => {
        action(async () => {
          await setQuery(null, { shallow: false });
        });
      }}
    >
      {query}
      <XIcon />
    </Button>
  );
}
