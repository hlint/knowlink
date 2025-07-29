"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { usePrompt } from "@/components/advance/alert-provider";
import {
  ProgressBarLink,
  useProgressNavigate,
} from "@/components/advance/progress-bar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  HomeIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useModalCreateNoteStore } from "../modal-create-note/store";

export function NavMain() {
  const pageType = useMainLayoutStore((s) => s.pageType);
  const { setOpenMobile } = useSidebar();
  const { openModalCreateNote } = useModalCreateNoteStore(
    (state) => state.actions,
  );
  const prompt = usePrompt();
  const navigate = useProgressNavigate();
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
            prompt({
              title: "Search",
              body: "Search for a note by keywords",
              actionButton: "Search",
              actionButtonVariant: "default",
              cancelButton: "Cancel",
              cancelButtonVariant: "outline",
              inputProps: {
                placeholder: "Keywords...",
                autoFocus: true,
              },
            }).then((value) => {
              const keywords = (value || "").trim();
              if (keywords) {
                setOpenMobile(false);
                navigate(
                  `/quick-access/all-notes?query=${encodeURIComponent(keywords)}`,
                );
              }
            });
          }}
          className="w-full"
        >
          <SearchIcon />
          <span>Search</span>
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
