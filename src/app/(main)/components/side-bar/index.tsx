import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarCategories from "./categories";
import { MainMenu } from "./main-menu";
import { NavMain } from "./nav-main";
import SidebarQuickAccess from "./quick-access";

export function SidebarLeft() {
  return (
    <Sidebar className="border-r-0" variant="sidebar">
      <SidebarHeader>
        <MainMenu />
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <SidebarQuickAccess />
        <SidebarCategories />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
