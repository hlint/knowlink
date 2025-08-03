"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ClockIcon,
  InboxIcon,
  NotebookIcon,
  PinIcon,
  TrashIcon,
} from "lucide-react";

export function QuickAccessItems() {
  const pageType = useMainLayoutStore((s) => s.pageType);
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "pinned-notes"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/quick-access/pinned-notes">
            <PinIcon />
            <span>Pinned</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "recent-notes"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/quick-access/recent-notes">
            <ClockIcon />
            <span>Recent</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "unsorted-notes"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/quick-access/unsorted-notes">
            <InboxIcon />
            <span>Unsorted</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "all-notes"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/quick-access/all-notes">
            <NotebookIcon />
            <span>All Notes</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "recycle-bin"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/quick-access/recycle-bin">
            <TrashIcon />
            <span>Recycle Bin</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
