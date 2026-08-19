import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  if (!session?.user?.anonymousUuid) {
    redirect(`/${params.locale}/onboarding`);
  }
  return <>{children}</>;
}
