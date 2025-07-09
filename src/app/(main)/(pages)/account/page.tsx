import { fetcherLoginHistory } from "@/app/auth/auth-fetchers";
import IllustrationComponent from "../../components/illustration";
import AccountPageClient from "./client";

export const metadata = {
  title: "Account | Knowlink",
};

export default async function AccountPage() {
  const loginHistory = fetcherLoginHistory();
  return (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4">
      <IllustrationComponent name="Account details, change password" />
      <AccountPageClient loginHistory={loginHistory} />
    </div>
  );
}
