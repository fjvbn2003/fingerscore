"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  ArrowLeft,
  Share2,
  Bookmark,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock tournament data
const mockTournament = {
  id: "1",
  title: "2024 서울 오픈 탁구 대회",
  description: `서울에서 개최되는 오픈 탁구 대회입니다.

실력에 상관없이 누구나 참가할 수 있으며, 새로운 사람들과 함께 즐거운 경기를 즐겨보세요.

대회 규정:
- 11점 3세트 승
- 서브 2개씩 교대
- 셀프 심판제

상품:
- 1등: 상금 50만원 + 트로피
- 2등: 상금 30만원
- 3등: 상금 10만원`,
  sport_type: "TABLE_TENNIS",
  tournament_type: "SINGLE_ELIMINATION",
  match_format: "SINGLES",
  location: "서울특별시",
  venue: "올림픽공원 제1체육관",
  venue_address: "서울특별시 송파구 올림픽로 424",
  registration_start: "2024-02-01",
  registration_end: "2024-02-15",
  tournament_start: "2024-02-20",
  tournament_end: "2024-02-20",
  max_participants: 32,
  current_participants: 24,
  entry_fee: 20000,
  prize_info: "1등 50만원, 2등 30만원, 3등 10만원",
  is_published: true,
  status: "registrationOpen",
  organizer: {
    id: "org1",
    display_name: "서울탁구연맹",
    avatar_url: null,
  },
};

const mockParticipants = [
  { id: "1", display_name: "김철수", avatar_url: null, rating: 1850, seed: 1 },
  { id: "2", display_name: "이영희", avatar_url: null, rating: 1780, seed: 2 },
  { id: "3", display_name: "박민수", avatar_url: null, rating: 1720, seed: 3 },
  { id: "4", display_name: "정수진", avatar_url: null, rating: 1690, seed: 4 },
  { id: "5", display_name: "최동현", avatar_url: null, rating: 1650, seed: 5 },
  { id: "6", display_name: "강민지", avatar_url: null, rating: 1620, seed: 6 },
];

const mockMatches = [
  {
    id: "m1",
    round: 1,
    match_number: 1,
    player_a: "김철수",
    player_b: "이영희",
    score_a: 3,
    score_b: 1,
    status: "COMPLETED",
  },
  {
    id: "m2",
    round: 1,
    match_number: 2,
    player_a: "박민수",
    player_b: "정수진",
    score_a: 2,
    score_b: 3,
    status: "COMPLETED",
  },
  {
    id: "m3",
    round: 2,
    match_number: 1,
    player_a: "김철수",
    player_b: "정수진",
    score_a: null,
    score_b: null,
    status: "PENDING",
  },
];

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations();
  const tournament = mockTournament;

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/tournaments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-orange-100 text-orange-800">
              {t(`tournaments.sportType.${tournament.sport_type}`)}
            </Badge>
            <Badge variant="outline">
              {t(`tournaments.tournamentType.${tournament.tournament_type}`)}
            </Badge>
            <Badge variant="outline">
              {t(`tournaments.matchFormat.${tournament.match_format}`)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold lg:text-4xl">{tournament.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={tournament.organizer.avatar_url || ""} />
                <AvatarFallback>
                  {tournament.organizer.display_name[0]}
                </AvatarFallback>
              </Avatar>
              <span>{tournament.organizer.display_name}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button size="lg">
            {t("tournaments.register")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">대회 정보</TabsTrigger>
              <TabsTrigger value="bracket">{t("tournaments.bracket")}</TabsTrigger>
              <TabsTrigger value="participants">
                {t("tournaments.participants")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>대회 설명</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {tournament.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>장소</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tournament.venue}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tournament.venue_address}
                  </p>
                  {/* Map placeholder */}
                  <div className="mt-4 h-48 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">지도 표시 영역</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bracket" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>대진표</CardTitle>
                  <CardDescription>
                    {t(`tournaments.tournamentType.${tournament.tournament_type}`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2].map((round) => (
                      <div key={round}>
                        <h4 className="mb-3 font-semibold">
                          {t("match.round", { number: round })}
                        </h4>
                        <div className="space-y-2">
                          {mockMatches
                            .filter((m) => m.round === round)
                            .map((match) => (
                              <div
                                key={match.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                              >
                                <div className="flex flex-1 items-center gap-4">
                                  <div
                                    className={`flex-1 text-right ${
                                      match.score_a !== null &&
                                      match.score_a > (match.score_b || 0)
                                        ? "font-bold"
                                        : ""
                                    }`}
                                  >
                                    {match.player_a}
                                  </div>
                                  <div className="flex items-center gap-2 rounded bg-muted px-3 py-1 text-sm font-mono">
                                    <span
                                      className={
                                        match.score_a !== null &&
                                        match.score_a > (match.score_b || 0)
                                          ? "font-bold"
                                          : ""
                                      }
                                    >
                                      {match.score_a ?? "-"}
                                    </span>
                                    <span>:</span>
                                    <span
                                      className={
                                        match.score_b !== null &&
                                        match.score_b > (match.score_a || 0)
                                          ? "font-bold"
                                          : ""
                                      }
                                    >
                                      {match.score_b ?? "-"}
                                    </span>
                                  </div>
                                  <div
                                    className={`flex-1 ${
                                      match.score_b !== null &&
                                      match.score_b > (match.score_a || 0)
                                        ? "font-bold"
                                        : ""
                                    }`}
                                  >
                                    {match.player_b}
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="ml-4"
                                >
                                  {t(`match.status.${match.status.toLowerCase()}`)}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    참가자 ({tournament.current_participants}/
                    {tournament.max_participants})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            {participant.seed}
                          </div>
                          <Avatar>
                            <AvatarImage src={participant.avatar_url || ""} />
                            <AvatarFallback>
                              {participant.display_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {participant.display_name}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {t("rankings.rating")}: {participant.rating}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>대회 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">대회 일시</p>
                  <p className="font-medium">
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
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">접수 기간</p>
                  <p className="font-medium">
                    {new Date(tournament.registration_start).toLocaleDateString(
                      "ko-KR",
                      { month: "short", day: "numeric" }
                    )}{" "}
                    -{" "}
                    {new Date(tournament.registration_end).toLocaleDateString(
                      "ko-KR",
                      { month: "short", day: "numeric" }
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">참가 현황</p>
                  <p className="font-medium">
                    {tournament.current_participants} /{" "}
                    {tournament.max_participants}명
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">참가비</p>
                  <p className="font-medium">
                    {tournament.entry_fee.toLocaleString()}원
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">상금</p>
                  <p className="font-medium">{tournament.prize_info}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            {t("tournaments.register")}
          </Button>
        </div>
      </div>
    </div>
  );
}
