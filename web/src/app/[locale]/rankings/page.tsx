"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SportType } from "@/types/database";

const mockRankings = [
  {
    rank: 1,
    previous_rank: 1,
    id: "u1",
    display_name: "김철수",
    avatar_url: null,
    rating: 2150,
    total_matches: 89,
    total_wins: 72,
    total_losses: 17,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 2,
    previous_rank: 3,
    id: "u2",
    display_name: "이영희",
    avatar_url: null,
    rating: 2080,
    total_matches: 76,
    total_wins: 58,
    total_losses: 18,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 3,
    previous_rank: 2,
    id: "u3",
    display_name: "박민수",
    avatar_url: null,
    rating: 2045,
    total_matches: 82,
    total_wins: 61,
    total_losses: 21,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 4,
    previous_rank: 5,
    id: "u4",
    display_name: "정수진",
    avatar_url: null,
    rating: 1990,
    total_matches: 65,
    total_wins: 47,
    total_losses: 18,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 5,
    previous_rank: 4,
    id: "u5",
    display_name: "최동현",
    avatar_url: null,
    rating: 1965,
    total_matches: 71,
    total_wins: 49,
    total_losses: 22,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 6,
    previous_rank: 6,
    id: "u6",
    display_name: "강민지",
    avatar_url: null,
    rating: 1920,
    total_matches: 58,
    total_wins: 38,
    total_losses: 20,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 7,
    previous_rank: 9,
    id: "u7",
    display_name: "윤서준",
    avatar_url: null,
    rating: 1885,
    total_matches: 45,
    total_wins: 29,
    total_losses: 16,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 8,
    previous_rank: 7,
    id: "u8",
    display_name: "한지원",
    avatar_url: null,
    rating: 1860,
    total_matches: 52,
    total_wins: 32,
    total_losses: 20,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 9,
    previous_rank: 8,
    id: "u9",
    display_name: "임성호",
    avatar_url: null,
    rating: 1840,
    total_matches: 48,
    total_wins: 28,
    total_losses: 20,
    sport_type: "TABLE_TENNIS",
  },
  {
    rank: 10,
    previous_rank: 12,
    id: "u10",
    display_name: "조예진",
    avatar_url: null,
    rating: 1815,
    total_matches: 39,
    total_wins: 23,
    total_losses: 16,
    sport_type: "TABLE_TENNIS",
  },
];

function getRankChange(current: number, previous: number) {
  const diff = previous - current;
  if (diff > 0)
    return { icon: TrendingUp, color: "text-green-500", text: `+${diff}` };
  if (diff < 0)
    return {
      icon: TrendingDown,
      color: "text-red-500",
      text: `${diff}`,
    };
  return { icon: Minus, color: "text-gray-400", text: "-" };
}

function getRankBadge(rank: number) {
  if (rank === 1)
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
        <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Medal className="h-5 w-5 text-gray-500" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
        <Medal className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      </div>
    );
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
      <span className="text-lg font-bold text-muted-foreground">{rank}</span>
    </div>
  );
}

export default function RankingsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");

  const filteredRankings = mockRankings.filter((player) => {
    const matchesSearch = player.display_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSport =
      sportFilter === "all" || player.sport_type === sportFilter;
    return matchesSearch && matchesSport;
  });

  // Top 3 players
  const topPlayers = filteredRankings.slice(0, 3);
  const otherPlayers = filteredRankings.slice(3);

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("rankings.title")}</h1>
        <p className="mt-1 text-muted-foreground">
          ELO 레이팅 기반 실력 순위를 확인하세요
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[1, 0, 2].map((index) => {
          const player = topPlayers[index];
          if (!player) return null;
          const isFirst = player.rank === 1;

          return (
            <Card
              key={player.id}
              className={`relative overflow-hidden ${
                isFirst ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {isFirst && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
              )}
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4">{getRankBadge(player.rank)}</div>
                <Avatar className="mb-3 h-20 w-20">
                  <AvatarImage src={player.avatar_url || ""} />
                  <AvatarFallback className="text-2xl">
                    {player.display_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{player.display_name}</h3>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {player.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("rankings.rating")}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                  <span>
                    {t("rankings.wins")}: {player.total_wins}
                  </span>
                  <span>
                    {t("rankings.losses")}: {player.total_losses}
                  </span>
                </div>
                <Badge variant="secondary" className="mt-3">
                  {t("rankings.winRate")}:{" "}
                  {Math.round(
                    (player.total_wins / player.total_matches) * 100
                  )}
                  %
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="종목 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 종목</SelectItem>
            <SelectItem value="TABLE_TENNIS">
              {t("tournaments.sportType.TABLE_TENNIS")}
            </SelectItem>
            <SelectItem value="TENNIS">
              {t("tournaments.sportType.TENNIS")}
            </SelectItem>
            <SelectItem value="BADMINTON">
              {t("tournaments.sportType.BADMINTON")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>전체 순위</CardTitle>
          <CardDescription>
            총 {filteredRankings.length}명의 선수
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">{t("rankings.rank")}</div>
              <div className="col-span-1"></div>
              <div className="col-span-4">{t("rankings.player")}</div>
              <div className="col-span-2 text-right">{t("rankings.rating")}</div>
              <div className="col-span-2 text-right">{t("rankings.wins")}/{t("rankings.losses")}</div>
              <div className="col-span-2 text-right">{t("rankings.winRate")}</div>
            </div>

            {/* Table Body */}
            {filteredRankings.map((player) => {
              const change = getRankChange(player.rank, player.previous_rank);
              const ChangeIcon = change.icon;
              const winRate = Math.round(
                (player.total_wins / player.total_matches) * 100
              );

              return (
                <Link
                  key={player.id}
                  href={`/profile/${player.id}`}
                  className="grid grid-cols-12 items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="col-span-1">
                    {getRankBadge(player.rank)}
                  </div>
                  <div className="col-span-1">
                    <div
                      className={`flex items-center gap-1 text-xs ${change.color}`}
                    >
                      <ChangeIcon className="h-3 w-3" />
                      <span>{change.text}</span>
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={player.avatar_url || ""} />
                      <AvatarFallback>{player.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.display_name}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-bold text-primary">
                      {player.rating}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-sm">
                    <span className="text-green-600">{player.total_wins}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className="text-red-600">{player.total_losses}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <Badge
                      variant={
                        winRate >= 60
                          ? "default"
                          : winRate >= 50
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {winRate}%
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
