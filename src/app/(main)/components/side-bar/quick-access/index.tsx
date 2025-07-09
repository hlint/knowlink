import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { QuickAccessItems } from "./items";

export default function SidebarQuickAccess() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Quick Access</span>
      </SidebarGroupLabel>
      <QuickAccessItems />
    </SidebarGroup>
  );
}
