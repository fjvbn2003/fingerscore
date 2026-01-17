"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Swords,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  Check,
  X,
  MessageSquare,
  Building2,
  Trophy,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ExchangeMatchStatus } from "@/types/database";

// Mock data
const mockExchangeMatches = [
  {
    id: "1",
    title: "1월 친선 교류전",
    hostClub: { id: "my-club", name: "서초 탁구클럽" },
    guestClub: { id: "club-1", name: "강남 탁구클럽" },
    matchDate: "2024-01-28",
    venue: "서초 탁구클럽",
    maxParticipants: 10,
    hostParticipants: ["김철수", "이영희", "박민수", "최지영"],
    guestParticipants: ["정대현", "한소희", "송민호"],
    status: "ACCEPTED" as ExchangeMatchStatus,
    description: "새해 첫 교류전입니다. 많은 참여 부탁드립니다!",
    proposedBy: "my-club",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "설날 기념 교류전",
    hostClub: { id: "club-2", name: "송파 탁구사랑" },
    guestClub: { id: "my-club", name: "서초 탁구클럽" },
    matchDate: "2024-02-10",
    venue: "송파 탁구사랑",
    maxParticipants: 12,
    hostParticipants: ["윤서연", "강민혁"],
    guestParticipants: [],
    status: "PROPOSED" as ExchangeMatchStatus,
    description: "설날 연휴 교류전에 초대합니다.",
    proposedBy: "club-2",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    title: "12월 송년 교류전",
    hostClub: { id: "my-club", name: "서초 탁구클럽" },
    guestClub: { id: "club-3", name: "용산 탁구동호회" },
    matchDate: "2023-12-23",
    venue: "서초 탁구클럽",
    maxParticipants: 8,
    hostParticipants: ["김철수", "이영희", "박민수", "최지영"],
    guestParticipants: ["정대현", "한소희", "송민호", "윤서연"],
    status: "COMPLETED" as ExchangeMatchStatus,
    description: "송년 교류전",
    proposedBy: "my-club",
    createdAt: "2023-12-01",
  },
  {
    id: "4",
    title: "신규 클럽 교류전 제안",
    hostClub: { id: "my-club", name: "서초 탁구클럽" },
    guestClub: { id: "club-4", name: "광진 탁구클럽" },
    matchDate: "2024-02-20",
    venue: "서초 탁구클럽",
    maxParticipants: 8,
    hostParticipants: [],
    guestParticipants: [],
    status: "PROPOSED" as ExchangeMatchStatus,
    description: "처음 교류하게 되어 기쁩니다. 잘 부탁드립니다.",
    proposedBy: "my-club",
    createdAt: "2024-01-17",
  },
];

const mockClubs = [
  { id: "club-1", name: "강남 탁구클럽", location: "서울 강남구" },
  { id: "club-2", name: "송파 탁구사랑", location: "서울 송파구" },
  { id: "club-3", name: "용산 탁구동호회", location: "서울 용산구" },
  { id: "club-4", name: "광진 탁구클럽", location: "서울 광진구" },
  { id: "club-5", name: "마포 탁구사랑", location: "서울 마포구" },
];

const statusColors: Record<ExchangeMatchStatus, string> = {
  PROPOSED: "border-amber-500/30 bg-amber-500/20 text-amber-400",
  ACCEPTED: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
  REJECTED: "border-red-500/30 bg-red-500/20 text-red-400",
  COMPLETED: "border-blue-500/30 bg-blue-500/20 text-blue-400",
  CANCELLED: "border-gray-500/30 bg-gray-500/20 text-gray-400",
};

export default function ExchangeMatchesPage() {
  const t = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredMatches = mockExchangeMatches.filter((match) => {
    const matchesSearch =
      match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.hostClub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.guestClub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || match.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const incomingProposals = mockExchangeMatches.filter(
    (m) => m.status === "PROPOSED" && m.proposedBy !== "my-club"
  );
  const outgoingProposals = mockExchangeMatches.filter(
    (m) => m.status === "PROPOSED" && m.proposedBy === "my-club"
  );
  const upcomingMatches = mockExchangeMatches.filter(
    (m) => m.status === "ACCEPTED"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("exchangeMatch.title")}</h1>
          <p className="text-muted-foreground">다른 탁구장과 교류전을 주최하고 관리하세요</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              {t("exchangeMatch.create")}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("exchangeMatch.create")}</DialogTitle>
              <DialogDescription>다른 탁구장에 교류전을 제안하세요</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{t("exchangeMatch.guestClub")}</Label>
                <Select>
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue placeholder="탁구장 선택" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {mockClubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{club.name}</span>
                          <span className="text-xs text-muted-foreground">({club.location})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("exchangeMatch.matchTitle")}</Label>
                <Input placeholder="교류전 이름" className="glass border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("exchangeMatch.matchDate")}</Label>
                  <Input type="date" className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("exchangeMatch.maxParticipants")}</Label>
                  <Input type="number" placeholder="10" className="glass border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("exchangeMatch.venue")}</Label>
                <Input placeholder="경기 장소" className="glass border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>{t("exchangeMatch.description")}</Label>
                <Textarea placeholder="교류전 설명을 입력하세요" className="glass border-white/10" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-white/10">
                취소
              </Button>
              <Button className="bg-gradient-to-r from-red-500 to-orange-600">
                제안 보내기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">받은 제안</p>
              <p className="text-2xl font-bold">{incomingProposals.length}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Swords className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">보낸 제안</p>
              <p className="text-2xl font-bold">{outgoingProposals.length}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">예정된 교류전</p>
              <p className="text-2xl font-bold">{upcomingMatches.length}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Trophy className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">완료된 교류전</p>
              <p className="text-2xl font-bold">
                {mockExchangeMatches.filter((m) => m.status === "COMPLETED").length}건
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incoming Proposals Alert */}
      {incomingProposals.length > 0 && (
        <Card className="glass-card border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Clock className="h-5 w-5" />
              대기 중인 교류전 제안
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomingProposals.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div>
                    <h3 className="font-semibold">{match.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{match.hostClub.name}</span>
                      <span>·</span>
                      <Calendar className="h-4 w-4" />
                      <span>{match.matchDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      수락
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-1" />
                      거절
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      채팅
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="교류전 또는 탁구장 이름으로 검색..."
            className="pl-10 glass border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] glass border-white/10">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="PROPOSED">{t("exchangeMatch.status.PROPOSED")}</SelectItem>
            <SelectItem value="ACCEPTED">{t("exchangeMatch.status.ACCEPTED")}</SelectItem>
            <SelectItem value="COMPLETED">{t("exchangeMatch.status.COMPLETED")}</SelectItem>
            <SelectItem value="REJECTED">{t("exchangeMatch.status.REJECTED")}</SelectItem>
            <SelectItem value="CANCELLED">{t("exchangeMatch.status.CANCELLED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exchange Matches List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="upcoming">예정됨</TabsTrigger>
          <TabsTrigger value="completed">완료됨</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredMatches.map((match) => (
            <ExchangeMatchCard key={match.id} match={match} t={t} />
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {filteredMatches
            .filter((m) => m.status === "ACCEPTED" || m.status === "PROPOSED")
            .map((match) => (
              <ExchangeMatchCard key={match.id} match={match} t={t} />
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredMatches
            .filter((m) => m.status === "COMPLETED")
            .map((match) => (
              <ExchangeMatchCard key={match.id} match={match} t={t} />
            ))}
        </TabsContent>
      </Tabs>

      {filteredMatches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <Swords className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">교류전이 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            다른 탁구장에 교류전을 제안해보세요
          </p>
        </div>
      )}
    </div>
  );
}

function ExchangeMatchCard({
  match,
  t,
}: {
  match: (typeof mockExchangeMatches)[0];
  t: ReturnType<typeof useTranslations>;
}) {
  const isHost = match.hostClub.id === "my-club";
  const opponent = isHost ? match.guestClub : match.hostClub;

  return (
    <Card className="glass-card border-white/5 hover:border-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{match.title}</h3>
                  <Badge variant="outline" className={statusColors[match.status]}>
                    {t(`exchangeMatch.status.${match.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{match.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20">
                  <Swords className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">상대 탁구장</p>
                  <p className="font-medium">{opponent.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">경기 일정</p>
                  <p className="font-medium">{match.matchDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">장소</p>
                  <p className="font-medium">{match.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">참가자</p>
                  <p className="font-medium">
                    {match.hostParticipants.length + match.guestParticipants.length}/{match.maxParticipants}명
                  </p>
                </div>
              </div>
            </div>

            {/* Participants Preview */}
            {(match.status === "ACCEPTED" || match.status === "COMPLETED") && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    {match.hostClub.name} ({match.hostParticipants.length}명)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.hostParticipants.map((name, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 text-xs">
                        {name}
                      </Badge>
                    ))}
                    {match.hostParticipants.length === 0 && (
                      <span className="text-xs text-muted-foreground">참가자 없음</span>
                    )}
                  </div>
                </div>
                <div className="text-2xl text-muted-foreground">vs</div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    {match.guestClub.name} ({match.guestParticipants.length}명)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.guestParticipants.map((name, i) => (
                      <Badge key={i} variant="secondary" className="bg-white/5 text-xs">
                        {name}
                      </Badge>
                    ))}
                    {match.guestParticipants.length === 0 && (
                      <span className="text-xs text-muted-foreground">참가자 없음</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {match.status === "ACCEPTED" && (
              <Button variant="outline" size="sm" className="border-white/10">
                <Users className="h-4 w-4 mr-1" />
                참가자 관리
              </Button>
            )}
            <Button variant="outline" size="sm" className="border-white/10">
              <MessageSquare className="h-4 w-4 mr-1" />
              채팅
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/5">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-white/10">
                <DropdownMenuItem className="cursor-pointer">
                  상세 보기
                </DropdownMenuItem>
                {match.status === "ACCEPTED" && (
                  <DropdownMenuItem className="cursor-pointer text-emerald-400">
                    완료 처리
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                {match.status === "PROPOSED" && match.proposedBy === "my-club" && (
                  <DropdownMenuItem className="cursor-pointer text-red-400">
                    제안 취소
                  </DropdownMenuItem>
                )}
                {match.status === "ACCEPTED" && (
                  <DropdownMenuItem className="cursor-pointer text-red-400">
                    교류전 취소
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
