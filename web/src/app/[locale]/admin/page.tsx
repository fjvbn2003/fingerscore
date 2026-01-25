"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Users,
  Calendar,
  CreditCard,
  Swords,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowRight,
  Building2,
  Activity,
  Target,
  Award,
  BarChart3,
  Star,
  MessageSquare,
  UserPlus,
  CalendarCheck,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/hooks/admin/use-dashboard";
import { useLessons } from "@/hooks/admin/use-lessons";
import { usePayments } from "@/hooks/admin/use-payments";
import { useExchangeMatches } from "@/hooks/admin/use-exchange-matches";
import { useCoaches } from "@/hooks/admin/use-coaches";
import { useClub } from "@/hooks/admin/use-club";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("안녕하세요");

  const { club } = useClub();
  const { stats, upcomingEvents, isLoading: isLoadingDashboard } = useDashboard();
  const { lessons, isLoading: isLoadingLessons } = useLessons();
  const { payments, stats: paymentStats, isLoading: isLoadingPayments } = usePayments();
  const { matches, isLoading: isLoadingMatches } = useExchangeMatches();
  const { coaches, isLoading: isLoadingCoaches } = useCoaches();

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
      const hour = now.getHours();
      if (hour < 12) setGreeting("좋은 아침이에요");
      else if (hour < 18) setGreeting("좋은 오후에요");
      else setGreeting("좋은 저녁이에요");
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 오늘의 레슨 필터링
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayLessons = lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.scheduled_at);
    return lessonDate >= today && lessonDate < tomorrow;
  });

  const completedTodayLessons = todayLessons.filter(
    (l) => l.status === "COMPLETED"
  ).length;

  // 미결제 내역
  const pendingPayments = payments.filter((p) => p.status === "PENDING");

  // 예정된 교류전
  const upcomingMatches = matches.filter(
    (m) => m.status === "ACCEPTED" || m.status === "PENDING"
  );

  const isLoading =
    isLoadingDashboard ||
    isLoadingLessons ||
    isLoadingPayments ||
    isLoadingMatches ||
    isLoadingCoaches;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👋</span>
              <h1 className="text-2xl font-bold">{greeting}, 관장님!</h1>
            </div>
            <p className="text-muted-foreground">
              {currentTime ?? "날짜 로딩 중..."} · {club?.name || "클럽"} 운영 현황을
              확인하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              asChild
              className="border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5"
            >
              <Link href="/admin/notifications">
                <MessageSquare className="mr-2 h-4 w-4" />
                공지사항
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
            >
              <Link href="/admin/club">
                <Building2 className="mr-2 h-4 w-4" />
                {t("club.edit")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Members */}
          <Card className="glass-card border-border dark:border-white/5 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.totalMembers")}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalMembers}
                <span className="text-lg font-normal text-muted-foreground">명</span>
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                {stats.newMembersThisMonth > 0 ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                    <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      +{stats.newMembersThisMonth}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted">
                    <span className="text-muted-foreground font-medium">+0</span>
                  </div>
                )}
                <span className="text-muted-foreground">이번 달</span>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card className="glass-card border-border dark:border-white/5 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.monthlyRevenue")}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₩{(stats.monthlyRevenue / 10000).toFixed(0)}
                <span className="text-lg font-normal text-muted-foreground">만</span>
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                {stats.revenueGrowthRate !== 0 ? (
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                      stats.revenueGrowthRate > 0
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                        : "bg-red-500/10 dark:bg-red-500/20"
                    }`}
                  >
                    {stats.revenueGrowthRate > 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 dark:text-red-400" />
                    )}
                    <span
                      className={`font-medium ${
                        stats.revenueGrowthRate > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stats.revenueGrowthRate > 0 ? "+" : ""}
                      {stats.revenueGrowthRate.toFixed(0)}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted">
                    <span className="text-muted-foreground font-medium">0%</span>
                  </div>
                )}
                <span className="text-muted-foreground">전월 대비</span>
              </div>
            </CardContent>
          </Card>

          {/* Today's Lessons */}
          <Card className="glass-card border-border dark:border-white/5 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.todayLessons")}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-500/20 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayLessons.length}
                <span className="text-lg font-normal text-muted-foreground">건</span>
              </div>
              {todayLessons.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Progress
                    value={(completedTodayLessons / todayLessons.length) * 100}
                    className="h-2 flex-1"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {completedTodayLessons}/{todayLessons.length}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="glass-card border-border dark:border-white/5 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("dashboard.pendingPayments")}
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {paymentStats.pendingCount}
                <span className="text-lg font-normal text-muted-foreground">건</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ₩{paymentStats.pendingAmount.toLocaleString()} 미결제
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Lessons */}
          <Card className="glass-card border-border dark:border-white/5 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                오늘의 레슨
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/admin/lessons">
                  전체보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {todayLessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-2">오늘 예정된 레슨이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayLessons.slice(0, 8).map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-3 hover:bg-muted dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            lesson.status === "COMPLETED"
                              ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                              : lesson.status === "IN_PROGRESS"
                              ? "bg-blue-500/10 dark:bg-blue-500/20"
                              : "bg-muted dark:bg-white/10"
                          }`}
                        >
                          <Clock
                            className={`h-4 w-4 ${
                              lesson.status === "COMPLETED"
                                ? "text-emerald-500 dark:text-emerald-400"
                                : lesson.status === "IN_PROGRESS"
                                ? "text-blue-500 dark:text-blue-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(lesson.scheduled_at).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {lesson.coach?.display_name}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            lesson.status === "COMPLETED"
                              ? "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : lesson.status === "IN_PROGRESS"
                              ? "border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "border-border dark:border-white/10 bg-muted dark:bg-white/5 text-muted-foreground"
                          }
                        >
                          {lesson.status === "COMPLETED"
                            ? "완료"
                            : lesson.status === "IN_PROGRESS"
                            ? "진행중"
                            : "예정"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="glass-card border-border dark:border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                다가오는 일정
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-2">예정된 일정이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-white/10">
                        {event.type === "LESSON" ? (
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        ) : event.type === "EXCHANGE_MATCH" ? (
                          <Swords className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Payments */}
          <Card className="glass-card border-border dark:border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                미결제 현황
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/admin/payments">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-2">미결제 내역이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.slice(0, 3).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-3"
                    >
                      <div>
                        <p className="font-medium">{payment.user?.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.type} · {payment.due_date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-600 dark:text-amber-400">
                          ₩{payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coaches */}
          <Card className="glass-card border-border dark:border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                코치 현황
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/admin/coaches">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {coaches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-2">등록된 코치가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coaches.slice(0, 3).map((coach) => (
                    <div
                      key={coach.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/50 dark:bg-white/5 p-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={coach.profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                          {coach.profile?.display_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{coach.profile?.display_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{coach.total_lessons}건 레슨</span>
                          {coach.average_rating && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                {coach.average_rating.toFixed(1)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          coach.is_active
                            ? "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "border-border dark:border-white/10 bg-muted dark:bg-white/5 text-muted-foreground"
                        }
                      >
                        {coach.is_active ? "활동중" : "비활성"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="glass-card border-border dark:border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                이번 달 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">완료된 레슨</span>
                <span className="font-semibold">
                  {stats.completedLessonsThisMonth}건
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">신규 회원</span>
                <span className="font-semibold">{stats.newMembersThisMonth}명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">총 매출</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ₩{stats.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">교류전</span>
                <span className="font-semibold">
                  {stats.exchangeMatchesThisMonth}건
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Matches */}
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-red-500 dark:text-red-400" />
              {t("dashboard.upcomingExchangeMatches")}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/admin/exchange-matches">
                전체보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Swords className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2">예정된 교류전이 없습니다</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingMatches.slice(0, 4).map((match) => {
                  const otherClub =
                    match.requesting_club_id === club?.id
                      ? match.receiving_club
                      : match.requesting_club;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20">
                          <Swords className="h-5 w-5 text-red-500 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{otherClub?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.proposed_date).toLocaleDateString("ko-KR", {
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            · {match.participant_count}명 참가
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          match.status === "ACCEPTED"
                            ? "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        }
                      >
                        {match.status === "ACCEPTED" ? "확정" : "제안됨"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
