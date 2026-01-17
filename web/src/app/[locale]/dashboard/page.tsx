"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  Medal,
  Clock,
  ChevronRight,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";

// Mock data
const mockStats = {
  rating: 1720,
  rank: 156,
  totalMatches: 45,
  wins: 28,
  losses: 17,
  winRate: 62,
  recentForm: ["W", "W", "L", "W", "W"],
};

const mockUpcomingMatches = [
  {
    id: "m1",
    tournament: "서울 오픈 대회",
    opponent: { display_name: "이영희", rating: 1780 },
    scheduled_at: "2024-02-20T14:00:00Z",
    round: 2,
    court: "A코트",
  },
];

const mockRegisteredTournaments = [
  {
    id: "t1",
    title: "2024 서울 오픈 탁구 대회",
    tournament_start: "2024-02-20",
    status: "upcoming",
    seed: 8,
  },
  {
    id: "t2",
    title: "강남 클럽 리그 시즌 3",
    tournament_start: "2024-03-01",
    status: "registrationOpen",
    seed: null,
  },
];

const mockRecentActivity = [
  {
    type: "match_completed",
    title: "경기 완료",
    description: "vs 박민수 (3-1 승리)",
    time: "2시간 전",
  },
  {
    type: "rating_change",
    title: "레이팅 변동",
    description: "+15 (1705 → 1720)",
    time: "2시간 전",
  },
  {
    type: "tournament_registered",
    title: "대회 등록",
    description: "서울 오픈 대회 참가 신청 완료",
    time: "1일 전",
  },
  {
    type: "achievement",
    title: "업적 달성",
    description: "연속 5승 달성!",
    time: "2일 전",
  },
];

export default function DashboardPage() {
  const t = useTranslations();
  const { profile, isLoading } = useAuth();

  const displayName = profile?.display_name || "사용자";

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("dashboard.welcome", { name: displayName })}
        </h1>
        <p className="mt-1 text-muted-foreground">
          오늘의 활동과 경기 일정을 확인하세요
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStats.rating}</p>
              <p className="text-sm text-muted-foreground">
                {t("rankings.rating")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <Medal className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">#{mockStats.rank}</p>
              <p className="text-sm text-muted-foreground">현재 순위</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockStats.winRate}%</p>
              <p className="text-sm text-muted-foreground">
                {t("rankings.winRate")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockStats.wins}승 {mockStats.losses}패
              </p>
              <p className="text-sm text-muted-foreground">전적</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("dashboard.upcomingMatches")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockUpcomingMatches.length > 0 ? (
                <div className="space-y-4">
                  {mockUpcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{match.tournament}</p>
                          <p className="text-sm text-muted-foreground">
                            vs {match.opponent.display_name} (
                            {match.opponent.rating})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(match.scheduled_at).toLocaleDateString(
                            "ko-KR",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {match.court}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    예정된 경기가 없습니다
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Tournaments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {t("dashboard.myTournaments")}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tournaments">
                  {t("common.viewAll")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRegisteredTournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href={`/tournaments/${tournament.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{tournament.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tournament.tournament_start).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tournament.seed && (
                        <Badge variant="secondary">시드 #{tournament.seed}</Badge>
                      )}
                      <Badge
                        variant={
                          tournament.status === "upcoming"
                            ? "default"
                            : "outline"
                        }
                      >
                        {t(`tournaments.status.${tournament.status}`)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Form */}
          <Card>
            <CardHeader>
              <CardTitle>최근 경기 폼</CardTitle>
              <CardDescription>최근 5경기 결과</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {mockStats.recentForm.map((result, i) => (
                  <div
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                      result === "W"
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                    }`}
                  >
                    {result}
                  </div>
                ))}
                <div className="ml-4 text-sm text-muted-foreground">
                  최근 5경기 중 4승 1패
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold">{displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  @{profile?.username || "user"}
                </p>
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold">{mockStats.wins}</p>
                    <p className="text-muted-foreground">{t("rankings.wins")}</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="font-bold">{mockStats.losses}</p>
                    <p className="text-muted-foreground">
                      {t("rankings.losses")}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="font-bold">{mockStats.totalMatches}</p>
                    <p className="text-muted-foreground">총 경기</p>
                  </div>
                </div>
                <Button className="mt-4 w-full" variant="outline" asChild>
                  <Link href="/profile">
                    {t("profile.editProfile")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("dashboard.recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {activity.type === "match_completed" && (
                      <Trophy className="h-4 w-4" />
                    )}
                    {activity.type === "rating_change" && (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    {activity.type === "tournament_registered" && (
                      <Calendar className="h-4 w-4" />
                    )}
                    {activity.type === "achievement" && (
                      <Medal className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 메뉴</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/tournaments">
                  <Trophy className="mr-2 h-4 w-4" />
                  대회 찾기
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/rankings">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  랭킹 보기
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/community">
                  <Users className="mr-2 h-4 w-4" />
                  커뮤니티
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
