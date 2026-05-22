import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "管理後台 | 欣榮汽配",
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    redirect("/admin/login");
  }
  return <AdminShell user={user}>{children}</AdminShell>;
}
