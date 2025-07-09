import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRightIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type Configs,
  ConfigsSchema,
  getDefaultConfigs,
} from "../../schema/configs";
import { actionSetConfigs } from "./actions";
import { useSettingsContext } from "./context";

const passwordInputClassName =
  "[&:not(:focus)]:[-webkit-text-security:disc] [&:not(:focus)]:[text-security:disc]";

export default function TabServices() {
  const { configs } = useSettingsContext();
  const form = useForm<Configs>({
    resolver: zodResolver(ConfigsSchema),
    defaultValues: configs,
  });
  async function onSubmit(values: Configs) {
    // token limit must be a number
    if (Number(values.llmInputTokenLimit) < 1000) {
      form.setError("llmInputTokenLimit", {
        message: "Token limit must be at least 1000",
      });
      return;
    }
    await actionSetConfigs(values).catch((_error) => {
      form.setError("root", {
        message: "Service unavailable",
      });
    });
  }
  const busy = form.formState.isSubmitting;
  return (
    <div className="p-4 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* LLM */}
            <div className="space-y-4 flex-1">
              <h2 className="text-lg font-semibold">LLM</h2>
              {/* openaiApiKey */}
              <FormField
                control={form.control}
                name="openaiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input {...field} className={passwordInputClassName} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* openaiBaseUrl */}
              <FormField
                control={form.control}
                name="openaiBaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI Base URL</FormLabel>
                    <FormControl>
                      <FormItemInput
                        {...field}
                        iconButtonEnabled
                        iconButtonIcon={<ArrowLeftRightIcon size={16} />}
                        iconButtonTooltip="Default"
                        iconButtonOnClick={() => {
                          field.onChange(getDefaultConfigs().openaiBaseUrl);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* openaiModel */}
              <FormField
                control={form.control}
                name="openaiModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* llmInputTokenLimit */}
              <FormField
                control={form.control}
                name="llmInputTokenLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LLM Input Token Limit</FormLabel>
                    <FormControl>
                      <FormItemInput
                        {...field}
                        iconButtonEnabled
                        iconButtonIcon={<ArrowLeftRightIcon size={16} />}
                        iconButtonTooltip="Default"
                        iconButtonOnClick={() => {
                          field.onChange(
                            getDefaultConfigs().llmInputTokenLimit,
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      The maximum number of tokens that can be sent to the LLM.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Other */}
            <div className="space-y-6 flex-1">
              {/* Web Clipper */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Web Clipper</h2>
                <FormField
                  control={form.control}
                  name="webClipperAccessKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Web Clipper Access Key</FormLabel>
                      <FormControl>
                        <FormItemInput
                          {...field}
                          iconButtonEnabled
                          className={passwordInputClassName}
                          iconButtonIcon={<SparklesIcon size={16} />}
                          iconButtonTooltip="Generate & Copy"
                          iconButtonOnClick={() => {
                            const key = crypto.randomUUID();
                            field.onChange(key);
                            navigator.clipboard.writeText(key);
                            toast.success("Copied to clipboard");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        See more at{" "}
                        <a
                          href="https://www.knowlink.com/web-clipper/"
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Knowlink Web Clipper
                        </a>
                        .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* AI Tools */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">AI Tools</h2>
                {/* tavilyApiKey */}
                <FormField
                  control={form.control}
                  name="tavilyApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tavily API Key</FormLabel>
                      <FormControl>
                        <Input {...field} className={passwordInputClassName} />
                      </FormControl>
                      <FormDescription>
                        <a
                          href="https://tavily.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Tavily
                        </a>{" "}
                        is a search engine tailored for AI agents.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* pexelsApiKey */}
                <FormField
                  control={form.control}
                  name="pexelsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pexels API Key</FormLabel>
                      <FormControl>
                        <Input {...field} className={passwordInputClassName} />
                      </FormControl>
                      <FormDescription>
                        <a
                          href="https://www.pexels.com/api/"
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Pexels
                        </a>{" "}
                        is a stock photo API provider.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <FormError />
          {/* submit */}
          <Button type="submit" disabled={busy} className="w-[200px]">
            {busy ? <Loader2Icon className="animate-spin" /> : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function FormItemInput({
  className,
  type,
  iconButtonEnabled,
  iconButtonIcon,
  iconButtonTooltip,
  iconButtonDisabled,
  iconButtonLoading,
  iconButtonOnClick,
  ...props
}: React.ComponentProps<"input"> & {
  iconButtonEnabled?: boolean;
  iconButtonIcon?: React.ReactNode;
  iconButtonTooltip?: string;
  iconButtonDisabled?: boolean;
  iconButtonLoading?: boolean;
  iconButtonOnClick?: () => void;
}) {
  const button = iconButtonEnabled ? (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <button
          className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={iconButtonDisabled}
          type="button"
          onClick={iconButtonOnClick}
        >
          {iconButtonLoading ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            iconButtonIcon
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{iconButtonTooltip}</p>
      </TooltipContent>
    </Tooltip>
  ) : null;
  return (
    <div className="relative">
      {button}
      <Input className={cn("pe-9", className)} {...props} />
    </div>
  );
}
