"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Plus,
  Minus,
  Users,
  Share2,
  Copy,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Volume2,
  VolumeX,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { SportType } from "@/types/database";

// Sport scoring configurations
const sportScoringConfig = {
  TABLE_TENNIS: {
    pointsToWin: 11,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 3,
    maxSets: 5,
  },
  TENNIS: {
    gamesPerSet: 6,
    minGameDiff: 2,
    tiebreakAt: 6,
    setsToWin: 2,
    maxSets: 3,
  },
  BADMINTON: {
    pointsToWin: 21,
    minPointDiff: 2,
    maxPoints: 30,
    setsToWin: 2,
    maxSets: 3,
  },
};

const sportConfig: Record<SportType, { icon: string; label: string; bgColor: string }> = {
  TABLE_TENNIS: { icon: "🏓", label: "탁구", bgColor: "from-orange-600 to-orange-800" },
  TENNIS: { icon: "🎾", label: "테니스", bgColor: "from-green-600 to-green-800" },
  BADMINTON: { icon: "🏸", label: "배드민턴", bgColor: "from-blue-600 to-blue-800" },
};

interface SetScore {
  playerA: number;
  playerB: number;
}

export default function LiveScorePage() {
  const t = useTranslations();

  // Match setup state
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [sportType, setSportType] = useState<SportType>("TABLE_TENNIS");
  const [playerAName, setPlayerAName] = useState("");
  const [playerBName, setPlayerBName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Score state
  const [currentSet, setCurrentSet] = useState(1);
  const [setScores, setSetScores] = useState<SetScore[]>([{ playerA: 0, playerB: 0 }]);
  const [setsWonA, setSetsWonA] = useState(0);
  const [setsWonB, setSetsWonB] = useState(0);
  const [isMatchComplete, setIsMatchComplete] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);

  // Sharing state
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewers, setViewers] = useState(0);

  // Current set score
  const currentSetScore = setScores[currentSet - 1] || { playerA: 0, playerB: 0 };

  // Generate share code when match starts
  useEffect(() => {
    if (isMatchStarted && !shareCode) {
      setShareCode(Math.random().toString(36).substring(2, 8).toUpperCase());
      // Simulate viewers
      const interval = setInterval(() => {
        setViewers((v) => Math.max(0, v + Math.floor(Math.random() * 3) - 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMatchStarted]);

  const handleStartMatch = () => {
    if (playerAName && playerBName) {
      setIsMatchStarted(true);
      setSetScores([{ playerA: 0, playerB: 0 }]);
      setSetsWonA(0);
      setSetsWonB(0);
      setCurrentSet(1);
      setIsMatchComplete(false);
      setWinner(null);
      setViewers(Math.floor(Math.random() * 5));
    }
  };

  const checkSetWin = (scoreA: number, scoreB: number): "A" | "B" | null => {
    const config = sportScoringConfig[sportType];
    if (sportType === "TENNIS") {
      // Tennis scoring is complex, simplified here
      const minGames = config.gamesPerSet;
      if (scoreA >= minGames && scoreA - scoreB >= 2) return "A";
      if (scoreB >= minGames && scoreB - scoreA >= 2) return "B";
      // Tiebreak at 7-6
      if (scoreA === 7 && scoreB === 6) return "A";
      if (scoreB === 7 && scoreA === 6) return "B";
      return null;
    } else {
      // Table tennis & Badminton
      const pointsToWin = config.pointsToWin;
      const maxPoints = config.maxPoints;
      const diff = Math.abs(scoreA - scoreB);

      if (scoreA >= pointsToWin && diff >= 2) return "A";
      if (scoreB >= pointsToWin && diff >= 2) return "B";
      // Deuce cap at maxPoints
      if (scoreA === maxPoints && scoreA > scoreB) return "A";
      if (scoreB === maxPoints && scoreB > scoreA) return "B";
      return null;
    }
  };

  const checkMatchWin = (newSetsA: number, newSetsB: number): "A" | "B" | null => {
    const config = sportScoringConfig[sportType];
    if (newSetsA >= config.setsToWin) return "A";
    if (newSetsB >= config.setsToWin) return "B";
    return null;
  };

  const handleScore = (player: "A" | "B") => {
    if (isMatchComplete) return;

    const newSetScores = [...setScores];
    const currentScore = { ...newSetScores[currentSet - 1] };

    if (player === "A") {
      currentScore.playerA++;
    } else {
      currentScore.playerB++;
    }
    newSetScores[currentSet - 1] = currentScore;
    setSetScores(newSetScores);

    // Check for set win
    const setWinner = checkSetWin(currentScore.playerA, currentScore.playerB);
    if (setWinner) {
      let newSetsA = setsWonA;
      let newSetsB = setsWonB;

      if (setWinner === "A") {
        newSetsA++;
        setSetsWonA(newSetsA);
      } else {
        newSetsB++;
        setSetsWonB(newSetsB);
      }

      // Check for match win
      const matchWinner = checkMatchWin(newSetsA, newSetsB);
      if (matchWinner) {
        setIsMatchComplete(true);
        setWinner(matchWinner);
        if (soundEnabled) {
          // Play victory sound
        }
      } else {
        // Start new set
        setCurrentSet(currentSet + 1);
        setSetScores([...newSetScores, { playerA: 0, playerB: 0 }]);
      }
    }

    // Play point sound
    if (soundEnabled) {
      // Play sound
    }
  };

  const handleUndo = () => {
    if (currentSetScore.playerA === 0 && currentSetScore.playerB === 0) {
      if (currentSet > 1) {
        // Go back to previous set
        const newSetScores = setScores.slice(0, -1);
        setSetScores(newSetScores);
        setCurrentSet(currentSet - 1);
        // Recalculate sets won
        // This is simplified - in real app would track history properly
      }
      return;
    }

    // Undo last point - simplified, would need proper history in real app
  };

  const handleReset = () => {
    setSetScores([{ playerA: 0, playerB: 0 }]);
    setSetsWonA(0);
    setSetsWonB(0);
    setCurrentSet(1);
    setIsMatchComplete(false);
    setWinner(null);
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/live-score/watch/${shareCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scorekeeper view (not match started)
  if (!isMatchStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-4">
              <Radio className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">실시간 점수판</h1>
            <p className="text-slate-400 mt-2">경기를 중계하고 실시간으로 공유하세요</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-6">
            {/* Sport Selection */}
            <div>
              <label className="text-sm text-slate-400 mb-2 block">종목 선택</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(sportConfig) as SportType[]).map((sport) => (
                  <Button
                    key={sport}
                    variant={sportType === sport ? "default" : "outline"}
                    onClick={() => setSportType(sport)}
                    className={`h-auto py-3 flex flex-col gap-1 ${
                      sportType === sport
                        ? `bg-gradient-to-br ${sportConfig[sport].bgColor}`
                        : "border-slate-700 text-slate-300"
                    }`}
                  >
                    <span className="text-2xl">{sportConfig[sport].icon}</span>
                    <span className="text-xs">{sportConfig[sport].label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Player Names */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">선수 A</label>
                <Input
                  value={playerAName}
                  onChange={(e) => setPlayerAName(e.target.value)}
                  placeholder="이름 입력"
                  className="bg-slate-800/50 border-slate-700 text-slate-100 text-lg"
                />
              </div>
              <div className="flex justify-center">
                <Badge className="bg-slate-700/50 text-slate-400">VS</Badge>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">선수 B</label>
                <Input
                  value={playerBName}
                  onChange={(e) => setPlayerBName(e.target.value)}
                  placeholder="이름 입력"
                  className="bg-slate-800/50 border-slate-700 text-slate-100 text-lg"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300">공개 중계</span>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-slate-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-slate-300">효과음</span>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartMatch}
              disabled={!playerAName || !playerBName}
              className="w-full h-14 text-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              <Play className="h-5 w-5 mr-2" />
              경기 시작
            </Button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-4">
            <Smartphone className="h-4 w-4 inline mr-1" />
            모바일에서도 최적화된 화면으로 이용 가능합니다
          </p>
        </div>
      </div>
    );
  }

  // Live scoring view
  return (
    <div className={`min-h-screen bg-gradient-to-br ${sportConfig[sportType].bgColor} p-4`}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMatchStarted(false)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            {isPublic && (
              <Badge className="bg-red-500/30 text-red-200 border-red-400/30 animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                ON AIR
              </Badge>
            )}
            {isPublic && viewers > 0 && (
              <Badge className="bg-white/10 text-white/80">
                <Eye className="h-3 w-3 mr-1" />
                {viewers}
              </Badge>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-100">경기 공유</DialogTitle>
                <DialogDescription className="text-slate-400">
                  아래 링크를 공유하면 다른 사람들이 실시간으로 경기를 볼 수 있습니다
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/live-score/watch/${shareCode}`}
                  className="bg-slate-800/50 border-slate-700 text-slate-300"
                />
                <Button onClick={copyShareLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-center text-slate-400 text-sm">
                접속 코드: <span className="font-mono font-bold text-slate-200">{shareCode}</span>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sport Icon */}
        <div className="text-center mb-4">
          <span className="text-4xl">{sportConfig[sportType].icon}</span>
        </div>

        {/* Sets Score */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-white/60 text-sm">세트</p>
            <p className="text-4xl font-bold text-white">{setsWonA}</p>
          </div>
          <div className="text-white/40 text-4xl font-bold">:</div>
          <div className="text-center">
            <p className="text-white/60 text-sm">세트</p>
            <p className="text-4xl font-bold text-white">{setsWonB}</p>
          </div>
        </div>

        {/* Current Set Score - Main Display */}
        <div className="bg-black/30 backdrop-blur rounded-3xl p-6 mb-6">
          <div className="text-center mb-4">
            <Badge className="bg-white/10 text-white/80">
              {currentSet}세트
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            {/* Player A */}
            <div className="flex-1 text-center">
              <p className="text-white/80 text-lg mb-2 truncate px-2">{playerAName}</p>
              <div
                className={`text-7xl font-bold tabular-nums transition-all ${
                  winner === "A" ? "text-amber-400 scale-110" : "text-white"
                }`}
              >
                {currentSetScore.playerA}
              </div>
            </div>

            {/* Divider */}
            <div className="px-4">
              <div className="w-px h-24 bg-white/20" />
            </div>

            {/* Player B */}
            <div className="flex-1 text-center">
              <p className="text-white/80 text-lg mb-2 truncate px-2">{playerBName}</p>
              <div
                className={`text-7xl font-bold tabular-nums transition-all ${
                  winner === "B" ? "text-amber-400 scale-110" : "text-white"
                }`}
              >
                {currentSetScore.playerB}
              </div>
            </div>
          </div>

          {/* Winner Display */}
          {isMatchComplete && (
            <div className="mt-6 text-center animate-bounce">
              <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 text-lg px-4 py-2">
                <Trophy className="h-5 w-5 mr-2" />
                {winner === "A" ? playerAName : playerBName} 승리!
              </Badge>
            </div>
          )}
        </div>

        {/* Set History */}
        {setScores.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {setScores.slice(0, -1).map((set, idx) => (
              <Badge
                key={idx}
                className={`${
                  set.playerA > set.playerB
                    ? "bg-white/20 text-white"
                    : "bg-black/20 text-white/60"
                }`}
              >
                {set.playerA}-{set.playerB}
              </Badge>
            ))}
          </div>
        )}

        {/* Score Buttons */}
        {!isMatchComplete && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => handleScore("A")}
              className="h-24 text-2xl font-bold bg-white/20 hover:bg-white/30 text-white border-2 border-white/30"
            >
              <Plus className="h-8 w-8" />
            </Button>
            <Button
              onClick={() => handleScore("B")}
              className="h-24 text-2xl font-bold bg-white/20 hover:bg-white/30 text-white border-2 border-white/30"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            onClick={handleUndo}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            실행취소
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Zap className="h-5 w-5 mr-2" />
            초기화
          </Button>
        </div>

        {/* Match Complete Actions */}
        {isMatchComplete && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => {
                // Save match result
              }}
              className="w-full bg-white text-slate-900 hover:bg-white/90"
            >
              <Trophy className="h-5 w-5 mr-2" />
              경기 결과 저장
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleReset();
              }}
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              새 경기 시작
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
