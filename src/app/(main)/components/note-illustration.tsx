import { cn } from "@/lib/utils";
import IllustrationComponent from "./illustration";

export default function NoteIllustration({
  note,
  className,
}: {
  note: {
    title: string;
    content: string;
    confidential: boolean;
  };
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <IllustrationComponent
        name={`Note: ${note.title}`}
        details={note.confidential ? "" : note.content}
      />
    </div>
  );
}
