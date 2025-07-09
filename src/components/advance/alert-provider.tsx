"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";

type DialogReturn<T extends AlertAction["type"]> = T extends "alert" | "confirm"
  ? boolean
  : T extends "prompt"
    ? string | null
    : never;

export const AlertDialogContext = React.createContext((() =>
  Promise.resolve(undefined as never)) as <T extends AlertAction["type"]>(
  params: Extract<AlertAction, { type: T }>,
) => Promise<DialogReturn<T>>);

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

const defaultCancelButtonText: string = "Cancel";
const defaultActionButtonText: string = "Okay";

export type AlertAction =
  | {
      type: "alert";
      title: string;
      body?: string | React.ReactNode;
      cancelButton?: string;
      cancelButtonVariant?: ButtonVariant;
    }
  | {
      type: "confirm";
      title: string;
      body?: string | React.ReactNode;
      cancelButton?: string;
      actionButton?: string;
      cancelButtonVariant?: ButtonVariant;
      actionButtonVariant?: ButtonVariant;
    }
  | {
      type: "prompt";
      title: string;
      body?: string | React.ReactNode;
      cancelButton?: string;
      actionButton?: string;
      defaultValue?: string;
      cancelButtonVariant?: ButtonVariant;
      actionButtonVariant?: ButtonVariant;
      inputProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
    }
  | { type: "close" };

interface AlertDialogState {
  open: boolean;
  title: string;
  body: string | React.ReactNode;
  type: "alert" | "confirm" | "prompt";
  cancelButton: string;
  actionButton: string;
  cancelButtonVariant: ButtonVariant;
  actionButtonVariant: ButtonVariant;
  defaultValue?: string;
  inputProps?: React.PropsWithoutRef<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >;
}

export function alertDialogReducer(
  state: AlertDialogState,
  action: AlertAction,
): AlertDialogState {
  switch (action.type) {
    case "close":
      return { ...state, open: false };
    case "alert":
    case "confirm":
    case "prompt":
      return {
        ...state,
        open: true,
        ...action,
        cancelButton:
          action.cancelButton ||
          (action.type === "alert"
            ? defaultActionButtonText
            : defaultCancelButtonText),
        actionButton:
          ("actionButton" in action && action.actionButton) ||
          defaultActionButtonText,
        cancelButtonVariant: action.cancelButtonVariant || "default",
        actionButtonVariant:
          ("actionButtonVariant" in action && action.actionButtonVariant) ||
          "default",
      };
    default:
      return state;
  }
}

export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(alertDialogReducer, {
    open: false,
    title: "",
    body: "",
    type: "alert",
    cancelButton: defaultCancelButtonText,
    actionButton: defaultActionButtonText,
    cancelButtonVariant: "outline",
    actionButtonVariant: "default",
  });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const resolveRef = React.useRef<(tf: any) => void>(null);

  function close() {
    dispatch({ type: "close" });
    resolveRef.current?.(false);
  }

  function confirm(value?: string) {
    dispatch({ type: "close" });
    resolveRef.current?.(value ?? true);
  }

  const dialog = React.useCallback(
    <T extends AlertAction["type"]>(
      params: Extract<AlertAction, { type: T }>,
    ) => {
      dispatch(params);
      return new Promise<DialogReturn<T>>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [],
  );

  return (
    <AlertDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) close();
          return;
        }}
      >
        <AlertDialogContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              confirm(event.currentTarget.prompt?.value);
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{state.title}</AlertDialogTitle>
              {state.body ? (
                typeof state.body === "string" ? (
                  <AlertDialogDescription>{state.body}</AlertDialogDescription>
                ) : (
                  state.body
                )
              ) : null}
            </AlertDialogHeader>
            {state.type === "prompt" && (
              <Input
                name="prompt"
                defaultValue={state.defaultValue}
                {...state.inputProps}
              />
            )}
            <AlertDialogFooter>
              <Button
                type="button"
                onClick={close}
                variant={state.cancelButtonVariant}
              >
                {state.cancelButton}
              </Button>
              {state.type === "alert" ? null : (
                <Button type="submit" variant={state.actionButtonVariant}>
                  {state.actionButton}
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

type Params<T extends "alert" | "confirm" | "prompt"> =
  | Omit<Extract<AlertAction, { type: T }>, "type">
  | string;

export function useConfirm() {
  const dialog = React.useContext(AlertDialogContext);
  return (params: Params<"confirm">) =>
    dialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "confirm",
    });
}

export function usePrompt() {
  const dialog = React.useContext(AlertDialogContext);
  return (params: Params<"prompt">) =>
    dialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "prompt",
    });
}

export function useAlert() {
  const dialog = React.useContext(AlertDialogContext);
  return (params: Params<"alert">) =>
    dialog({
      ...(typeof params === "string" ? { title: params } : params),
      type: "alert",
    });
}
