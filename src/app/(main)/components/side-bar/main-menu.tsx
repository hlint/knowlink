"use client";
import { actionLogout } from "@/app/auth/auth-actions";
import { useAlert } from "@/components/advance/alert-provider";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronsUpDown,
  InfoIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";

export function MainMenu() {
  const isMobile = useIsMobile();
  const navigate = useProgressNavigate();
  const modalAlert = useAlert();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full px-1.5 flex items-center">
              <Image src="/logo.png" alt="Knowlink" width={20} height={20} />
              <span className="truncate font-semibold">Knowlink</span>
              <div className="flex-1" />
              <ChevronsUpDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                navigate("/settings");
              }}
            >
              <SettingsIcon className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/account");
              }}
              className="gap-2 p-2"
            >
              <UserIcon className="size-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => actionLogout()}
              className="gap-2 p-2"
            >
              <LogOutIcon className="size-4" />
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                modalAlert({
                  title: "About Knowlink",
                  body: (
                    <div>
                      <p>Version: 0.1.4</p>
                      <p>
                        Website:{" "}
                        <a
                          className="text-blue-700 hover:underline"
                          href="https://hlint.github.io/knowlink"
                          target="_blank"
                          rel="noreferrer"
                        >
                          https://hlint.github.io/knowlink
                        </a>
                      </p>
                      <p>
                        Project:{" "}
                        <a
                          className="text-blue-700 hover:underline"
                          href="https://github.com/hlint/knowlink"
                          target="_blank"
                          rel="noreferrer"
                        >
                          https://github.com/hlint/knowlink
                        </a>
                      </p>
                    </div>
                  ),
                });
              }}
            >
              <InfoIcon className="size-4" /> About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
