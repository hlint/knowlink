import type { NoteLite } from "@/app/(main)/schema/note";
import NoteItemWrapper from "./note-item-wrapper";

export default function NoteList({ notes }: { notes: NoteLite[] }) {
  return (
    <div className="min-h-[200px)] relative bottom-2 right-2">
      {notes.length === 0 ? (
        <NoItems />
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteItemWrapper key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoItems() {
  return (
    <div className="p-4">
      <p className="text-muted-foreground">No items found.</p>
    </div>
  );
}
