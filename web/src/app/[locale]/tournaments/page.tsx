"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Search,
  Plus,
  ChevronRight,
  Sparkles,
  Clock,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Progress } from "@/components/ui/progress";
import type { SportType, TournamentType, MatchFormat } from "@/types/database";

// Mock data for tournaments
const mockTournaments = [
  {
    id: "1",
    title: "2024 서울 오픈 탁구 대회",
    sport_type: "TABLE_TENNIS" as SportType,
    tournament_type: "SINGLE_ELIMINATION" as TournamentType,
    match_format: "SINGLES" as MatchFormat,
    location: "서울특별시",
    venue: "올림픽공원 체육관",
    registration_start: "2024-02-01",
    registration_end: "2024-02-15",
    tournament_start: "2024-02-20",
    max_participants: 32,
    current_participants: 24,
    entry_fee: 20000,
    is_published: true,
    status: "registrationOpen",
    prize: "100만원",
  },
  {
    id: "2",
    title: "강남 클럽 리그 시즌 3",
    sport_type: "TABLE_TENNIS" as SportType,
    tournament_type: "DOUBLE_ELIMINATION" as TournamentType,
    match_format: "SINGLES" as MatchFormat,
    location: "서울특별시 강남구",
    venue: "강남 탁구 클럽",
    registration_start: "2024-01-15",
    registration_end: "2024-01-25",
    tournament_start: "2024-01-28",
    max_participants: 16,
    current_participants: 16,
    entry_fee: 15000,
    is_published: true,
    status: "inProgress",
    prize: "50만원",
  },
  {
    id: "3",
    title: "2024 배드민턴 전국 챔피언십",
    sport_type: "BADMINTON" as SportType,
    tournament_type: "SINGLE_ELIMINATION" as TournamentType,
    match_format: "DOUBLES" as MatchFormat,
    location: "부산광역시",
    venue: "부산 실내체육관",
    registration_start: "2024-03-01",
    registration_end: "2024-03-15",
    tournament_start: "2024-03-25",
    max_participants: 64,
    current_participants: 28,
    entry_fee: 30000,
    is_published: true,
    status: "upcoming",
    prize: "200만원",
  },
  {
    id: "4",
    title: "신년 테니스 토너먼트",
    sport_type: "TENNIS" as SportType,
    tournament_type: "SINGLE_ELIMINATION" as TournamentType,
    match_format: "SINGLES" as MatchFormat,
    location: "대전광역시",
    venue: "한밭 테니스장",
    registration_start: "2024-01-01",
    registration_end: "2024-01-10",
    tournament_start: "2024-01-15",
    max_participants: 32,
    current_participants: 32,
    entry_fee: 25000,
    is_published: true,
    status: "completed",
    prize: "80만원",
  },
];

const sportTypeConfig: Record<SportType, { color: string; bgColor: string; icon: string }> = {
  TABLE_TENNIS: { color: "text-orange-400", bgColor: "bg-orange-500/20", icon: "🏓" },
  TENNIS: { color: "text-green-400", bgColor: "bg-green-500/20", icon: "🎾" },
  BADMINTON: { color: "text-blue-400", bgColor: "bg-blue-500/20", icon: "🏸" },
};

const statusConfig: Record<string, { color: string; bgColor: string; borderColor: string; label: string }> = {
  upcoming: { color: "text-muted-foreground", bgColor: "bg-muted/50", borderColor: "border-white/10", label: "예정" },
  registrationOpen: { color: "text-emerald-400", bgColor: "bg-emerald-500/20", borderColor: "border-emerald-500/30", label: "모집중" },
  registrationClosed: { color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/30", label: "모집마감" },
  inProgress: { color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30", label: "진행중" },
  completed: { color: "text-muted-foreground", bgColor: "bg-muted/50", borderColor: "border-white/10", label: "종료" },
};

export default function TournamentsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");

  const filteredTournaments = mockTournaments.filter((tournament) => {
    const matchesSearch = tournament.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSport =
      sportFilter === "all" || tournament.sport_type === sportFilter;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="container max-w-screen-2xl py-8 px-4 md:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium mb-3">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">
                {mockTournaments.filter(t => t.status === "registrationOpen").length}개 대회 모집중
              </span>
            </div>
            <h1 className="text-3xl font-bold">{t("tournaments.title")}</h1>
            <p className="mt-1 text-muted-foreground">
              다양한 대회에 참가하고 실력을 겨뤄보세요
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-emerald-500/25">
            <Link href="/tournaments/create">
              <Plus className="mr-2 h-4 w-4" />
              {t("tournaments.createTournament")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("common.search")}
            className="pl-10 glass border-white/10 focus:border-emerald-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-full sm:w-[180px] glass border-white/10">
            <SelectValue placeholder="종목 선택" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 종목</SelectItem>
            <SelectItem value="TABLE_TENNIS">
              <span className="flex items-center gap-2">
                🏓 {t("tournaments.sportType.TABLE_TENNIS")}
              </span>
            </SelectItem>
            <SelectItem value="TENNIS">
              <span className="flex items-center gap-2">
                🎾 {t("tournaments.sportType.TENNIS")}
              </span>
            </SelectItem>
            <SelectItem value="BADMINTON">
              <span className="flex items-center gap-2">
                🏸 {t("tournaments.sportType.BADMINTON")}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="glass border-white/10 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/10">전체</TabsTrigger>
          <TabsTrigger value="registrationOpen" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Flame className="h-4 w-4 mr-1" />
            {t("tournaments.status.registrationOpen")}
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Zap className="h-4 w-4 mr-1" />
            {t("tournaments.status.inProgress")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white/10">
            {t("tournaments.status.completed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TournamentGrid tournaments={filteredTournaments} t={t} />
        </TabsContent>

        {["registrationOpen", "inProgress", "completed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <TournamentGrid
              tournaments={filteredTournaments.filter((t) => t.status === status)}
              t={t}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TournamentGrid({
  tournaments,
  t,
}: {
  tournaments: typeof mockTournaments;
  t: ReturnType<typeof useTranslations>;
}) {
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">대회가 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          검색 조건에 맞는 대회가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} t={t} />
      ))}
    </div>
  );
}

function TournamentCard({
  tournament,
  t,
}: {
  tournament: (typeof mockTournaments)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  const sportConfig = sportTypeConfig[tournament.sport_type];
  const status = statusConfig[tournament.status];
  const fillPercentage = (tournament.current_participants / tournament.max_participants) * 100;
  const isAlmostFull = fillPercentage >= 80;

  return (
    <Link href={`/tournaments/${tournament.id}`} className="group block">
      <Card className="glass-card border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover-lift h-full">
        {/* Header with gradient */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${sportConfig.bgColor}`}>
              <span>{sportConfig.icon}</span>
              <span className={`text-xs font-medium ${sportConfig.color}`}>
                {t(`tournaments.sportType.${tournament.sport_type}`)}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`${status.bgColor} ${status.color} ${status.borderColor}`}
            >
              {tournament.status === "inProgress" && (
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
              )}
              {status.label}
            </Badge>
          </div>

          <CardTitle className="mt-3 line-clamp-2 group-hover:text-white transition-colors">
            {tournament.title}
          </CardTitle>

          <CardDescription className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {tournament.venue}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Date & Format */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <Calendar className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">대회일</p>
                <p className="font-medium">
                  {new Date(tournament.tournament_start).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">상금</p>
                <p className="font-medium text-amber-400">{tournament.prize}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">참가자</span>
              </div>
              <span className={isAlmostFull ? "text-amber-400 font-medium" : ""}>
                {tournament.current_participants} / {tournament.max_participants}명
                {isAlmostFull && " 마감임박!"}
              </span>
            </div>
            <Progress
              value={fillPercentage}
              className={`h-2 ${isAlmostFull ? "[&>div]:bg-amber-500" : ""}`}
            />
          </div>

          {/* Entry Fee & Format */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{t(`tournaments.matchFormat.${tournament.match_format}`)}</span>
            </div>
            <span className="font-medium">
              ₩{tournament.entry_fee.toLocaleString()}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full glass hover:bg-white/10 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-blue-600 group-hover:text-white transition-all"
          >
            {t("tournaments.details")}
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
