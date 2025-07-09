import { cn } from "@/lib/utils";
import IllustrationComponent from "./illustration";

export default function NoteIllustration({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <IllustrationComponent name={`Note: ${title}`} />
    </div>
  );
}
