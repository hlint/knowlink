"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CalendarIcon, HomeIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useModalCreateNoteStore } from "../modal-create-note/store";

export function NavMain() {
  const pageType = useMainLayoutStore((s) => s.pageType);
  const { setOpenMobile } = useSidebar();
  const { openModalCreateNote } = useModalCreateNoteStore(
    (state) => state.actions,
  );
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "home"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/">
            <HomeIcon />
            <span>Home</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            setOpenMobile(false);
            openModalCreateNote(null, null);
          }}
          className="w-full"
        >
          <PlusIcon />
          <span>New Note</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "scratchpad"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/tools/scratchpad">
            <PencilIcon />
            <span>Scratchpad</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pageType === "event-calendar"}
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink href="/tools/event-calendar">
            <CalendarIcon />
            <span>Event Calendar</span>
          </ProgressBarLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
