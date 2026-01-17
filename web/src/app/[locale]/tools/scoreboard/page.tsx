"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Tv2,
  TrendingUp,
  TrendingDown,
  Trophy,
  Zap,
  Eye,
  Clock,
  MapPin,
  Filter,
  ChevronRight,
  Flame,
  Sparkles,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportType, VisibilityType } from "@/types/database";

// Mock live scoreboard data
const mockScoreboardEntries = [
  {
    id: "1",
    sport_type: "TABLE_TENNIS" as SportType,
    player_a_name: "김철수",
    player_b_name: "박영희",
    player_a_rating: 1850,
    player_b_rating: 1720,
    score_summary: "3-1 (11-8, 9-11, 11-6, 11-9)",
    winner_name: "김철수",
    rating_change: 12,
    is_upset: false,
    club_name: "강남탁구클럽",
    created_at: "2026-01-18T10:32:00",
    visibility: "PUBLIC" as VisibilityType,
  },
  {
    id: "2",
    sport_type: "TENNIS" as SportType,
    player_a_name: "이민호",
    player_b_name: "정수진",
    player_a_rating: 1450,
    player_b_rating: 1680,
    score_summary: "2-1 (6-4, 4-6, 7-5)",
    winner_name: "이민호",
    rating_change: 28,
    is_upset: true,
    club_name: "서초테니스장",
    created_at: "2026-01-18T10:28:00",
    visibility: "PUBLIC" as VisibilityType,
  },
  {
    id: "3",
    sport_type: "BADMINTON" as SportType,
    player_a_name: "최영수",
    player_b_name: "한지민",
    player_a_rating: 1550,
    player_b_rating: 1580,
    score_summary: "2-0 (21-18, 21-19)",
    winner_name: "최영수",
    rating_change: 15,
    is_upset: false,
    club_name: "송파배드민턴센터",
    created_at: "2026-01-18T10:25:00",
    visibility: "PUBLIC" as VisibilityType,
  },
  {
    id: "4",
    sport_type: "TABLE_TENNIS" as SportType,
    player_a_name: "홍길동",
    player_b_name: "강민수",
    player_a_rating: 1920,
    player_b_rating: 1780,
    score_summary: "3-2 (11-9, 8-11, 11-13, 11-8, 11-9)",
    winner_name: "홍길동",
    rating_change: 10,
    is_upset: false,
    club_name: "강남탁구클럽",
    created_at: "2026-01-18T10:20:00",
    visibility: "PUBLIC" as VisibilityType,
  },
  {
    id: "5",
    sport_type: "TABLE_TENNIS" as SportType,
    player_a_name: "김영진",
    player_b_name: "박지훈",
    player_a_rating: 1650,
    player_b_rating: 1900,
    score_summary: "3-0 (11-7, 11-9, 11-8)",
    winner_name: "김영진",
    rating_change: 35,
    is_upset: true,
    club_name: "역삼탁구장",
    created_at: "2026-01-18T10:15:00",
    visibility: "PUBLIC" as VisibilityType,
  },
];

const sportConfig: Record<SportType, { color: string; icon: string; label: string; bgGradient: string }> = {
  TABLE_TENNIS: {
    color: "text-orange-400",
    icon: "🏓",
    label: "탁구",
    bgGradient: "from-orange-500/20 to-orange-600/10"
  },
  TENNIS: {
    color: "text-green-400",
    icon: "🎾",
    label: "테니스",
    bgGradient: "from-green-500/20 to-green-600/10"
  },
  BADMINTON: {
    color: "text-blue-400",
    icon: "🏸",
    label: "배드민턴",
    bgGradient: "from-blue-500/20 to-blue-600/10"
  },
};

// Animated score entry component
function ScoreboardEntry({ entry, index }: { entry: typeof mockScoreboardEntries[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return t("scoreboard.justNow");
    if (minutes < 60) return t("scoreboard.minutesAgo", { minutes });
    const hours = Math.floor(minutes / 60);
    return t("scoreboard.hoursAgo", { hours });
  };

  const isWinnerA = entry.winner_name === entry.player_a_name;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${entry.is_upset
          ? "bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border-amber-500/30"
          : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50"
        }
      `}
    >
      {/* Upset Banner */}
      {entry.is_upset && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-amber-500 to-red-500 text-white text-xs font-bold rounded-bl-lg flex items-center gap-1">
          <Flame className="h-3 w-3 animate-pulse" />
          {t("scoreboard.upset")}
        </div>
      )}

      <div className="p-4">
        {/* Sport & Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`bg-gradient-to-r ${sportConfig[entry.sport_type].bgGradient} ${sportConfig[entry.sport_type].color} border-0`}>
              {sportConfig[entry.sport_type].icon} {sportConfig[entry.sport_type].label}
            </Badge>
            {entry.club_name && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {entry.club_name}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(entry.created_at)}
          </span>
        </div>

        {/* Players & Score */}
        <div className="flex items-center gap-4">
          {/* Player A */}
          <div className={`flex-1 text-center ${isWinnerA ? "" : "opacity-60"}`}>
            <div className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
              {isWinnerA && <Trophy className="h-4 w-4 text-amber-400" />}
              {entry.player_a_name}
            </div>
            <div className={`text-sm font-mono ${isWinnerA ? "text-emerald-400" : "text-slate-400"}`}>
              {entry.player_a_rating}
              {isWinnerA && (
                <span className="text-emerald-400 ml-1">
                  <TrendingUp className="h-3 w-3 inline" />
                  +{entry.rating_change}
                </span>
              )}
            </div>
          </div>

          {/* VS */}
          <div className="px-4 py-2 rounded-full bg-slate-800/50">
            <span className="text-slate-400 text-sm font-bold">VS</span>
          </div>

          {/* Player B */}
          <div className={`flex-1 text-center ${!isWinnerA ? "" : "opacity-60"}`}>
            <div className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
              {!isWinnerA && <Trophy className="h-4 w-4 text-amber-400" />}
              {entry.player_b_name}
            </div>
            <div className={`text-sm font-mono ${!isWinnerA ? "text-emerald-400" : "text-slate-400"}`}>
              {entry.player_b_rating}
              {!isWinnerA && (
                <span className="text-emerald-400 ml-1">
                  <TrendingUp className="h-3 w-3 inline" />
                  +{entry.rating_change}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="mt-3 text-center">
          <span className="text-sm text-slate-300 font-mono bg-slate-800/50 px-3 py-1 rounded-full">
            {entry.score_summary}
          </span>
        </div>
      </div>

      {/* Animated gradient border for recent entries */}
      {index === 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-xl animate-pulse opacity-30 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      )}
    </div>
  );
}

export default function ScoreboardPage() {
  const t = useTranslations();
  const [selectedSport, setSelectedSport] = useState<SportType | "ALL">("ALL");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [entries, setEntries] = useState(mockScoreboardEntries);

  // Simulate new entries coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, would poll or use websocket
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesSport = selectedSport === "ALL" || entry.sport_type === selectedSport;
    return matchesSport;
  });

  const upsetEntries = filteredEntries.filter((e) => e.is_upset);
  const todayStats = {
    totalMatches: filteredEntries.length,
    upsets: upsetEntries.length,
    avgRatingChange: Math.round(
      filteredEntries.reduce((acc, e) => acc + e.rating_change, 0) / filteredEntries.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Tv2 className="h-6 w-6 text-red-400" />
            {t("scoreboard.title")}
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              {t("scoreboard.liveNow")}
            </Badge>
          </h1>
          <p className="text-slate-400 mt-1">{t("scoreboard.description")}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Trophy className="h-4 w-4" />
            <span className="text-sm">오늘의 경기</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">{todayStats.totalMatches}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-red-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Flame className="h-4 w-4" />
            <span className="text-sm">이변</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">{todayStats.upsets}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">평균 레이팅 변화</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">±{todayStats.avgRatingChange}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={selectedSport} onValueChange={(v) => setSelectedSport(v as SportType | "ALL")}>
          <SelectTrigger className="w-[160px] bg-slate-800/50 border-slate-700 text-slate-100">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("sports.selectSport")} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="ALL">{t("sports.allSports")}</SelectItem>
            <SelectItem value="TABLE_TENNIS">🏓 {t("sports.tableTennis")}</SelectItem>
            <SelectItem value="TENNIS">🎾 {t("sports.tennis")}</SelectItem>
            <SelectItem value="BADMINTON">🏸 {t("sports.badminton")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger
            value="global"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {t("scoreboard.globalFeed")}
          </TabsTrigger>
          <TabsTrigger
            value="club"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t("scoreboard.clubFeed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-4 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Tv2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("scoreboard.noMatches")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <ScoreboardEntry key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="club" className="mt-4">
          <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
            <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">운동 장소를 등록하면 해당 구장의 경기 결과를 볼 수 있습니다</p>
            <Button variant="outline" className="mt-4 border-slate-700 text-slate-300">
              운동 장소 등록하기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
