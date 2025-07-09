import { MagicCard } from "@/components/magicui/magic-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <div className="h-screen flex justify-center items-center bg-accent">
      <Card className="p-0  shadow-none border-none">
        <MagicCard className="p-0">
          <CardHeader className="border-b border-border w-sm max-w-[calc(100vw-2rem)] p-4 [.border-b]:pb-4">
            <CardTitle className="flex items-center gap-2">
              <Image src="/logo.png" alt="Knowlink" width={28} height={28} />
              Knowlink
            </CardTitle>
            <CardDescription>Please login to continue</CardDescription>
          </CardHeader>
          <LoginForm />
        </MagicCard>
      </Card>
    </div>
  );
}
