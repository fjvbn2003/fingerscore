"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Menu,
  Trophy,
  Users,
  BarChart3,
  Radio,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { NotificationDropdown } from "@/components/notification/notification-dropdown";

const navigationItems = [
  { key: "tournaments", href: "/tournaments", icon: Trophy },
  { key: "community", href: "/community", icon: Users },
  { key: "rankings", href: "/rankings", icon: BarChart3 },
  { key: "live", href: "/live", icon: Radio },
];

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { user, profile, signOut, isLoading } = useAuth();

  const navigation = navigationItems.map((item) => ({
    ...item,
    name: t(`nav.${item.key}`),
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              FS
            </span>
          </div>
          <span className="hidden font-bold sm:inline-block">FingerScore</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:gap-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side - Auth buttons */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {!isLoading && (
            <>
              {user && <NotificationDropdown />}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback>
                          {profile?.display_name?.[0] || user.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.display_name || "사용자"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("dashboard.title")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t("profile.title")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {t("settings.title")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("common.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hidden md:flex"
                  >
                    <Link href="/auth/login">{t("common.login")}</Link>
                  </Button>
                  <Button size="sm" asChild className="hidden md:flex">
                    <Link href="/auth/signup">{t("common.signup")}</Link>
                  </Button>
                </>
              )}
            </>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="border-t border-border my-2" />
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      {t("dashboard.title")}
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      {t("profile.title")}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("common.logout")}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    {t("common.login")}
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
