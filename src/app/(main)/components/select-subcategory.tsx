"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { actionRecommendSubcategory } from "../actions/category";

export default function SelectSubcategory({
  id,
  noteId,
  defaultValue,
  onChange,
  placeholder = "Select subcategory...",
  ...props
}: {
  id?: string;
  noteId?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
} & Omit<React.ComponentProps<typeof Button>, "onChange"> & {
    placeholder?: string;
  }) {
  const categories = useMainLayoutStore((s) => s.categories);
  const options = useMemo(() => {
    const options = [];
    for (const category of categories) {
      options.push({
        id: category.id,
        value: "",
        label: category.name,
      });
      for (const subcategory of category.Subcategory) {
        options.push({
          id: subcategory.id,
          value: subcategory.id,
          label: subcategory.name,
        });
      }
    }
    return options;
  }, [categories]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const { recommendPending, recommendSubcategoryIds } = useRecommendSubcategory(
    noteId || "",
    open,
  );
  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          size="sm"
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between truncate text-muted-foreground"
          {...props}
        >
          {value
            ? (options.find((option) => option.value === value)?.label || "")
                .split("/")
                .pop()
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[266px] p-0">
        <Command
          filter={(_value, search, keywords = []) => {
            const extendValue = keywords.join(",");
            if (extendValue.toLowerCase().includes(search.toLowerCase()))
              return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search subcategory..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subcategory found.</CommandEmpty>
            {noteId && (
              <CommandGroup heading="✨ Recommend Subcategories">
                {recommendPending ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                    Loading...
                  </CommandItem>
                ) : recommendSubcategoryIds.length > 0 ? (
                  recommendSubcategoryIds.map((id) => (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        onChange?.(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          value === id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {options.find((option) => option.value === id)?.label ||
                        "Unknown"}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem className="text-muted-foreground">
                    No recommend subcategory found.
                  </CommandItem>
                )}
              </CommandGroup>
            )}
            {categories.map((c) => (
              <CommandGroup key={c.id} heading={c.name}>
                {c.Subcategory.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={s.id}
                    keywords={[c.name, s.name]}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      onChange?.(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        value === s.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function useRecommendSubcategory(noteId: string, open: boolean) {
  const [pending, setPending] = useState(false);
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([]);
  useEffect(() => {
    if (noteId && open) {
      setPending(true);
      actionRecommendSubcategory(noteId)
        .then((subcategories) => {
          setSubcategoryIds(subcategories);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setPending(false);
        });
    }
  }, [noteId, open]);
  return { recommendPending: pending, recommendSubcategoryIds: subcategoryIds };
}
