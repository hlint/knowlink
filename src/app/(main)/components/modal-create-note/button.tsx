import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useModalCreateNoteStore } from "./store";

export default function ButtonCreateNote({
  subcategoryId,
  subcategoryName,
}: {
  subcategoryId: string | null;
  subcategoryName: string | null;
}) {
  const { openModalCreateNote } = useModalCreateNoteStore(
    (state) => state.actions,
  );
  return (
    <Button
      onClick={() => {
        openModalCreateNote(subcategoryId, subcategoryName);
      }}
    >
      <PlusIcon />
      New Note
    </Button>
  );
}
