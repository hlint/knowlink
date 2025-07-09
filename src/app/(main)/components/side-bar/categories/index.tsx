import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import CategoriesContainer from "./categories-container";
import { ButtonCreateCategory, FormNewCategory } from "./create-category";

export default function SidebarCategories() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Categories</span>
        <ButtonCreateCategory />
      </SidebarGroupLabel>
      <FormNewCategory />
      <SidebarMenu>
        <CategoriesContainer />
      </SidebarMenu>
    </SidebarGroup>
  );
}
