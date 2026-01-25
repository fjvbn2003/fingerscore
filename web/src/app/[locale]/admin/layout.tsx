"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Swords,
  Building2,
  Menu,
  X,
  ChevronLeft,
  Bell,
  GraduationCap,
  Shield,
  Settings,
  Building,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdminGuard } from "@/components/admin/admin-guard";
import { useAdminAuth, canAccessAdminMenu } from "@/hooks/admin/use-admin-auth";

// CLUB_OWNER 사이드바 메뉴
const clubOwnerMenuItems = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "club", href: "/admin/club", icon: Building2 },
  { key: "members", href: "/admin/members", icon: Users },
  { key: "coaches", href: "/admin/coaches", icon: GraduationCap },
  { key: "lessons", href: "/admin/lessons", icon: Calendar },
  { key: "payments", href: "/admin/payments", icon: CreditCard },
  { key: "exchangeMatch", href: "/admin/exchange-matches", icon: Swords },
  { key: "chat", href: "/admin/chat", icon: MessageSquare },
  { key: "notifications", href: "/admin/notifications", icon: Bell },
];

// ADMIN 전용 시스템 관리 메뉴
const systemMenuItems = [
  { key: "systemDashboard", href: "/admin/system", icon: Shield },
  { key: "allUsers", href: "/admin/system/users", icon: UserCog },
  { key: "allClubs", href: "/admin/system/clubs", icon: Building },
  { key: "systemSettings", href: "/admin/system/settings", icon: Settings },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin, role } = useAdminAuth();

  // 현재 역할에 따라 보여줄 메뉴 필터링
  const visibleMenuItems = clubOwnerMenuItems.filter((item) =>
    canAccessAdminMenu(role, item.href)
  );

  const getMenuLabel = (key: string) => {
    switch (key) {
      case "dashboard":
        return t("dashboard.title");
      case "club":
        return t("club.title");
      case "members":
        return t("members.title");
      case "coaches":
        return "코치 관리";
      case "lessons":
        return t("lessons.title");
      case "payments":
        return t("payments.title");
      case "exchangeMatch":
        return t("exchangeMatch.title");
      case "chat":
        return t("chat.title");
      case "notifications":
        return t("notifications.title");
      case "systemDashboard":
        return "시스템 대시보드";
      case "allUsers":
        return "전체 사용자";
      case "allClubs":
        return "전체 클럽";
      case "systemSettings":
        return "시스템 설정";
      default:
        return key;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transition-all duration-300 glass-card border-r border-border dark:border-white/5",
          collapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-white/10">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                  {isAdmin ? (
                    <Shield className="h-5 w-5 text-white" />
                  ) : (
                    <Building2 className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-sm">
                    {isAdmin ? "시스템 관리" : t("clubManagement")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? "ADMIN" : "관장 전용"}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-muted dark:hover:bg-white/5"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-muted dark:hover:bg-white/5"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Club Owner 메뉴 */}
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive && "text-amber-600 dark:text-amber-400"
                    )}
                  />
                  {!collapsed && <span>{getMenuLabel(item.key)}</span>}
                </Link>
              );
            })}

            {/* ADMIN 전용 시스템 관리 섹션 */}
            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  {!collapsed && (
                    <div className="px-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        시스템 관리
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        ADMIN
                      </Badge>
                    </div>
                  )}
                  {collapsed && (
                    <div className="flex justify-center">
                      <div className="w-8 h-px bg-border" />
                    </div>
                  )}
                </div>
                {systemMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/system" &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
                          : "text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive && "text-red-600 dark:text-red-400"
                        )}
                      />
                      {!collapsed && <span>{getMenuLabel(item.key)}</span>}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Back to main site */}
          <div className="p-3 border-t border-border dark:border-white/10">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-all",
                collapsed && "justify-center px-0"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              {!collapsed && <span>메인으로 돌아가기</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "min-h-[calc(100vh-4rem)] pt-16 transition-all duration-300",
          collapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Mobile header */}
        <div className="sticky top-16 z-30 flex items-center gap-4 glass border-b border-border dark:border-white/5 p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted dark:hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">
            {isAdmin ? "시스템 관리" : t("clubManagement")}
          </h1>
          {isAdmin && (
            <Badge variant="destructive" className="text-xs">
              ADMIN
            </Badge>
          )}
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminGuard>
  );
}
