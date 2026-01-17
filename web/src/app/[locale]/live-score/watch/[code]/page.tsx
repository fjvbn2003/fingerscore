"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Radio,
  Eye,
  Trophy,
  Wifi,
  WifiOff,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SportType } from "@/types/database";

// Mock live match data - in real app would come from websocket/realtime DB
const mockLiveMatch = {
  id: "live123",
  sport_type: "TABLE_TENNIS" as SportType,
  player_a_name: "김철수",
  player_b_name: "박영희",
  current_set: 2,
  sets_won_a: 1,
  sets_won_b: 0,
  current_set_score: { playerA: 8, playerB: 6 },
  set_history: [{ playerA: 11, playerB: 9 }],
  is_complete: false,
  winner: null,
  viewers: 12,
  started_at: "2026-01-18T10:30:00",
};

const sportConfig: Record<SportType, { icon: string; label: string; bgColor: string }> = {
  TABLE_TENNIS: { icon: "🏓", label: "탁구", bgColor: "from-orange-600 to-orange-800" },
  TENNIS: { icon: "🎾", label: "테니스", bgColor: "from-green-600 to-green-800" },
  BADMINTON: { icon: "🏸", label: "배드민턴", bgColor: "from-blue-600 to-blue-800" },
};

export default function WatchLiveScorePage() {
  const params = useParams();
  const code = params.code as string;
  const t = useTranslations();

  const [isConnected, setIsConnected] = useState(false);
  const [matchData, setMatchData] = useState(mockLiveMatch);
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate websocket connection
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 1500);

    // Simulate score updates
    const updateTimer = setInterval(() => {
      setMatchData((prev) => {
        // Random score update simulation
        if (Math.random() > 0.7 && !prev.is_complete) {
          const player = Math.random() > 0.5 ? "A" : "B";
          const newScore = { ...prev.current_set_score };
          if (player === "A") {
            newScore.playerA++;
          } else {
            newScore.playerB++;
          }
          setLastUpdate(new Date());
          return { ...prev, current_set_score: newScore };
        }
        return prev;
      });
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(updateTimer);
    };
  }, [code]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 5) return "방금 전";
    if (seconds < 60) return `${seconds}초 전`;
    return `${Math.floor(seconds / 60)}분 전`;
  };

  // Loading / Connecting state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-pink-600/20 mb-4 animate-pulse">
            <Wifi className="h-8 w-8 text-red-400 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 mb-2">연결 중...</h1>
          <p className="text-slate-400">접속 코드: {code}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${sportConfig[matchData.sport_type].bgColor}`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/30 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/30 text-red-200 border-red-400/30 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
            <Badge className="bg-white/10 text-white/80">
              <Eye className="h-3 w-3 mr-1" />
              {matchData.viewers}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyShareLink}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-lg mx-auto">
        {/* Sport Icon */}
        <div className="text-center mb-6">
          <span className="text-6xl">{sportConfig[matchData.sport_type].icon}</span>
        </div>

        {/* Sets Score */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">세트</p>
            <p className="text-5xl font-bold text-white">{matchData.sets_won_a}</p>
          </div>
          <div className="text-white/40 text-5xl font-bold self-end pb-1">:</div>
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">세트</p>
            <p className="text-5xl font-bold text-white">{matchData.sets_won_b}</p>
          </div>
        </div>

        {/* Current Set Score - Main Display */}
        <div className="bg-black/30 backdrop-blur rounded-3xl p-8 mb-6">
          <div className="text-center mb-6">
            <Badge className="bg-white/10 text-white/80 text-lg px-4 py-1">
              {matchData.current_set}세트
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            {/* Player A */}
            <div className="flex-1 text-center">
              <p className="text-white/80 text-xl mb-4 font-medium truncate px-2">
                {matchData.player_a_name}
              </p>
              <div className="text-8xl font-bold tabular-nums text-white transition-all">
                {matchData.current_set_score.playerA}
              </div>
            </div>

            {/* Divider */}
            <div className="px-6">
              <div className="w-1 h-32 bg-white/20 rounded-full" />
            </div>

            {/* Player B */}
            <div className="flex-1 text-center">
              <p className="text-white/80 text-xl mb-4 font-medium truncate px-2">
                {matchData.player_b_name}
              </p>
              <div className="text-8xl font-bold tabular-nums text-white transition-all">
                {matchData.current_set_score.playerB}
              </div>
            </div>
          </div>

          {/* Winner Display */}
          {matchData.is_complete && matchData.winner && (
            <div className="mt-8 text-center animate-bounce">
              <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 text-xl px-6 py-3">
                <Trophy className="h-6 w-6 mr-2" />
                {matchData.winner === "A" ? matchData.player_a_name : matchData.player_b_name} 승리!
              </Badge>
            </div>
          )}
        </div>

        {/* Set History */}
        {matchData.set_history.length > 0 && (
          <div className="mb-6">
            <p className="text-white/60 text-sm text-center mb-3">이전 세트</p>
            <div className="flex justify-center gap-3">
              {matchData.set_history.map((set, idx) => (
                <Badge
                  key={idx}
                  className={`text-lg px-4 py-2 ${
                    set.playerA > set.playerB
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-black/20 text-white/60 border-white/10"
                  }`}
                >
                  {set.playerA} - {set.playerB}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Last Update */}
        <div className="text-center">
          <p className="text-white/40 text-sm flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            마지막 업데이트: {formatTime()}
          </p>
        </div>

        {/* Connection Status */}
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-black/30 backdrop-blur">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-white/60 text-sm">실시간 연결됨</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-white/60 text-sm">연결 끊김</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
