"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  Medal,
  ChevronRight,
  BarChart3,
  Users,
  Activity,
  Zap,
  Star,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
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
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { getTierInfo } from "@/lib/elo-rating";

// Mock data
const mockStats = {
  rating: 1720,
  ratingChange: 45,
  rank: 156,
  totalPlayers: 5420,
  totalMatches: 45,
  wins: 28,
  losses: 17,
  winRate: 62,
  winStreak: 3,
  recentForm: ["W", "W", "L", "W", "W"] as ("W" | "L")[],
};

const mockUpcomingMatches = [
  {
    id: "m1",
    tournament: "서울 오픈 대회",
    opponent: { display_name: "이영희", rating: 1780, avatar: "" },
    scheduled_at: "2024-02-20T14:00:00Z",
    round: "8강전",
    court: "A코트",
  },
  {
    id: "m2",
    tournament: "강남 클럽 리그",
    opponent: { display_name: "박민수", rating: 1650, avatar: "" },
    scheduled_at: "2024-02-22T18:00:00Z",
    round: "리그전",
    court: "B코트",
  },
];

const mockRegisteredTournaments = [
  {
    id: "t1",
    title: "2024 서울 오픈 탁구 대회",
    tournament_start: "2024-02-20",
    status: "upcoming",
    seed: 8,
    participants: 32,
  },
  {
    id: "t2",
    title: "강남 클럽 리그 시즌 3",
    tournament_start: "2024-03-01",
    status: "registrationOpen",
    seed: null,
    participants: 16,
  },
];

const mockRecentActivity = [
  {
    type: "match_completed",
    title: "경기 완료",
    description: "vs 박민수 (3-1 승리)",
    time: "2시간 전",
    icon: Trophy,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  {
    type: "rating_change",
    title: "레이팅 상승",
    description: "+15 (1705 → 1720)",
    time: "2시간 전",
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    type: "tournament_registered",
    title: "대회 등록",
    description: "서울 오픈 대회 참가 신청 완료",
    time: "1일 전",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    type: "achievement",
    title: "업적 달성",
    description: "연속 5승 달성!",
    time: "2일 전",
    icon: Star,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
];

export default function DashboardPage() {
  const t = useTranslations();
  const { profile } = useAuth();
  const displayName = profile?.display_name || "사용자";
  const tierInfo = getTierInfo(mockStats.rating);

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {new Date().toLocaleDateString("ko-KR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-3xl font-bold">
          {t("dashboard.welcome", { name: displayName })}
        </h1>
        <p className="mt-1 text-muted-foreground">
          오늘의 활동과 경기 일정을 확인하세요
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Rating Card */}
        <Card className="glass-card border-white/5 overflow-hidden group hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("rankings.rating")}</p>
                <p className="text-3xl font-bold">{mockStats.rating}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {mockStats.ratingChange > 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400">+{mockStats.ratingChange}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-400">{mockStats.ratingChange}</span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">이번 주</span>
                </div>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `${tierInfo.color}20` }}
              >
                {tierInfo.icon}
              </div>
            </div>
            <Badge
              className="mt-3"
              style={{ backgroundColor: tierInfo.color, color: "#fff" }}
            >
              {tierInfo.koreanName}
            </Badge>
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card className="glass-card border-white/5 overflow-hidden group hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">현재 순위</p>
                <p className="text-3xl font-bold">#{mockStats.rank}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  상위 {Math.round((mockStats.rank / mockStats.totalPlayers) * 100)}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <Medal className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <Progress value={100 - (mockStats.rank / mockStats.totalPlayers) * 100} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* Win Rate Card */}
        <Card className="glass-card border-white/5 overflow-hidden group hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("rankings.winRate")}</p>
                <p className="text-3xl font-bold">{mockStats.winRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mockStats.wins}승 {mockStats.losses}패
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <Progress value={mockStats.winRate} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* Win Streak Card */}
        <Card className="glass-card border-white/5 overflow-hidden group hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">연승</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{mockStats.winStreak}</p>
                  {mockStats.winStreak >= 3 && <Flame className="h-6 w-6 text-orange-400 animate-pulse" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  연승 기록: 8회
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                <Zap className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Matches */}
          <Card className="glass-card border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-400" />
                  {t("dashboard.upcomingMatches")}
                </CardTitle>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                  {mockUpcomingMatches.length}개 예정
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {mockUpcomingMatches.length > 0 ? (
                <div className="space-y-3">
                  {mockUpcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between rounded-xl glass p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 ring-2 ring-white/10">
                            <AvatarImage src={match.opponent.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                              {match.opponent.display_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card flex items-center justify-center text-[10px] font-bold ring-2 ring-card">
                            {match.opponent.rating}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">vs {match.opponent.display_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.tournament} · {match.round}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(match.scheduled_at).toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(match.scheduled_at).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} · {match.court}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">예정된 경기가 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Tournaments */}
          <Card className="glass-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                {t("dashboard.myTournaments")}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
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
                    className="flex items-center justify-between rounded-xl glass p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                        <Trophy className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-white transition-colors">{tournament.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(tournament.tournament_start).toLocaleDateString("ko-KR", {
                            month: "long",
                            day: "numeric",
                          })}
                          <span>·</span>
                          <Users className="h-3 w-3" />
                          {tournament.participants}명
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tournament.seed && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                          시드 #{tournament.seed}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          tournament.status === "upcoming"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-blue-500/30 text-blue-400"
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
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                최근 경기 폼
              </CardTitle>
              <CardDescription>최근 5경기 결과</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {mockStats.recentForm.map((result, i) => (
                  <div
                    key={i}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white transition-transform hover:scale-110 ${
                      result === "W"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25"
                        : "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                    }`}
                  >
                    {result}
                  </div>
                ))}
                <div className="ml-4 text-sm text-muted-foreground">
                  최근 5경기 중 <span className="text-emerald-400 font-semibold">4승</span> <span className="text-red-400 font-semibold">1패</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="glass-card border-white/5 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20" />
            <CardContent className="relative px-6 pb-6">
              <div className="flex flex-col items-center -mt-12">
                <Avatar className="h-24 w-24 ring-4 ring-card">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-2xl font-bold">
                    {displayName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold">{displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  @{profile?.username || "user"}
                </p>

                <div className="flex items-center gap-1 mt-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">{mockStats.rating} RP</span>
                </div>

                <div className="mt-6 w-full grid grid-cols-3 gap-4 text-center">
                  <div className="glass rounded-xl p-3">
                    <p className="text-xl font-bold text-emerald-400">{mockStats.wins}</p>
                    <p className="text-xs text-muted-foreground">{t("rankings.wins")}</p>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <p className="text-xl font-bold text-red-400">{mockStats.losses}</p>
                    <p className="text-xs text-muted-foreground">{t("rankings.losses")}</p>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <p className="text-xl font-bold">{mockStats.totalMatches}</p>
                    <p className="text-xs text-muted-foreground">총 경기</p>
                  </div>
                </div>

                <Button className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0" asChild>
                  <Link href="/profile">
                    {t("profile.editProfile")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                {t("dashboard.recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.bgColor}`}>
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle>빠른 메뉴</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 hover:border-white/20" asChild>
                <Link href="/tournaments">
                  <Trophy className="mr-2 h-4 w-4 text-amber-400" />
                  대회 찾기
                </Link>
              </Button>
              <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 hover:border-white/20" asChild>
                <Link href="/rankings">
                  <BarChart3 className="mr-2 h-4 w-4 text-emerald-400" />
                  랭킹 보기
                </Link>
              </Button>
              <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 hover:border-white/20" asChild>
                <Link href="/tools">
                  <Zap className="mr-2 h-4 w-4 text-purple-400" />
                  도구 & 통계
                </Link>
              </Button>
              <Button variant="outline" className="justify-start border-white/10 hover:bg-white/5 hover:border-white/20" asChild>
                <Link href="/community">
                  <Users className="mr-2 h-4 w-4 text-blue-400" />
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
