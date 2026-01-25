"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import {
  Shield,
  Users,
  Building,
  Settings,
  TrendingUp,
  Activity,
  AlertTriangle,
  ArrowRight,
  Loader2,
  UserCog,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAllUsers } from "@/hooks/admin/use-all-users";
import { useAllClubs } from "@/hooks/admin/use-all-clubs";

export default function SystemDashboardPage() {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  const { stats: userStats, isLoading: isLoadingUsers } = useAllUsers();
  const { stats: clubStats, isLoading: isLoadingClubs } = useAllClubs();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = isLoadingUsers || isLoadingClubs;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">시스템 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-7 w-7 text-red-500" />
            <h1 className="text-2xl font-bold">시스템 대시보드</h1>
            <Badge variant="destructive" className="ml-2">
              ADMIN
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {currentTime ?? "날짜 로딩 중..."} · 플랫폼 전체 현황을 확인합니다
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/system/settings">
            <Settings className="mr-2 h-4 w-4" />
            시스템 설정
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border dark:border-white/5 hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 사용자
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userStats.total}
              <span className="text-lg font-normal text-muted-foreground">명</span>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  +{userStats.newThisMonth}
                </span>
              </div>
              <span className="text-muted-foreground">이번 달</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border dark:border-white/5 hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 클럽
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-500/20 group-hover:scale-110 transition-transform">
              <Building className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clubStats.total}
              <span className="text-lg font-normal text-muted-foreground">개</span>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  +{clubStats.newThisMonth}
                </span>
              </div>
              <span className="text-muted-foreground">이번 달</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border dark:border-white/5 hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              인증 클럽
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {clubStats.verified}
              <span className="text-lg font-normal text-muted-foreground">개</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {clubStats.total > 0
                ? `${((clubStats.verified / clubStats.total) * 100).toFixed(0)}% 인증률`
                : "0% 인증률"}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border dark:border-white/5 hover-lift group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 회원 수
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 group-hover:scale-110 transition-transform">
              <UserCog className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clubStats.totalMembers}
              <span className="text-lg font-normal text-muted-foreground">명</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              클럽 소속 회원
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              사용자 역할 분포
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/system/users">
                관리
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>일반 사용자 (USER)</span>
                </div>
                <span className="font-semibold">{userStats.byRole.USER}명</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span>주최자 (ORGANIZER)</span>
                </div>
                <span className="font-semibold">{userStats.byRole.ORGANIZER}명</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>클럽 관장 (CLUB_OWNER)</span>
                </div>
                <span className="font-semibold">{userStats.byRole.CLUB_OWNER}명</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span>시스템 관리자 (ADMIN)</span>
                </div>
                <span className="font-semibold">{userStats.byRole.ADMIN}명</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-500" />
              지역별 클럽 분포
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/system/clubs">
                관리
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {Object.keys(clubStats.byLocation).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2">등록된 클럽이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(clubStats.byLocation)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <span>{location}</span>
                      <Badge variant="secondary">{count}개</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/system/users">
          <Card className="glass-card border-border dark:border-white/5 hover-lift cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">사용자 관리</h3>
                  <p className="text-sm text-muted-foreground">
                    역할 변경, 인증 관리
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/system/clubs">
          <Card className="glass-card border-border dark:border-white/5 hover-lift cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20 group-hover:scale-110 transition-transform">
                  <Building className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold">클럽 관리</h3>
                  <p className="text-sm text-muted-foreground">
                    클럽 인증, 상태 관리
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/system/settings">
          <Card className="glass-card border-border dark:border-white/5 hover-lift cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 group-hover:scale-110 transition-transform">
                  <Settings className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold">시스템 설정</h3>
                  <p className="text-sm text-muted-foreground">
                    플랫폼 설정 관리
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="glass-card border-border dark:border-white/5 hover-lift cursor-pointer group opacity-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">활동 로그</h3>
                <p className="text-sm text-muted-foreground">준비 중</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
