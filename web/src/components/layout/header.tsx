"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Menu,
  Trophy,
  Users,
  BarChart3,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Gamepad2,
  Sparkles,
  X,
  MapPin,
  Package,
  GraduationCap,
  UserPlus,
  Tag,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
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
import { NotificationDropdown } from "@/components/notifications";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  { key: "places", href: "/places", icon: MapPin, color: "text-orange-400" },
  { key: "equipment", href: "/equipment", icon: Package, color: "text-cyan-400" },
  { key: "lessons", href: "/lessons", icon: GraduationCap, color: "text-pink-400" },
  { key: "videos", href: "/videos", icon: Youtube, color: "text-red-400" },
  { key: "matching", href: "/matching", icon: UserPlus, color: "text-violet-400" },
  { key: "community", href: "/community", icon: Users, color: "text-blue-400" },
];

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { user, profile, signOut, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = navigationItems.map((item) => ({
    ...item,
    name: t(`nav.${item.key}`),
  }));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass border-b border-white/5 shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
              <span className="text-base font-bold text-white">FS</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold gradient-text">FingerScore</span>
            <div className="text-[10px] text-muted-foreground -mt-0.5">Smart Sports Platform</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:gap-0.5 overflow-x-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30" />
                )}
                <Icon className={cn("relative h-4 w-4 shrink-0", isActive && item.color)} />
                <span className="relative">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user && <NotificationDropdown />}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full ring-2 ring-white/10 hover:ring-emerald-500/50 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-semibold">
                          {profile?.display_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass-card" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-semibold text-lg">
                            {profile?.display_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {profile?.display_name || "사용자"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Sparkles className="h-3 w-3 text-amber-400" />
                            <span className="text-xs text-amber-400 font-medium">
                              {profile?.current_rating || 1200} RP
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <div className="p-1">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-white/5">
                          <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                          <span>{t("dashboard.title")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-white/5">
                          <User className="h-4 w-4 text-blue-400" />
                          <span>{t("profile.title")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 hover:bg-white/5">
                          <Settings className="h-4 w-4 text-purple-400" />
                          <span>{t("settings.title")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <div className="p-1">
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg px-3 py-2.5 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("common.logout")}</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/auth/login">{t("common.login")}</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-emerald-500/25"
                  >
                    <Link href="/auth/signup">{t("common.signup")}</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 hover:bg-white/5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] glass-card border-l border-white/10 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600">
                      <span className="text-sm font-bold text-white">FS</span>
                    </div>
                    <span className="font-bold gradient-text">FingerScore</span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-4 flex-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-emerald-500/30"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive && item.color)} />
                        {item.name}
                      </Link>
                    );
                  })}

                  <div className="border-t border-white/10 my-4" />

                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      >
                        <LayoutDashboard className="h-5 w-5 text-emerald-400" />
                        {t("dashboard.title")}
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      >
                        <User className="h-5 w-5 text-blue-400" />
                        {t("profile.title")}
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-5 w-5" />
                        {t("common.logout")}
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0">
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          {t("common.signup")}
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full border-white/10 hover:bg-white/5">
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                          {t("common.login")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
