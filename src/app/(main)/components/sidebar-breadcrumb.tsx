"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import React from "react";

export function SidebarBreadcrumb() {
  const breadcrumbItems = useMainLayoutStore((s) => s.breadcrumbItems);
  const [otherItems, lastItem] = useMemo(() => {
    const arr = [...breadcrumbItems];
    const lastItem = arr.pop();
    return [arr, lastItem];
  }, [breadcrumbItems]);
  return (
    <header className="sticky z-10 top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
      <div className="flex flex-1 items-center gap-2 px-3 overflow-hidden">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="grow overflow-hidden">
          <BreadcrumbList className="">
            {otherItems.length ? (
              <>
                {otherItems.map((t, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <React.Fragment key={i}>
                    <Item item={t} muted />
                    <BreadcrumbSeparator className="hidden md:block" />
                  </React.Fragment>
                ))}
              </>
            ) : null}
            {lastItem && <Item item={lastItem} alwaysShow />}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

function Item({
  item,
  muted = false,
  alwaysShow = false,
}: {
  item: {
    name: string;
    icon?: React.ReactNode;
    href?: string;
  };
  muted?: boolean;
  alwaysShow?: boolean;
}) {
  return (
    <BreadcrumbItem className={cn(!alwaysShow && "hidden md:block")}>
      {item.href ? (
        <BreadcrumbLink asChild>
          <ProgressBarLink
            href={item.href}
            className="flex items-center gap-1.5 [&_svg]:hidden md:[&_svg]:block truncate"
          >
            {item.icon}
            {item.name}
          </ProgressBarLink>
        </BreadcrumbLink>
      ) : (
        <BreadcrumbPage
          className={cn(
            "flex items-center gap-1.5 [&_svg]:hidden md:[&_svg]:block truncate",
            muted && "text-muted-foreground",
          )}
        >
          {item.icon}
          {item.name}
        </BreadcrumbPage>
      )}
    </BreadcrumbItem>
  );
}
