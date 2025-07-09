import { actionUpdateUsername } from "@/app/auth/auth-actions";
import ClientOnly from "@/components/advance/client-only";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRootLayout from "@/hooks/use-root-layout";
import { Loader2 } from "lucide-react";
import { useId } from "react";
import { useImmer } from "use-immer";
export default function TabProfile() {
  const { session } = useRootLayout();
  const id = useId();
  const [formState, setFormState] = useImmer({
    pending: false,
  });
  return (
    <div className="flex flex-col gap-4 max-w-sm p-4">
      <form
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          setFormState((draft) => {
            draft.pending = true;
          });
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await actionUpdateUsername({
              username: formData.get("username") as string,
            });
          } catch (_error) {}

          setFormState((draft) => {
            draft.pending = false;
          });
        }}
      >
        <Label htmlFor={id} className="font-bold">
          Username
        </Label>
        <div className="flex gap-2">
          <Input
            name="username"
            required
            defaultValue={session.username}
            id={id}
          />
          <Button type="submit" disabled={formState.pending}>
            {formState.pending ? <Loader2 className="animate-spin" /> : null}
            Save
          </Button>
        </div>
      </form>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Last login</p>
        <ClientOnly>
          <p className="text-sm">
            {new Date(session.loginTime).toLocaleString()}
          </p>
        </ClientOnly>
      </div>
    </div>
  );
}
