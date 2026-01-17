"use client";

import {
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Zap,
  Award,
  Activity,
  PieChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getTierInfo } from "@/lib/elo-rating";
import { cn } from "@/lib/utils";

interface PlayerStats {
  // 기본 정보
  rating: number;
  ratingChange: number; // 이번 주 변화
  rank: number;
  totalPlayers: number;

  // 경기 통계
  totalMatches: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;

  // 세트/점수 통계
  totalSetsWon: number;
  totalSetsLost: number;
  totalPointsWon: number;
  totalPointsLost: number;

  // 대회 통계
  tournamentsPlayed: number;
  tournamentsWon: number;
  bestTournamentResult: string;

  // 라이벌 정보
  topRivals: Array<{
    id: string;
    name: string;
    matches: number;
    myWins: number;
    theirWins: number;
    lastMatch: string;
  }>;

  // 최근 폼 (최근 10경기)
  recentForm: ("W" | "L")[];

  // 시간대별 통계
  peakHours: { hour: number; winRate: number }[];
}

interface StatsDashboardProps {
  stats: PlayerStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const tierInfo = getTierInfo(stats.rating);
  const winRate = stats.totalMatches > 0
    ? Math.round((stats.wins / stats.totalMatches) * 100)
    : 0;
  const setWinRate =
    stats.totalSetsWon + stats.totalSetsLost > 0
      ? Math.round(
          (stats.totalSetsWon / (stats.totalSetsWon + stats.totalSetsLost)) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Rating Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">레이팅</CardTitle>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${tierInfo.color}20` }}
            >
              {tierInfo.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating}</div>
            <div className="flex items-center gap-1 text-xs">
              {stats.ratingChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{stats.ratingChange}</span>
                </>
              ) : stats.ratingChange < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">{stats.ratingChange}</span>
                </>
              ) : (
                <span className="text-muted-foreground">변동 없음</span>
              )}
              <span className="text-muted-foreground ml-1">이번 주</span>
            </div>
            <Badge
              className="mt-2"
              style={{ backgroundColor: tierInfo.color, color: "#fff" }}
            >
              {tierInfo.koreanName}
            </Badge>
          </CardContent>
        </Card>

        {/* Win Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.wins}승 {stats.losses}패
            </p>
            <Progress value={winRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">랭킹</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{stats.rank}</div>
            <p className="text-xs text-muted-foreground">
              상위 {Math.round((stats.rank / stats.totalPlayers) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              전체 {stats.totalPlayers.toLocaleString()}명 중
            </p>
          </CardContent>
        </Card>

        {/* Win Streak Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연승</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.winStreak > 0 && "🔥"}
              {stats.winStreak}연승
            </div>
            <p className="text-xs text-muted-foreground">
              최고 기록: {stats.bestWinStreak}연승
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Form & Rivals */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              최근 경기 폼
            </CardTitle>
            <CardDescription>최근 10경기 결과</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1.5">
              {stats.recentForm.map((result, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white transition-transform hover:scale-110",
                    result === "W" ? "bg-green-500" : "bg-red-500"
                  )}
                >
                  {result}
                </div>
              ))}
              {stats.recentForm.length === 0 && (
                <p className="text-sm text-muted-foreground">경기 기록이 없습니다</p>
              )}
            </div>

            <Separator className="my-4" />

            {/* Set & Point Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">세트 승률</p>
                <p className="text-lg font-semibold">{setWinRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalSetsWon}:{stats.totalSetsLost}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">평균 득점</p>
                <p className="text-lg font-semibold">
                  {stats.totalMatches > 0
                    ? Math.round(stats.totalPointsWon / stats.totalMatches)
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">경기당</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rivals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              라이벌 현황
            </CardTitle>
            <CardDescription>자주 대결한 상대</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topRivals.length > 0 ? (
              <div className="space-y-4">
                {stats.topRivals.map((rival, index) => (
                  <div
                    key={rival.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                          index === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{rival.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {rival.matches}경기
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-semibold">
                          {rival.myWins}
                        </span>
                        <span className="text-muted-foreground">:</span>
                        <span className="text-red-600 font-semibold">
                          {rival.theirWins}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(
                          (rival.myWins / rival.matches) * 100
                        )}% 승률
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                아직 라이벌이 없습니다
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tournament Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            대회 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.tournamentsPlayed}</p>
              <p className="text-sm text-muted-foreground">참가 대회</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">
                {stats.tournamentsWon}
              </p>
              <p className="text-sm text-muted-foreground">우승</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {stats.tournamentsPlayed > 0
                  ? Math.round(
                      (stats.tournamentsWon / stats.tournamentsPlayed) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-muted-foreground">우승률</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.bestTournamentResult || "-"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">최고 성적</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Hours Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            시간대별 승률
          </CardTitle>
          <CardDescription>
            가장 컨디션이 좋은 시간대를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const data = stats.peakHours.find((h) => h.hour === hour);
              const winRate = data?.winRate || 0;
              const intensity = winRate / 100;

              return (
                <div key={hour} className="flex flex-col items-center gap-1">
                  <div
                    className="h-12 w-8 rounded-sm transition-colors"
                    style={{
                      backgroundColor:
                        winRate > 0
                          ? `rgba(34, 197, 94, ${intensity})`
                          : "rgba(0,0,0,0.05)",
                    }}
                    title={`${hour}시: ${winRate}%`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {hour % 6 === 0 ? `${hour}시` : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>낮은 승률</span>
            <div className="flex gap-0.5">
              {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                <div
                  key={opacity}
                  className="h-3 w-6 rounded-sm"
                  style={{ backgroundColor: `rgba(34, 197, 94, ${opacity})` }}
                />
              ))}
            </div>
            <span>높은 승률</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
