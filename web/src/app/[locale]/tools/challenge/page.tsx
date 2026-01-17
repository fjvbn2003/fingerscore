"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Zap,
  Search,
  Send,
  Check,
  X,
  Clock,
  MapPin,
  Calendar,
  MessageCircle,
  Trophy,
  TrendingUp,
  User,
  ChevronRight,
  Swords,
  Bell,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChallengeStatus } from "@/types/database";

// Mock data for challenges
const mockReceivedChallenges = [
  {
    id: "1",
    challenger: {
      id: "u1",
      name: "김철수",
      avatar: null,
      rating: 1850,
      club: "강남탁구클럽",
      winRate: 68,
    },
    message: "한 판 붙어보시죠! 실력이 비슷해 보여서 재밌을 것 같습니다.",
    proposedDate: "2026-01-20",
    proposedTime: "19:00",
    proposedVenue: "강남탁구클럽",
    status: "PENDING" as ChallengeStatus,
    createdAt: "2026-01-18T10:30:00",
    expiresAt: "2026-01-19T10:30:00",
  },
  {
    id: "2",
    challenger: {
      id: "u2",
      name: "박영희",
      avatar: null,
      rating: 1720,
      club: "서초탁구장",
      winRate: 55,
    },
    message: "지난번에 아쉽게 졌는데 리벤지 매치 하고 싶습니다!",
    proposedDate: "2026-01-22",
    proposedTime: "20:00",
    proposedVenue: "서초탁구장",
    status: "PENDING" as ChallengeStatus,
    createdAt: "2026-01-17T15:20:00",
    expiresAt: "2026-01-18T15:20:00",
  },
];

const mockSentChallenges = [
  {
    id: "3",
    opponent: {
      id: "u3",
      name: "이민호",
      avatar: null,
      rating: 1920,
      club: "송파탁구클럽",
      winRate: 72,
    },
    message: "고수님께 한 수 배우고 싶습니다!",
    proposedDate: "2026-01-21",
    proposedTime: "18:30",
    proposedVenue: "송파탁구클럽",
    status: "PENDING" as ChallengeStatus,
    createdAt: "2026-01-16T09:00:00",
    expiresAt: "2026-01-17T09:00:00",
  },
  {
    id: "4",
    opponent: {
      id: "u4",
      name: "정수진",
      avatar: null,
      rating: 1780,
      club: "강남탁구클럽",
      winRate: 61,
    },
    message: "같은 클럽 멤버인데 아직 대결해본 적이 없네요. 한 판 하시죠!",
    proposedDate: "2026-01-19",
    proposedTime: "17:00",
    proposedVenue: "강남탁구클럽",
    status: "ACCEPTED" as ChallengeStatus,
    createdAt: "2026-01-15T14:30:00",
    expiresAt: "2026-01-16T14:30:00",
  },
  {
    id: "5",
    opponent: {
      id: "u5",
      name: "최영수",
      avatar: null,
      rating: 1650,
      club: "역삼탁구장",
      winRate: 48,
    },
    message: "연습 게임 한 판 하실래요?",
    proposedDate: "2026-01-14",
    proposedTime: "19:30",
    proposedVenue: "역삼탁구장",
    status: "REJECTED" as ChallengeStatus,
    createdAt: "2026-01-13T11:00:00",
    expiresAt: "2026-01-14T11:00:00",
  },
];

// Mock data for player search
const mockPlayers = [
  {
    id: "u6",
    name: "홍길동",
    avatar: null,
    rating: 1800,
    club: "강남탁구클럽",
    winRate: 62,
    recentForm: ["W", "W", "L", "W", "W"],
  },
  {
    id: "u7",
    name: "김영진",
    avatar: null,
    rating: 1750,
    club: "서초탁구장",
    winRate: 58,
    recentForm: ["L", "W", "W", "W", "L"],
  },
  {
    id: "u8",
    name: "박지훈",
    avatar: null,
    rating: 1900,
    club: "송파탁구클럽",
    winRate: 70,
    recentForm: ["W", "W", "W", "L", "W"],
  },
  {
    id: "u9",
    name: "이서연",
    avatar: null,
    rating: 1680,
    club: "강남탁구클럽",
    winRate: 52,
    recentForm: ["L", "L", "W", "W", "L"],
  },
  {
    id: "u10",
    name: "정민수",
    avatar: null,
    rating: 1820,
    club: "역삼탁구장",
    winRate: 65,
    recentForm: ["W", "L", "W", "W", "W"],
  },
];

const statusConfig: Record<ChallengeStatus, { color: string; label: string; icon: typeof Clock }> = {
  PENDING: { color: "border-amber-500/30 bg-amber-500/20 text-amber-400", label: "대기중", icon: Clock },
  ACCEPTED: { color: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400", label: "수락됨", icon: Check },
  REJECTED: { color: "border-red-500/30 bg-red-500/20 text-red-400", label: "거절됨", icon: X },
  EXPIRED: { color: "border-slate-500/30 bg-slate-500/20 text-slate-400", label: "만료됨", icon: Clock },
};

export default function ChallengePage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<typeof mockPlayers[0] | null>(null);
  const [challengeMessage, setChallengeMessage] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [proposedVenue, setProposedVenue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredPlayers = mockPlayers.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.club.toLowerCase().includes(searchQuery.toLowerCase());

    if (ratingFilter === "all") return matchesSearch;
    if (ratingFilter === "similar") {
      const myRating = 1800; // Mock current user rating
      return matchesSearch && Math.abs(player.rating - myRating) <= 100;
    }
    if (ratingFilter === "higher") {
      const myRating = 1800;
      return matchesSearch && player.rating > myRating;
    }
    if (ratingFilter === "lower") {
      const myRating = 1800;
      return matchesSearch && player.rating < myRating;
    }
    return matchesSearch;
  });

  const handleSendChallenge = () => {
    if (!selectedPlayer || !proposedDate || !proposedTime) return;
    // In real app, would send to API
    console.log("Sending challenge:", {
      to: selectedPlayer.id,
      message: challengeMessage,
      date: proposedDate,
      time: proposedTime,
      venue: proposedVenue,
    });
    setIsDialogOpen(false);
    setSelectedPlayer(null);
    setChallengeMessage("");
    setProposedDate("");
    setProposedTime("");
    setProposedVenue("");
  };

  const handleAcceptChallenge = (challengeId: string) => {
    console.log("Accepting challenge:", challengeId);
  };

  const handleRejectChallenge = (challengeId: string) => {
    console.log("Rejecting challenge:", challengeId);
  };

  const pendingCount = mockReceivedChallenges.filter((c) => c.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-400" />
            {t("challenge.title")}
          </h1>
          <p className="text-slate-400 mt-1">{t("challenge.description")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <Swords className="h-4 w-4 mr-2" />
              {t("challenge.sendChallenge")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-slate-100">{t("challenge.sendChallenge")}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {t("challenge.sendChallengeDesc")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Player Search */}
              {!selectedPlayer ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder={t("challenge.searchPlayer")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-slate-100">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">{t("challenge.filterAll")}</SelectItem>
                        <SelectItem value="similar">{t("challenge.filterSimilar")}</SelectItem>
                        <SelectItem value="higher">{t("challenge.filterHigher")}</SelectItem>
                        <SelectItem value="lower">{t("challenge.filterLower")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-100">{player.name}</p>
                            <p className="text-xs text-slate-400">{player.club}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-400">
                              <Trophy className="h-3 w-3" />
                              <span className="font-mono font-bold">{player.rating}</span>
                            </div>
                            <p className="text-xs text-slate-400">{t("challenge.winRate")}: {player.winRate}%</p>
                          </div>
                          <div className="flex gap-0.5">
                            {player.recentForm.map((result, i) => (
                              <div
                                key={i}
                                className={`w-2 h-4 rounded-sm ${
                                  result === "W" ? "bg-emerald-500" : "bg-red-500"
                                }`}
                              />
                            ))}
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Player */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {selectedPlayer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{selectedPlayer.name}</p>
                        <p className="text-sm text-slate-400">{selectedPlayer.club}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Trophy className="h-4 w-4" />
                        <span className="font-mono font-bold text-lg">{selectedPlayer.rating}</span>
                      </div>
                      <p className="text-sm text-slate-400">{t("challenge.winRate")}: {selectedPlayer.winRate}%</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPlayer(null)}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Challenge Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">{t("challenge.date")}</label>
                      <Input
                        type="date"
                        value={proposedDate}
                        onChange={(e) => setProposedDate(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">{t("challenge.time")}</label>
                      <Input
                        type="time"
                        value={proposedTime}
                        onChange={(e) => setProposedTime(e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t("challenge.venue")}</label>
                    <Input
                      placeholder={t("challenge.venuePlaceholder")}
                      value={proposedVenue}
                      onChange={(e) => setProposedVenue(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t("challenge.message")}</label>
                    <Textarea
                      placeholder={t("challenge.messagePlaceholder")}
                      value={challengeMessage}
                      onChange={(e) => setChallengeMessage(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            {selectedPlayer && (
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400">
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleSendChallenge}
                  disabled={!proposedDate || !proposedTime}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t("challenge.send")}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Challenges Alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="p-2 rounded-full bg-amber-500/20">
            <Bell className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-100">
              {t("challenge.pendingCount", { count: pendingCount })}
            </p>
            <p className="text-sm text-slate-400">{t("challenge.pendingDesc")}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger
            value="received"
            className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
          >
            {t("challenge.received")}
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            {t("challenge.sent")}
          </TabsTrigger>
        </TabsList>

        {/* Received Challenges */}
        <TabsContent value="received" className="mt-4 space-y-4">
          {mockReceivedChallenges.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Zap className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("challenge.noReceived")}</p>
            </div>
          ) : (
            mockReceivedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {challenge.challenger.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-100">{challenge.challenger.name}</span>
                      <Badge className={statusConfig[challenge.status].color}>
                        {statusConfig[challenge.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {challenge.challenger.club}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Trophy className="h-3 w-3" />
                        {challenge.challenger.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {t("challenge.winRate")}: {challenge.challenger.winRate}%
                      </span>
                    </div>
                    {challenge.message && (
                      <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-slate-700/30">
                        <MessageCircle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{challenge.message}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.proposedDate} {challenge.proposedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {challenge.proposedVenue}
                      </span>
                    </div>
                  </div>
                  {challenge.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptChallenge(challenge.id)}
                        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t("challenge.accept")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRejectChallenge(challenge.id)}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t("challenge.reject")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Sent Challenges */}
        <TabsContent value="sent" className="mt-4 space-y-4">
          {mockSentChallenges.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Send className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("challenge.noSent")}</p>
            </div>
          ) : (
            mockSentChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {challenge.opponent.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-100">{challenge.opponent.name}</span>
                      <Badge className={statusConfig[challenge.status].color}>
                        {statusConfig[challenge.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {challenge.opponent.club}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Trophy className="h-3 w-3" />
                        {challenge.opponent.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {t("challenge.winRate")}: {challenge.opponent.winRate}%
                      </span>
                    </div>
                    {challenge.message && (
                      <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-slate-700/30">
                        <MessageCircle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{challenge.message}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.proposedDate} {challenge.proposedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {challenge.proposedVenue}
                      </span>
                    </div>
                  </div>
                  {challenge.status === "ACCEPTED" && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      {t("challenge.matchConfirmed")}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-amber-400">12</div>
          <div className="text-sm text-slate-400">{t("challenge.totalSent")}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-emerald-400">8</div>
          <div className="text-sm text-slate-400">{t("challenge.accepted")}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-blue-400">5</div>
          <div className="text-sm text-slate-400">{t("challenge.totalReceived")}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
          <div className="text-2xl font-bold text-slate-400">67%</div>
          <div className="text-sm text-slate-400">{t("challenge.acceptRate")}</div>
        </div>
      </div>
    </div>
  );
}
