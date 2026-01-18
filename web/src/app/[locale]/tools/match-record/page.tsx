"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  Check,
  X,
  Clock,
  Trophy,
  User,
  Calendar,
  MapPin,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { FriendlyMatchStatus, SportType, VisibilityType } from "@/types/database";

// Sport scoring configurations with validation rules
const sportScoringConfig = {
  TABLE_TENNIS: {
    icon: "🏓",
    label: "탁구",
    pointsToWin: 11,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 3,
    maxSets: 5,
    validateSet: (a: number, b: number) => {
      const winner = a > b ? "a" : "b";
      const winScore = Math.max(a, b);
      const loseScore = Math.min(a, b);
      // Must be at least 11, with 2 point lead, or at deuce cap
      if (winScore < 11) return { valid: false, error: "최소 11점 이상이어야 합니다" };
      if (winScore - loseScore < 2 && winScore < 30) return { valid: false, error: "2점 이상 차이가 나야 합니다" };
      return { valid: true };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winner = setsA > setsB ? "a" : "b";
      const winSets = Math.max(setsA, setsB);
      if (winSets < 3) return { valid: false, error: "3세트 이상 이겨야 합니다" };
      if (winSets > 3 && setsA !== 0 && setsB !== 0) {
        // If 4 or 5 sets played, check total is <= 5
        if (setsA + setsB > 5) return { valid: false, error: "최대 5세트까지 가능합니다" };
      }
      return { valid: true };
    },
  },
  TENNIS: {
    icon: "🎾",
    label: "테니스",
    gamesPerSet: 6,
    minGameDiff: 2,
    tiebreakAt: 6,
    setsToWin: 2,
    maxSets: 3,
    validateSet: (a: number, b: number) => {
      const winGames = Math.max(a, b);
      const loseGames = Math.min(a, b);
      // Standard set: 6-0 to 6-4, or 7-5, or 7-6 tiebreak
      if (winGames === 6 && loseGames <= 4) return { valid: true };
      if (winGames === 7 && (loseGames === 5 || loseGames === 6)) return { valid: true };
      return { valid: false, error: "유효하지 않은 테니스 세트 점수입니다" };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winSets = Math.max(setsA, setsB);
      if (winSets < 2) return { valid: false, error: "2세트 이상 이겨야 합니다" };
      if (setsA + setsB > 3) return { valid: false, error: "최대 3세트까지 가능합니다" };
      return { valid: true };
    },
  },
  BADMINTON: {
    icon: "🏸",
    label: "배드민턴",
    pointsToWin: 21,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 2,
    maxSets: 3,
    validateSet: (a: number, b: number) => {
      const winScore = Math.max(a, b);
      const loseScore = Math.min(a, b);
      if (winScore < 21) return { valid: false, error: "최소 21점 이상이어야 합니다" };
      if (winScore - loseScore < 2 && winScore < 30) return { valid: false, error: "2점 이상 차이가 나야 합니다" };
      return { valid: true };
    },
    validateMatch: (setsA: number, setsB: number) => {
      const winSets = Math.max(setsA, setsB);
      if (winSets < 2) return { valid: false, error: "2세트 이상 이겨야 합니다" };
      if (setsA + setsB > 3) return { valid: false, error: "최대 3세트까지 가능합니다" };
      return { valid: true };
    },
  },
};

// Mock data
const mockMyMatches = [
  {
    id: "1",
    sport_type: "TABLE_TENNIS" as SportType,
    opponent: { id: "u1", name: "김철수", club: "강남 탁구클럽", rating: 1650, avatar: null },
    myScore: 3,
    opponentScore: 1,
    setScores: [{ a: 11, b: 8 }, { a: 11, b: 9 }, { a: 9, b: 11 }, { a: 11, b: 7 }],
    date: "2024-01-18",
    venue: "서초 탁구클럽",
    status: "CONFIRMED" as FriendlyMatchStatus,
    visibility: "PUBLIC" as VisibilityType,
    isWin: true,
    ratingChange: 12,
    submittedBy: "me",
  },
  {
    id: "2",
    sport_type: "TENNIS" as SportType,
    opponent: { id: "u2", name: "이영희", club: "서초 테니스장", rating: 1450, avatar: null },
    myScore: 1,
    opponentScore: 2,
    setScores: [{ a: 6, b: 4 }, { a: 4, b: 6 }, { a: 5, b: 7 }],
    date: "2024-01-17",
    venue: "서초 테니스장",
    status: "CONFIRMED" as FriendlyMatchStatus,
    visibility: "PUBLIC" as VisibilityType,
    isWin: false,
    ratingChange: -8,
    submittedBy: "opponent",
  },
  {
    id: "3",
    sport_type: "BADMINTON" as SportType,
    opponent: { id: "u3", name: "박민수", club: "송파 배드민턴센터", rating: 1520, avatar: null },
    myScore: 2,
    opponentScore: 0,
    setScores: [{ a: 21, b: 18 }, { a: 21, b: 15 }],
    date: "2024-01-16",
    venue: "송파 배드민턴센터",
    status: "PENDING_OPPONENT" as FriendlyMatchStatus,
    visibility: "CLUB_ONLY" as VisibilityType,
    isWin: true,
    ratingChange: null,
    submittedBy: "me",
  },
];

const mockPendingApprovals = [
  {
    id: "4",
    sport_type: "TABLE_TENNIS" as SportType,
    opponent: { id: "u4", name: "최지영", club: "용산 탁구동호회", rating: 1620, avatar: null },
    myScore: 1,
    opponentScore: 3,
    setScores: [{ a: 8, b: 11 }, { a: 11, b: 9 }, { a: 9, b: 11 }, { a: 7, b: 11 }],
    date: "2024-01-18",
    venue: "용산 탁구동호회",
    status: "PENDING_SUBMITTER" as FriendlyMatchStatus,
    visibility: "PUBLIC" as VisibilityType,
    submittedBy: "opponent",
  },
  {
    id: "5",
    sport_type: "BADMINTON" as SportType,
    opponent: { id: "u5", name: "정대현", club: "강남 배드민턴클럽", rating: 1480, avatar: null },
    myScore: 0,
    opponentScore: 2,
    setScores: [{ a: 18, b: 21 }, { a: 19, b: 21 }],
    date: "2024-01-17",
    venue: "강남 배드민턴클럽",
    status: "PENDING_SUBMITTER" as FriendlyMatchStatus,
    visibility: "CLUB_ONLY" as VisibilityType,
    submittedBy: "opponent",
  },
];

const mockPlayers = [
  { id: "u1", name: "김철수", club: "강남 탁구클럽", rating: 1650 },
  { id: "u2", name: "이영희", club: "송파 탁구사랑", rating: 1580 },
  { id: "u3", name: "박민수", club: "서초 탁구클럽", rating: 1520 },
  { id: "u4", name: "최지영", club: "용산 탁구동호회", rating: 1620 },
  { id: "u5", name: "정대현", club: "강남 탁구클럽", rating: 1480 },
  { id: "u6", name: "한소희", club: "마포 탁구사랑", rating: 1550 },
  { id: "u7", name: "송민호", club: "서초 탁구클럽", rating: 1490 },
];

const mockClubs = [
  { id: "c1", name: "서초 탁구클럽" },
  { id: "c2", name: "강남 탁구클럽" },
  { id: "c3", name: "송파 탁구사랑" },
  { id: "c4", name: "용산 탁구동호회" },
  { id: "c5", name: "마포 탁구사랑" },
];

const statusConfig: Record<FriendlyMatchStatus, { color: string; label: string }> = {
  PENDING_OPPONENT: { color: "border-amber-500/30 bg-amber-500/20 text-amber-400", label: "상대방 승인 대기" },
  PENDING_SUBMITTER: { color: "border-blue-500/30 bg-blue-500/20 text-blue-400", label: "내 확인 대기" },
  CONFIRMED: { color: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400", label: "확정됨" },
  REJECTED: { color: "border-red-500/30 bg-red-500/20 text-red-400", label: "거절됨" },
};

export default function MatchRecordPage() {
  const t = useTranslations("friendlyMatch");
  const tCommon = useTranslations("common");
  const tScoring = useTranslations("scoring");
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpponent, setSelectedOpponent] = useState<typeof mockPlayers[0] | null>(null);
  const [sportType, setSportType] = useState<SportType>("TABLE_TENNIS");
  const [visibility, setVisibility] = useState<VisibilityType>("PUBLIC");
  const [setScores, setSetScores] = useState<{a: number; b: number}[]>([{ a: 0, b: 0 }]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const config = sportScoringConfig[sportType];

  const filteredPlayers = mockPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.club.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate sets won
  const setsWon = useMemo(() => {
    let a = 0, b = 0;
    setScores.forEach(set => {
      if (set.a > set.b) a++;
      else if (set.b > set.a) b++;
    });
    return { a, b };
  }, [setScores]);

  // Validate current scores
  const validateScores = () => {
    setValidationError(null);

    // Check each set
    for (let i = 0; i < setScores.length; i++) {
      const set = setScores[i];
      if (set.a === 0 && set.b === 0) continue; // Skip empty sets

      const validation = config.validateSet(set.a, set.b);
      if (!validation.valid) {
        setValidationError(`${i + 1}세트: ${validation.error}`);
        return false;
      }
    }

    // Check match validity
    const matchValidation = config.validateMatch(setsWon.a, setsWon.b);
    if (!matchValidation.valid) {
      setValidationError(matchValidation.error || null);
      return false;
    }

    return true;
  };

  const addSet = () => {
    if (setScores.length < config.maxSets) {
      setSetScores([...setScores, { a: 0, b: 0 }]);
    }
  };

  const updateSetScore = (index: number, player: 'a' | 'b', value: number) => {
    const newScores = [...setScores];
    newScores[index] = { ...newScores[index], [player]: Math.max(0, value) };
    setSetScores(newScores);
    setValidationError(null);
  };

  const resetForm = () => {
    setSelectedOpponent(null);
    setSetScores([{ a: 0, b: 0 }]);
    setSearchQuery("");
    setValidationError(null);
  };

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            경기 결과를 등록하고 상대방 승인을 받아 기록을 남기세요
          </p>
        </div>
        <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              {t("register")}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("register")}</DialogTitle>
              <DialogDescription>
                경기 결과를 등록하면 상대방에게 승인 요청이 전송됩니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Sport Selection */}
              <div className="space-y-2">
                <Label>종목 선택</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(sportScoringConfig) as SportType[]).map((sport) => (
                    <Button
                      key={sport}
                      variant={sportType === sport ? "default" : "outline"}
                      onClick={() => {
                        setSportType(sport);
                        setSetScores([{ a: 0, b: 0 }]);
                        setValidationError(null);
                      }}
                      className={cn(
                        "h-auto py-2 flex flex-col gap-1",
                        sportType === sport
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                          : "border-white/10"
                      )}
                    >
                      <span className="text-xl">{sportScoringConfig[sport].icon}</span>
                      <span className="text-xs">{sportScoringConfig[sport].label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Opponent Selection */}
              <div className="space-y-2">
                <Label>{t("selectOpponent")}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPlayer")}
                    className="pl-10 glass border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery && (
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-background/95">
                    {filteredPlayers.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => {
                          setSelectedOpponent(player);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {player.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-sm">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.club} · {player.rating}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedOpponent && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {selectedOpponent.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{selectedOpponent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOpponent.club} · {selectedOpponent.rating}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOpponent(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Set-by-Set Score Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>세트별 점수</Label>
                  <Badge variant="outline" className="border-white/10">
                    세트: {setsWon.a} - {setsWon.b}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {setScores.map((set, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                      <span className="text-sm text-muted-foreground w-12">{index + 1}세트</span>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={set.a || ""}
                          onChange={(e) => updateSetScore(index, 'a', parseInt(e.target.value) || 0)}
                          className="text-center glass border-white/10 w-16"
                          placeholder="0"
                        />
                        <span className="text-muted-foreground">:</span>
                        <Input
                          type="number"
                          min={0}
                          value={set.b || ""}
                          onChange={(e) => updateSetScore(index, 'b', parseInt(e.target.value) || 0)}
                          className="text-center glass border-white/10 w-16"
                          placeholder="0"
                        />
                      </div>
                      {set.a !== set.b && (set.a > 0 || set.b > 0) && (
                        <Badge
                          className={cn(
                            "text-xs",
                            set.a > set.b
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          )}
                        >
                          {set.a > set.b ? "W" : "L"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                {setScores.length < config.maxSets && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSet}
                    className="w-full border-dashed border-white/10"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    세트 추가 (최대 {config.maxSets}세트)
                  </Button>
                )}

                {/* Validation Error */}
                {validationError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    {validationError}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>공개 설정</Label>
                <Select value={visibility} onValueChange={(v) => setVisibility(v as VisibilityType)}>
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="PUBLIC">
                      <span className="flex items-center gap-2">
                        <Eye className="h-4 w-4" /> 전체 공개
                      </span>
                    </SelectItem>
                    <SelectItem value="CLUB_ONLY">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> 구장 내 공개
                      </span>
                    </SelectItem>
                    <SelectItem value="PRIVATE">
                      <span className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" /> 비공개
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {/* Score/Record visibility note */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    점수(몇 대 몇)와 최근 전적은 공개 설정과 관계없이 항상 표시됩니다.
                    비공개 시 상대방 이름과 상세 정보만 숨겨집니다.
                  </span>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("date")}</Label>
                  <Input type="date" className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("venue")}</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="장소 선택" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {mockClubs.map((club) => (
                        <SelectItem key={club.id} value={club.id}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  placeholder="경기에 대한 메모 (선택)"
                  className="glass border-white/10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRegisterDialogOpen(false);
                  resetForm();
                }}
                className="border-white/10"
              >
                취소
              </Button>
              <Button
                disabled={!selectedOpponent || setsWon.a === setsWon.b}
                onClick={() => {
                  if (validateScores()) {
                    // Submit match
                    console.log("Submitting match:", { sportType, setScores, visibility });
                    setRegisterDialogOpen(false);
                    resetForm();
                  }
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                경기 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Approvals Alert */}
      {mockPendingApprovals.length > 0 && (
        <Card className="glass-card border-amber-500/30 bg-amber-500/5 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="h-5 w-5" />
              {t("awaitingYourApproval")} ({mockPendingApprovals.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPendingApprovals.map((match) => (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {match.opponent.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{match.opponent.name}</span>
                        <span className="text-muted-foreground">vs 나</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {match.opponentScore} : {match.myScore}
                        </span>
                        <span>·</span>
                        <span>{match.date}</span>
                        <span>·</span>
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t("approve")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t("reject")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match History */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:text-amber-400">
            <Clock className="h-4 w-4 mr-1" />
            대기 중
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="data-[state=active]:text-emerald-400">
            <Check className="h-4 w-4 mr-1" />
            확정됨
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <MatchList matches={mockMyMatches} t={t} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          <MatchList
            matches={mockMyMatches.filter(
              (m) => m.status === "PENDING_OPPONENT" || m.status === "PENDING_SUBMITTER"
            )}
            t={t}
          />
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-3">
          <MatchList matches={mockMyMatches.filter((m) => m.status === "CONFIRMED")} t={t} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MatchList({
  matches,
  t,
}: {
  matches: typeof mockMyMatches;
  t: ReturnType<typeof useTranslations>;
}) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">경기 기록이 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          새 경기 결과를 등록해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <Card key={match.id} className="glass-card border-white/5 hover:border-white/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl text-2xl",
                    match.status === "CONFIRMED"
                      ? match.isWin
                        ? "bg-emerald-500/20"
                        : "bg-red-500/20"
                      : "bg-white/5"
                  )}
                >
                  {sportScoringConfig[match.sport_type].icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold">
                      {match.myScore} : {match.opponentScore}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="font-medium">{match.opponent.name}</span>
                    <Badge variant="outline" className={statusConfig[match.status].color}>
                      {statusConfig[match.status].label}
                    </Badge>
                    {match.visibility !== "PUBLIC" && (
                      <Badge variant="outline" className="border-purple-500/30 bg-purple-500/20 text-purple-400">
                        {match.visibility === "CLUB_ONLY" ? <MapPin className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {match.visibility === "CLUB_ONLY" ? "구장" : "비공개"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {match.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {match.opponent.club}
                    </span>
                  </div>
                  {match.setScores && (
                    <div className="flex items-center gap-1 mt-2">
                      {match.setScores.map((set, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={cn(
                            "text-xs",
                            set.a > set.b
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/30 bg-red-500/10 text-red-400"
                          )}
                        >
                          {set.a}-{set.b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {match.status === "CONFIRMED" && match.ratingChange !== null && (
                  <div
                    className={cn(
                      "flex items-center gap-1 font-semibold",
                      match.ratingChange > 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {match.ratingChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {match.ratingChange > 0 ? "+" : ""}
                    {match.ratingChange}
                  </div>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
