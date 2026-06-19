import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import "@/styles/dashboard/layout/dashboard-layout.css";
import "@/styles/dashboard/layout/dashboard-navbar.css";
import "@/styles/dashboard/layout/dashboard-sidebar.css";
import "@/styles/dashboard/layout/dashboard-cards.css";
import "@/styles/dashboard/layout/dashboard-responsive.css";
import DashboardFooter from "@/components/dashboard/layout/DashboardFooter";
import DashboardLayout from "@/components/layout/dashboard-layout/DashboardLayout";
import NotificationProvider from "@/components/dashboard/context/NotificationContext";
import UserSyncProvider from "@/app/sso-callback/UserSyncProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  return (
    // ✅ NotificationProvider sabse bahar — Navbar bhi cover hoga
    <NotificationProvider>
      <DashboardLayout>
        <UserSyncProvider />
        {children}
        <DashboardFooter />
      </DashboardLayout>
    </NotificationProvider>
  );
}