"use client";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClockIcon,
  FolderIcon,
  InboxIcon,
  NotebookIcon,
  TrashIcon,
} from "lucide-react";
import CountUp from "react-countup";
import type { QuickAccessCounts } from "./fetchers";

export default function QuickAccessClient({
  counts,
}: {
  counts: QuickAccessCounts;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderIcon strokeWidth={1.5} /> Quick Access
          <div className="items-center gap-2 ml-auto hidden sm:flex font-medium">
            <p className="text-sm text-muted-foreground">
              {counts.categories} Categories,
            </p>
            <p className="text-sm text-muted-foreground">
              {counts.subcategories} Subcategories
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <QuickAccessItem
          title="Recent"
          icon={<ClockIcon />}
          count={counts.recent}
          href="/quick-access/recent-notes"
        />
        <QuickAccessItem
          title="Unsorted"
          icon={<InboxIcon />}
          count={counts.unsorted}
          href="/quick-access/unsorted-notes"
        />
        <QuickAccessItem
          title="All Notes"
          icon={<NotebookIcon />}
          count={counts.all}
          href="/quick-access/all-notes"
        />
        <QuickAccessItem
          title="Recycle"
          icon={<TrashIcon />}
          count={counts.recycle}
          href="/quick-access/recycle-bin"
        />
      </CardContent>
    </Card>
  );
}

function QuickAccessItem({
  title,
  icon,
  count,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  href: string;
}) {
  return (
    <ProgressBarLink
      href={href}
      className="flex items-center gap-2 [&>svg]:size-10 [&>svg]:shrink-0 [&>svg]:text-muted-foreground [&>svg]:stroke-1 cursor-pointer hover:bg-accent rounded-md px-2 py-2 text-left"
    >
      {icon}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          <CountUp end={count} duration={1} />
        </p>
      </div>
    </ProgressBarLink>
  );
}
