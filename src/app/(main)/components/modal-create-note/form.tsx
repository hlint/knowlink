import { useProgressNavigate } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SparklesIcon } from "lucide-react";
import { useActionState } from "react";
import { actionCreateNote } from "../../actions/create-note";

export default function FormCreateNote({
  subcategoryId,
  onClose,
}: {
  subcategoryId: string | null;
  onClose: () => void;
}) {
  const navigate = useProgressNavigate();
  const createNote = async (_: null, formData: FormData) => {
    const type = formData.get("type") as string;
    const info = formData.get("info") as string;
    const isBlank = type === "blank";
    if (isBlank) {
      const { id } = await actionCreateNote({
        subcategoryId,
        info: undefined,
      });
      navigate(`/note/${id}`);
    } else {
      if (!info) {
        return null;
      }
      const { id } = await actionCreateNote({
        subcategoryId,
        info,
      });
      navigate(`/note/${id}`);
    }
    onClose();
    return null;
  };
  const [_state, formAction, pending] = useActionState(createNote, null);
  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <div className="flex flex-col gap-1">
        <Input name="info" placeholder="Writing Command or Web Link" />
        <p className="pl-3 text-sm text-muted-foreground">
          e.g. "Write a note about the benefits of meditation"
        </p>
        <p className="pl-3 text-sm text-muted-foreground">
          e.g. "https://en.wikipedia.org/wiki/Meditation"
        </p>
        <Button
          className="mt-2"
          disabled={pending}
          name="type"
          type="submit"
          value="generate"
        >
          <SparklesIcon /> Generate Note
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Start from scratch?</p>
        <Button
          variant="outline"
          disabled={pending}
          name="type"
          type="submit"
          value="blank"
        >
          New Blank Note
        </Button>
      </div>
    </form>
  );
}
