"use client";

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

export default function AdminDashboardPage() {
  const t = useTranslations("admin");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">탁구장 운영 현황을 한눈에 확인하세요</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0">
          <Link href="/admin/club">
            <Building2 className="mr-2 h-4 w-4" />
            {t("club.edit")}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Members */}
        <Card className="glass-card border-white/5 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalMembers")}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalMembers}명</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">+{mockStats.memberGrowth}</span>
              <span className="text-muted-foreground">지난 달 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="glass-card border-white/5 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.monthlyRevenue")}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{mockStats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">+{mockStats.revenueGrowth}%</span>
              <span className="text-muted-foreground">지난 달 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Lessons */}
        <Card className="glass-card border-white/5 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.todayLessons")}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <Calendar className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.todayLessons}건</div>
            <div className="flex items-center gap-2">
              <Progress
                value={(mockStats.completedLessons / mockStats.todayLessons) * 100}
                className="h-2 flex-1"
              />
              <span className="text-sm text-muted-foreground">
                {mockStats.completedLessons}/{mockStats.todayLessons}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="glass-card border-white/5 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.pendingPayments")}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {mockStats.pendingPayments}건
            </div>
            <div className="text-sm text-muted-foreground">
              ₩{mockStats.pendingAmount.toLocaleString()} 미결제
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Lessons */}
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
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
            <div className="space-y-3">
              {mockTodayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Clock className="h-4 w-4 text-purple-400" />
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
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                          : lesson.status === "in_progress"
                          ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
                          : "border-white/10 bg-white/5 text-muted-foreground"
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

        {/* Pending Payments & Exchange Matches */}
        <div className="space-y-6">
          {/* Pending Payments */}
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" />
                미결제 현황
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/admin/payments">
                  전체보기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                  >
                    <div>
                      <p className="font-medium">{payment.memberName}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.type} · {payment.dueDate} 까지
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-amber-400">
                        ₩{payment.amount.toLocaleString()}
                      </p>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-emerald-400">
                        결제 완료 처리
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exchange Matches */}
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-red-400" />
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
              <div className="space-y-3">
                {mockExchangeMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20">
                        <Swords className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">{match.opponent}</p>
                        <p className="text-sm text-muted-foreground">
                          {match.date} · {match.participants}명 참가
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        match.status === "ACCEPTED"
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/20 text-amber-400"
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
      </div>
    </div>
  );
}
