import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";

export default function InputSearch({
  value,
  onChange,
  onSubmit,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
}) {
  return (
    <form
      className={cn("flex-1 relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input
        name="info"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="Search notes..."
        className={cn("ps-9 pe-9")}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <button
        className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Submit search"
        type="button"
        onClick={() => {
          onChange("");
          setTimeout(() => {
            onSubmit();
          }, 100);
        }}
      >
        <XIcon size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
