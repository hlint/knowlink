import NoteVersionComponent from "@/app/(main)/components/version";
import ClientOnly from "@/components/advance/client-only";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@prisma/client";

export default function NoteInfo({ note }: { note: Note }) {
  return (
    <div className="px-0 sm:px-20 mt-2 flex flex-row items-center gap-2">
      <ClientOnly>
        <Badge variant="secondary">{note.createdAt.toLocaleDateString()}</Badge>
      </ClientOnly>
      <Badge variant="secondary">{note.viewedCount} views</Badge>
      <NoteVersionComponent noteId={note.id} />
      {note.confidential && <Badge variant="secondary">private</Badge>}
      {note.deleted && <Badge variant="destructive">deleted</Badge>}
    </div>
  );
}
