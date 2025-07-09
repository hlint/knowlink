"use client";

import type { fetcherLoginHistory } from "@/app/auth/auth-fetchers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, LockIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import TabLoginHistory from "./tab-login-history";
import TabProfile from "./tab-profile";
import TabChangePassword from "./tab-update-password";
import useAccountLayoutEffect from "./use-layout-effect";

export default function AccountPageClient({
  loginHistory,
}: {
  loginHistory: ReturnType<typeof fetcherLoginHistory>;
}) {
  useAccountLayoutEffect();
  return (
    <Tabs defaultValue="tab-1" className="">
      <TabsList className="gap-1 bg-transparent [&_svg]:hidden sm:[&_svg]:block">
        <TabButton value="tab-1">
          <UserIcon size={16} aria-hidden="true" />
          Profile
        </TabButton>
        <TabButton value="tab-2">
          <HistoryIcon size={16} aria-hidden="true" />
          Login History
        </TabButton>
        <TabButton value="tab-3">
          <LockIcon size={16} aria-hidden="true" />
          Update Password
        </TabButton>
      </TabsList>
      <div className="grow text-start">
        <TabsContent value="tab-1">
          <TabProfile />
        </TabsContent>
        <TabsContent value="tab-2">
          <Suspense fallback={null}>
            <TabLoginHistory loginHistory={loginHistory} />
          </Suspense>
        </TabsContent>
        <TabsContent value="tab-3">
          <TabChangePassword />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function TabButton({
  children,
  value,
}: { children: React.ReactNode; value: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}
