import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Chatbox from "../components/chat";
import ModalCreateNote from "../components/modal-create-note";
import { SidebarLeft } from "../components/side-bar";
import { SidebarBreadcrumb } from "../components/sidebar-breadcrumb";
import { fetcherGetCategories } from "../fetchers/category";
import { LayoutEffect } from "./(layout)/effect";

export default async function MainLayout({
  children,
}: { children: React.ReactNode }) {
  const categories = await fetcherGetCategories();
  return (
    <>
      <LayoutEffect categories={categories} />
      <ModalCreateNote />
      <SidebarProvider>
        <SidebarLeft />
        <SidebarInset>
          <SidebarBreadcrumb />
          {children}
        </SidebarInset>
      </SidebarProvider>
      <Chatbox />
    </>
  );
}
