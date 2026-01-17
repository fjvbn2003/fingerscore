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
  Filter,
  Plus,
  ChevronRight,
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
  },
];

const sportTypeColors: Record<SportType, string> = {
  TABLE_TENNIS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  TENNIS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  BADMINTON: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const statusColors: Record<string, string> = {
  upcoming: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  registrationOpen: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  registrationClosed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  inProgress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
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

  const getStatusText = (status: string) => {
    return t(`tournaments.status.${status}`);
  };

  return (
    <div className="container max-w-screen-2xl py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("tournaments.title")}</h1>
          <p className="mt-1 text-muted-foreground">
            다양한 대회에 참가하고 실력을 겨뤄보세요
          </p>
        </div>
        <Button asChild>
          <Link href="/tournaments/create">
            <Plus className="mr-2 h-4 w-4" />
            {t("tournaments.createTournament")}
          </Link>
        </Button>
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

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="registrationOpen">
            {t("tournaments.status.registrationOpen")}
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            {t("tournaments.status.inProgress")}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t("tournaments.status.completed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                t={t}
                getStatusText={getStatusText}
              />
            ))}
          </div>
        </TabsContent>

        {["registrationOpen", "inProgress", "completed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments
                .filter((t) => t.status === status)
                .map((tournament) => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    t={t}
                    getStatusText={getStatusText}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TournamentCard({
  tournament,
  t,
  getStatusText,
}: {
  tournament: (typeof mockTournaments)[0];
  t: ReturnType<typeof useTranslations>;
  getStatusText: (status: string) => string;
}) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={sportTypeColors[tournament.sport_type]}>
            {t(`tournaments.sportType.${tournament.sport_type}`)}
          </Badge>
          <Badge variant="outline" className={statusColors[tournament.status]}>
            {getStatusText(tournament.status)}
          </Badge>
        </div>
        <CardTitle className="mt-2 line-clamp-2">{tournament.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {tournament.venue}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(tournament.tournament_start).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {tournament.current_participants} / {tournament.max_participants}명
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{t(`tournaments.matchFormat.${tournament.match_format}`)}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${(tournament.current_participants / tournament.max_participants) * 100}%`,
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
          asChild
        >
          <Link href={`/tournaments/${tournament.id}`}>
            {t("tournaments.details")}
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
