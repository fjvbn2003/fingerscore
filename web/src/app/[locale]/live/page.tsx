"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Radio,
  Users,
  Eye,
  Clock,
  Trophy,
  Play,
  ChevronRight,
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
import type { SportType } from "@/types/database";

const mockLiveMatches = [
  {
    id: "live1",
    tournament: {
      id: "t1",
      title: "서울 오픈 대회",
      sport_type: "TABLE_TENNIS" as SportType,
    },
    round: 2,
    match_number: 1,
    player_a: {
      id: "p1",
      display_name: "김철수",
      avatar_url: null,
      rating: 1850,
    },
    player_b: {
      id: "p2",
      display_name: "이영희",
      avatar_url: null,
      rating: 1780,
    },
    current_score_a: 2,
    current_score_b: 1,
    current_set_score_a: 9,
    current_set_score_b: 7,
    sets: [
      { a: 11, b: 8 },
      { a: 9, b: 11 },
      { a: 11, b: 6 },
    ],
    is_serving_a: true,
    viewers: 45,
    started_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "live2",
    tournament: {
      id: "t1",
      title: "서울 오픈 대회",
      sport_type: "TABLE_TENNIS" as SportType,
    },
    round: 2,
    match_number: 2,
    player_a: {
      id: "p3",
      display_name: "박민수",
      avatar_url: null,
      rating: 1720,
    },
    player_b: {
      id: "p4",
      display_name: "정수진",
      avatar_url: null,
      rating: 1690,
    },
    current_score_a: 1,
    current_score_b: 1,
    current_set_score_a: 5,
    current_set_score_b: 8,
    sets: [
      { a: 11, b: 9 },
      { a: 8, b: 11 },
    ],
    is_serving_a: false,
    viewers: 32,
    started_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "live3",
    tournament: {
      id: "t2",
      title: "강남 클럽 리그",
      sport_type: "TABLE_TENNIS" as SportType,
    },
    round: 1,
    match_number: 5,
    player_a: {
      id: "p5",
      display_name: "최동현",
      avatar_url: null,
      rating: 1650,
    },
    player_b: {
      id: "p6",
      display_name: "강민지",
      avatar_url: null,
      rating: 1620,
    },
    current_score_a: 0,
    current_score_b: 0,
    current_set_score_a: 3,
    current_set_score_b: 2,
    sets: [],
    is_serving_a: true,
    viewers: 18,
    started_at: "2024-01-20T15:00:00Z",
  },
];

const mockRecentMatches = [
  {
    id: "recent1",
    tournament: { title: "서울 오픈 대회" },
    player_a: { display_name: "윤서준", rating: 1700 },
    player_b: { display_name: "한지원", rating: 1680 },
    score_a: 3,
    score_b: 2,
    completed_at: "2024-01-20T14:00:00Z",
  },
  {
    id: "recent2",
    tournament: { title: "서울 오픈 대회" },
    player_a: { display_name: "임성호", rating: 1750 },
    player_b: { display_name: "조예진", rating: 1710 },
    score_a: 3,
    score_b: 0,
    completed_at: "2024-01-20T13:30:00Z",
  },
];

function formatDuration(startTime: string) {
  const start = new Date(startTime);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);
  return `${diffInMinutes}분`;
}

export default function LivePage() {
  const t = useTranslations();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for duration display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="h-6 w-6 text-red-500" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          </div>
          <h1 className="text-3xl font-bold">{t("live.title")}</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          진행 중인 경기를 실시간으로 관전하세요
        </p>
      </div>

      {/* Live Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockLiveMatches.length}</p>
              <p className="text-sm text-muted-foreground">진행 중인 경기</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockLiveMatches.reduce((sum, m) => sum + m.viewers, 0)}
              </p>
              <p className="text-sm text-muted-foreground">총 관전자</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">진행 중인 대회</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Matches */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">실시간 경기</h2>
        {mockLiveMatches.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {mockLiveMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="gap-1">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        LIVE
                      </Badge>
                      <Badge variant="outline">
                        {t(`tournaments.sportType.${match.tournament.sport_type}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{match.viewers}</span>
                      <Clock className="ml-2 h-4 w-4" />
                      <span>{formatDuration(match.started_at)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/tournaments/${match.tournament.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {match.tournament.title} - {t("match.round", { number: match.round })}
                  </Link>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Player A */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={match.player_a.avatar_url || ""} />
                          <AvatarFallback className="text-xl">
                            {match.player_a.display_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {match.is_serving_a && (
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                            S
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          {match.player_a.display_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {match.player_a.rating}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-2">
                      {/* Set Score */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-4xl font-bold ${
                            match.current_score_a > match.current_score_b
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {match.current_score_a}
                        </span>
                        <span className="text-2xl text-muted-foreground">:</span>
                        <span
                          className={`text-4xl font-bold ${
                            match.current_score_b > match.current_score_a
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {match.current_score_b}
                        </span>
                      </div>
                      {/* Current Game Score */}
                      <div className="flex items-center gap-2 rounded bg-muted px-3 py-1 text-sm">
                        <span
                          className={
                            match.current_set_score_a > match.current_set_score_b
                              ? "font-bold"
                              : ""
                          }
                        >
                          {match.current_set_score_a}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span
                          className={
                            match.current_set_score_b > match.current_set_score_a
                              ? "font-bold"
                              : ""
                          }
                        >
                          {match.current_set_score_b}
                        </span>
                      </div>
                      {/* Previous Sets */}
                      {match.sets.length > 0 && (
                        <div className="flex gap-1 text-xs text-muted-foreground">
                          {match.sets.map((set, i) => (
                            <span key={i} className="rounded bg-muted px-1.5 py-0.5">
                              {set.a}-{set.b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Player B */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={match.player_b.avatar_url || ""} />
                          <AvatarFallback className="text-xl">
                            {match.player_b.display_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {!match.is_serving_a && (
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                            S
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          {match.player_b.display_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {match.player_b.rating}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="mt-4 w-full" variant="outline" asChild>
                    <Link href={`/live/${match.id}`}>
                      자세히 보기
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Radio className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">{t("live.noLiveMatches")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                잠시 후 다시 확인해주세요
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Matches */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">최근 종료된 경기</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockRecentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {match.tournament.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={
                        match.score_a > match.score_b ? "font-bold" : ""
                      }
                    >
                      {match.player_a.display_name}
                    </span>
                    <div className="flex items-center gap-2 rounded bg-muted px-3 py-1 font-mono">
                      <span
                        className={match.score_a > match.score_b ? "font-bold" : ""}
                      >
                        {match.score_a}
                      </span>
                      <span>:</span>
                      <span
                        className={match.score_b > match.score_a ? "font-bold" : ""}
                      >
                        {match.score_b}
                      </span>
                    </div>
                    <span
                      className={
                        match.score_b > match.score_a ? "font-bold" : ""
                      }
                    >
                      {match.player_b.display_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
