"use client";
import { actionUpdatePassword } from "@/app/auth/auth-actions";
import { hashPassword } from "@/app/auth/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useRootLayout from "@/hooks/use-root-layout";
import { sleep } from "@/lib/time";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
});

export default function TabUpdatePassword() {
  const { session } = useRootLayout();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (values.newPassword !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }
    await sleep(500);
    const { success, error } = await actionUpdatePassword({
      currentPasswordHash: hashPassword(values.currentPassword),
      newPasswordHash: hashPassword(values.newPassword),
    });
    if (success) {
      toast.success("Password updated successfully");
    } else {
      form.setError("currentPassword", {
        message: error!,
      });
    }
  }
  const busy = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
        className="p-4 space-y-4 max-w-sm"
      >
        <input type="hidden" name="username" value={session.username} />
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>

              <PasswordResetHint />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormError />
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <Loader2 className="animate-spin" /> : null}
          Update Password
        </Button>
      </form>
    </Form>
  );
}

function PasswordResetHint() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <p className="text-sm text-muted-foreground max-w-xs">
        Delete `runtime/auth.json` to reset credentials to default.
      </p>
    );
  }
  return (
    <button
      className="text-sm text-muted-foreground text-left cursor-pointer hover:underline"
      type="button"
      onClick={() => setShow(true)}
    >
      Forgot password?
    </button>
  );
}
