import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (user?.isAdmin) {
    redirect("/admin");
  }
  return <>{children}</>;
}
