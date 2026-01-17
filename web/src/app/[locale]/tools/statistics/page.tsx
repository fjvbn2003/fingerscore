"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Flame,
  Medal,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data
const mockPersonalStats = {
  rating: 1580,
  highestRating: 1650,
  rank: 234,
  totalPlayers: 5420,
  totalMatches: 152,
  wins: 98,
  losses: 54,
  winRate: 64.5,
  winStreak: 4,
  bestWinStreak: 8,
  recentForm: ["W", "W", "L", "W", "W", "L", "W", "W", "W", "L"] as ("W" | "L")[],
  ratingHistory: [
    { date: "2024-01", rating: 1200 },
    { date: "2024-02", rating: 1280 },
    { date: "2024-03", rating: 1350 },
    { date: "2024-04", rating: 1320 },
    { date: "2024-05", rating: 1420 },
    { date: "2024-06", rating: 1480 },
    { date: "2024-07", rating: 1520 },
    { date: "2024-08", rating: 1580 },
  ],
  monthlyMatches: [
    { month: "1월", matches: 12 },
    { month: "2월", matches: 18 },
    { month: "3월", matches: 15 },
    { month: "4월", matches: 22 },
    { month: "5월", matches: 19 },
    { month: "6월", matches: 24 },
    { month: "7월", matches: 21 },
    { month: "8월", matches: 18 },
  ],
  rivals: [
    { id: "r1", name: "김철수", club: "강남 탁구클럽", matches: 12, myWins: 7, theirWins: 5, rating: 1620 },
    { id: "r2", name: "박영희", club: "송파 탁구사랑", matches: 8, myWins: 3, theirWins: 5, rating: 1650 },
    { id: "r3", name: "이민수", club: "서초 탁구클럽", matches: 6, myWins: 4, theirWins: 2, rating: 1540 },
    { id: "r4", name: "최지영", club: "용산 탁구동호회", matches: 5, myWins: 2, theirWins: 3, rating: 1590 },
  ],
};

const mockClubStats = {
  name: "서초 탁구클럽",
  totalMembers: 48,
  activeMembers: 42,
  avgRating: 1450,
  topRating: 1850,
  totalMatches: 1234,
  ratingDistribution: [
    { range: "1000-1200", count: 8 },
    { range: "1200-1400", count: 15 },
    { range: "1400-1600", count: 12 },
    { range: "1600-1800", count: 5 },
    { range: "1800+", count: 2 },
  ],
  topPlayers: [
    { id: "p1", name: "김철수", rating: 1850, wins: 120, losses: 45 },
    { id: "p2", name: "이영희", rating: 1780, wins: 98, losses: 52 },
    { id: "p3", name: "박민수", rating: 1720, wins: 85, losses: 60 },
    { id: "p4", name: "최지영", rating: 1680, wins: 78, losses: 55 },
    { id: "p5", name: "나", rating: 1580, wins: 98, losses: 54 },
  ],
  recentActivity: [
    { date: "2024-01-18", matches: 8 },
    { date: "2024-01-17", matches: 12 },
    { date: "2024-01-16", matches: 6 },
    { date: "2024-01-15", matches: 10 },
    { date: "2024-01-14", matches: 15 },
  ],
};

export default function StatisticsPage() {
  const t = useTranslations("statistics");

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          개인 전적, 구장별 통계, 레이팅 변화를 확인하세요
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="personal">
            <Users className="h-4 w-4 mr-2" />
            {t("personal")}
          </TabsTrigger>
          <TabsTrigger value="club">
            <Building2 className="h-4 w-4 mr-2" />
            {t("club")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Stats */}
        <TabsContent value="personal" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                    <Trophy className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("currentRating")}</p>
                    <p className="text-2xl font-bold">{mockPersonalStats.rating}</p>
                    <p className="text-xs text-muted-foreground">
                      최고: {mockPersonalStats.highestRating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("totalMatches")}</p>
                    <p className="text-2xl font-bold">{mockPersonalStats.totalMatches}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("wins")} {mockPersonalStats.wins} / {t("losses")} {mockPersonalStats.losses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                    <Target className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("winRate")}</p>
                    <p className="text-2xl font-bold">{mockPersonalStats.winRate}%</p>
                    <Progress value={mockPersonalStats.winRate} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                    <Flame className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("winStreak")}</p>
                    <p className="text-2xl font-bold">{mockPersonalStats.winStreak}연승</p>
                    <p className="text-xs text-muted-foreground">
                      최고: {mockPersonalStats.bestWinStreak}연승
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Form & Rating History */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Form */}
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  최근 전적
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {mockPersonalStats.recentForm.map((result, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm",
                        result === "W"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  최근 10경기: {mockPersonalStats.recentForm.filter((r) => r === "W").length}승{" "}
                  {mockPersonalStats.recentForm.filter((r) => r === "L").length}패
                </p>
              </CardContent>
            </Card>

            {/* Rating Chart */}
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  {t("ratingHistory")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end gap-2">
                  {mockPersonalStats.ratingHistory.map((data, i) => {
                    const maxRating = Math.max(...mockPersonalStats.ratingHistory.map((d) => d.rating));
                    const minRating = Math.min(...mockPersonalStats.ratingHistory.map((d) => d.rating));
                    const height = ((data.rating - minRating) / (maxRating - minRating)) * 100 + 20;
                    const isLatest = i === mockPersonalStats.ratingHistory.length - 1;
                    return (
                      <div key={data.date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-full rounded-t-lg transition-all",
                            isLatest
                              ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                              : "bg-gradient-to-t from-blue-500/50 to-blue-400/50"
                          )}
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{data.date.split("-")[1]}월</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Head to Head */}
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                {t("headToHead")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPersonalStats.rivals.map((rival) => {
                  const winRate = (rival.myWins / rival.matches) * 100;
                  return (
                    <div
                      key={rival.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {rival.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{rival.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {rival.club} · {rival.rating}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">
                            <span className="text-emerald-400">{rival.myWins}</span>
                            {" : "}
                            <span className="text-red-400">{rival.theirWins}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">{rival.matches}경기</p>
                        </div>
                        <div className="w-24">
                          <Progress value={winRate} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1 text-center">
                            {winRate.toFixed(0)}%
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Club Stats */}
        <TabsContent value="club" className="space-y-6">
          {/* Club Summary */}
          <Card className="glass-card border-white/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl font-bold text-white">
                  {mockClubStats.name[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{mockClubStats.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mockClubStats.totalMembers}명 회원
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      평균 {mockClubStats.avgRating}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {mockClubStats.totalMatches}경기
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution & Top Players */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Rating Distribution */}
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  {t("ratingDistribution")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockClubStats.ratingDistribution.map((item) => {
                    const maxCount = Math.max(
                      ...mockClubStats.ratingDistribution.map((d) => d.count)
                    );
                    const percentage = (item.count / maxCount) * 100;
                    return (
                      <div key={item.range} className="flex items-center gap-3">
                        <span className="w-24 text-sm text-muted-foreground">{item.range}</span>
                        <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs font-medium">{item.count}명</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Players */}
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-400" />
                  {t("topPlayers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockClubStats.topPlayers.map((player, i) => (
                    <div
                      key={player.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl",
                        player.name === "나" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                            i === 0
                              ? "bg-amber-500/20 text-amber-400"
                              : i === 1
                              ? "bg-gray-400/20 text-gray-400"
                              : i === 2
                              ? "bg-orange-600/20 text-orange-500"
                              : "bg-white/10 text-muted-foreground"
                          )}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {player.name}
                            {player.name === "나" && (
                              <Badge variant="outline" className="ml-2 border-emerald-500/30 text-emerald-400 text-xs">
                                나
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {player.wins}승 {player.losses}패
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{player.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
