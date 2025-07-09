"use client";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { actionLogin } from "../auth-actions";
import { hashPassword } from "../utils";
import { LoginFormSchema } from "./defines";

export default function Login() {
  const [navigating, setNavigating] = useState(false);
  const navigate = useProgressNavigate();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    const { success, error } = await actionLogin({
      username: values.username,
      passwordHash: hashPassword(values.password),
    });
    if (success) {
      setNavigating(true);
      navigate("/");
    } else {
      form.setError("root", {
        message: error!,
      });
    }
  }
  const busy = form.formState.isSubmitting || navigating;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="post">
        <CardContent className="p-4 space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <PasswordResetHint />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError />
        </CardContent>
        <CardFooter className="p-4 flex flex-col gap-2 border-t border-border [.border-t]:pt-4">
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </CardFooter>
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
