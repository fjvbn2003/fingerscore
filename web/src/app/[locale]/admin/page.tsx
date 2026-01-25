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
  DollarSign,
  Clock,
  AlertCircle,
  ArrowRight,
  Building2,
  Activity,
  Target,
  Award,
  BarChart3,
  PieChart,
  Zap,
  Star,
  MessageSquare,
  UserPlus,
  CalendarCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data
const mockStats = {
  totalMembers: 48,
  activeMembers: 42,
  memberGrowth: 8,
  monthlyRevenue: 4250000,
  revenueGrowth: 12,
  pendingPayments: 3,
  pendingAmount: 450000,
  todayLessons: 8,
  completedLessons: 5,
  upcomingExchangeMatches: 2,
};

const mockTodayLessons = [
  { id: "1", memberName: "김철수", time: "09:00 - 10:00", coach: "박코치", status: "completed" },
  { id: "2", memberName: "이영희", time: "10:30 - 11:30", coach: "박코치", status: "completed" },
  { id: "3", memberName: "박민수", time: "14:00 - 15:00", coach: "김코치", status: "completed" },
  { id: "4", memberName: "최지영", time: "15:30 - 16:30", coach: "김코치", status: "completed" },
  { id: "5", memberName: "정대현", time: "17:00 - 18:00", coach: "박코치", status: "completed" },
  { id: "6", memberName: "한소희", time: "18:30 - 19:30", coach: "김코치", status: "in_progress" },
  { id: "7", memberName: "송민호", time: "19:30 - 20:30", coach: "박코치", status: "upcoming" },
  { id: "8", memberName: "윤서연", time: "20:30 - 21:30", coach: "김코치", status: "upcoming" },
];

const mockPendingPayments = [
  { id: "1", memberName: "김철수", amount: 150000, dueDate: "2024-01-20", type: "월회비" },
  { id: "2", memberName: "이영희", amount: 200000, dueDate: "2024-01-22", type: "레슨비" },
  { id: "3", memberName: "박민수", amount: 100000, dueDate: "2024-01-25", type: "월회비" },
];

const mockExchangeMatches = [
  { id: "1", opponent: "강남탁구클럽", date: "2024-01-28", participants: 8, status: "ACCEPTED" },
  { id: "2", opponent: "송파탁구사랑", date: "2024-02-05", participants: 10, status: "PROPOSED" },
];

// Weekly revenue data for chart
const weeklyRevenueData = [
  { day: "월", revenue: 580000, lessons: 12 },
  { day: "화", revenue: 620000, lessons: 14 },
  { day: "수", revenue: 450000, lessons: 10 },
  { day: "목", revenue: 720000, lessons: 16 },
  { day: "금", revenue: 680000, lessons: 15 },
  { day: "토", revenue: 850000, lessons: 18 },
  { day: "일", revenue: 350000, lessons: 8 },
];

// Top performers
const topMembers = [
  { name: "김철수", sessions: 24, improvement: "+150 RP", badge: "열정맨" },
  { name: "이영희", sessions: 22, improvement: "+120 RP", badge: "노력왕" },
  { name: "박민수", sessions: 20, improvement: "+95 RP", badge: "꾸준함" },
];

// Recent activity
const recentActivity = [
  { type: "new_member", name: "신규회원 가입", detail: "정하늘", time: "10분 전", icon: UserPlus },
  { type: "lesson_complete", name: "레슨 완료", detail: "김철수 (박코치)", time: "30분 전", icon: CalendarCheck },
  { type: "payment", name: "결제 완료", detail: "이영희 - 월회비", time: "1시간 전", icon: CreditCard },
  { type: "review", name: "후기 작성", detail: "최지영 ⭐⭐⭐⭐⭐", time: "2시간 전", icon: Star },
];

// Coach performance
const coachPerformance = [
  { name: "박코치", lessons: 45, rating: 4.9, students: 15 },
  { name: "김코치", lessons: 38, rating: 4.8, students: 12 },
  { name: "이코치", lessons: 32, rating: 4.7, students: 10 },
];

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("안녕하세요");

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

  const maxRevenue = Math.max(...weeklyRevenueData.map(d => d.revenue));

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
            {currentTime ?? "날짜 로딩 중..."} · 탁구장 운영 현황을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-border dark:border-white/10 hover:bg-muted dark:hover:bg-white/5">
            <Link href="/admin/notifications">
              <MessageSquare className="mr-2 h-4 w-4" />
              공지사항
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0">
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
            <div className="text-3xl font-bold">{mockStats.totalMembers}<span className="text-lg font-normal text-muted-foreground">명</span></div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{mockStats.memberGrowth}</span>
              </div>
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
              ₩{(mockStats.monthlyRevenue / 10000).toFixed(0)}<span className="text-lg font-normal text-muted-foreground">만</span>
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <TrendingUp className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{mockStats.revenueGrowth}%</span>
              </div>
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
            <div className="text-3xl font-bold">{mockStats.todayLessons}<span className="text-lg font-normal text-muted-foreground">건</span></div>
            <div className="flex items-center gap-2 mt-2">
              <Progress
                value={(mockStats.completedLessons / mockStats.todayLessons) * 100}
                className="h-2 flex-1"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {mockStats.completedLessons}/{mockStats.todayLessons}
              </span>
            </div>
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
              {mockStats.pendingPayments}<span className="text-lg font-normal text-muted-foreground">건</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ₩{mockStats.pendingAmount.toLocaleString()} 미결제
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue Chart */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            주간 매출 현황
          </CardTitle>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            이번 주 총 ₩{(weeklyRevenueData.reduce((sum, d) => sum + d.revenue, 0) / 10000).toFixed(0)}만
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyRevenueData.map((data, index) => (
              <Tooltip key={data.day}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 dark:from-emerald-500/80 dark:to-emerald-400/80 transition-all hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
                      style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: '20px' }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{data.day}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-semibold">₩{data.revenue.toLocaleString()}</p>
                    <p className="text-muted-foreground">{data.lessons}건 레슨</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Lessons */}
        <Card className="glass-card border-border dark:border-white/5 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              오늘의 레슨
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/admin/lessons">
                전체보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTodayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-3 hover:bg-muted dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      lesson.status === "completed"
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                        : lesson.status === "in_progress"
                        ? "bg-blue-500/10 dark:bg-blue-500/20"
                        : "bg-muted dark:bg-white/10"
                    }`}>
                      <Clock className={`h-4 w-4 ${
                        lesson.status === "completed"
                          ? "text-emerald-500 dark:text-emerald-400"
                          : lesson.status === "in_progress"
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{lesson.memberName}</p>
                      <p className="text-sm text-muted-foreground">{lesson.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{lesson.coach}</span>
                    <Badge
                      variant="outline"
                      className={
                        lesson.status === "completed"
                          ? "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : lesson.status === "in_progress"
                          ? "border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "border-border dark:border-white/10 bg-muted dark:bg-white/5 text-muted-foreground"
                      }
                    >
                      {lesson.status === "completed"
                        ? "완료"
                        : lesson.status === "in_progress"
                        ? "진행중"
                        : "예정"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted dark:bg-white/10">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
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
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/admin/payments">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-3"
                >
                  <div>
                    <p className="font-medium">{payment.memberName}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.type} · {payment.dueDate}
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
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              이달의 우수 회원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 dark:bg-white/5 p-3"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm ${
                    index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge variant="secondary" className="text-xs">{member.badge}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{member.sessions}회 출석</span>
                      <span className="text-emerald-500 dark:text-emerald-400">{member.improvement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coach Performance */}
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              코치별 실적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coachPerformance.map((coach) => (
                <div
                  key={coach.name}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 dark:bg-white/5 p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                      {coach.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{coach.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{coach.lessons}건 레슨</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {coach.rating}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    {coach.students}명
                  </Badge>
                </div>
              ))}
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
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/admin/exchange-matches">
              전체보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockExchangeMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 dark:bg-white/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20">
                    <Swords className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{match.opponent}</p>
                    <p className="text-sm text-muted-foreground">
                      {match.date} · {match.participants}명 참가
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}
