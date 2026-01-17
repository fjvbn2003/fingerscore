"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Heart,
  Flame,
  Sparkles,
  Camera,
  Tag,
  Wand2,
  Loader2,
  Send,
  ChevronRight,
  Share2,
  Bookmark,
  MoreHorizontal,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SportType, MatchCommentReaction } from "@/types/database";

// Mock match data
const mockMatchData = {
  id: "1",
  sport_type: "TABLE_TENNIS" as SportType,
  player_a: { id: "me", name: "나", rating: 1580, avatar: null },
  player_b: { id: "u1", name: "김철수", rating: 1650, avatar: null, club: "강남 탁구클럽" },
  myScore: 3,
  opponentScore: 1,
  setScores: [{ a: 11, b: 8 }, { a: 11, b: 9 }, { a: 9, b: 11 }, { a: 11, b: 7 }],
  date: "2026-01-18",
  time: "14:30",
  venue: "서초 탁구클럽",
  isWin: true,
  ratingChange: 12,
  status: "CONFIRMED",
  // Memory data
  memory: {
    id: "m1",
    ai_briefing: "오늘 경기는 치열한 접전이었습니다. 1, 2세트를 연속으로 가져가며 좋은 출발을 했지만, 3세트에서 상대의 강력한 포핸드 공격에 밀렸습니다. 하지만 4세트에서 서브 전술을 변경하며 경기를 마무리했습니다. 특히 중요한 포인트에서의 집중력이 돋보였던 경기였습니다. 다음 경기에서는 수비 전환 속도를 더 빠르게 하면 더 좋은 결과를 기대할 수 있을 것입니다.",
    ai_briefing_status: "COMPLETED",
    photo_urls: [],
    tags: ["접전", "역전승", "집중력"],
    highlights: {
      keyMoments: [
        "1세트 8-8에서 연속 3점으로 세트 획득",
        "4세트 초반 서브 전술 변경이 주효",
      ],
      strengths: ["서브 변화", "결정적 순간 집중력"],
      improvements: ["수비 전환 속도"],
    },
    stats_snapshot: {
      winStreak: 3,
      seasonRecord: "15승 8패",
      vsOpponent: "2승 1패",
      ratingTrend: "+45 (최근 1개월)",
    },
  },
  // Comments
  comments: [
    {
      id: "c1",
      author: { id: "u1", name: "김철수", avatar: null },
      content: "좋은 경기였습니다! 다음에 또 붙어요!",
      is_quick_message: false,
      created_at: "2026-01-18T15:00:00",
      reactions: [
        { reaction: "HEART" as MatchCommentReaction, count: 2 },
        { reaction: "FIRE" as MatchCommentReaction, count: 1 },
      ],
    },
    {
      id: "c2",
      author: { id: "u2", name: "박영희", avatar: null },
      content: "수고하셨습니다!",
      is_quick_message: true,
      quick_message_key: "wellPlayed",
      created_at: "2026-01-18T15:05:00",
      reactions: [
        { reaction: "CLAP" as MatchCommentReaction, count: 3 },
      ],
    },
  ],
};

const sportConfig: Record<SportType, { icon: string; label: string; bgGradient: string }> = {
  TABLE_TENNIS: { icon: "🏓", label: "탁구", bgGradient: "from-orange-500/20 to-orange-600/10" },
  TENNIS: { icon: "🎾", label: "테니스", bgGradient: "from-green-500/20 to-green-600/10" },
  BADMINTON: { icon: "🏸", label: "배드민턴", bgGradient: "from-blue-500/20 to-blue-600/10" },
};

const quickMessages = [
  { key: "wellPlayed", label: "수고하셨습니다!", icon: "👏" },
  { key: "greatGame", label: "좋은 경기였습니다!", icon: "🎯" },
  { key: "goodMatch", label: "좋은 승부였어요!", icon: "🔥" },
  { key: "nicePlay", label: "플레이 멋졌습니다!", icon: "✨" },
  { key: "congrats", label: "축하드립니다!", icon: "🏆" },
  { key: "nextTime", label: "다음엔 제가 이길게요!", icon: "💪" },
  { key: "thankYou", label: "즐거운 경기 감사합니다!", icon: "🙏" },
  { key: "rematch", label: "재경기 해요!", icon: "🔄" },
];

const reactionConfig: Record<MatchCommentReaction, { icon: string; label: string }> = {
  LIKE: { icon: "👍", label: "좋아요" },
  FIRE: { icon: "🔥", label: "불타오름" },
  CLAP: { icon: "👏", label: "박수" },
  HEART: { icon: "❤️", label: "하트" },
  TROPHY: { icon: "🏆", label: "트로피" },
};

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  const t = useTranslations();

  const [match] = useState(mockMatchData);
  const [newComment, setNewComment] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);

  const handleGenerateBriefing = async () => {
    setIsGeneratingBriefing(true);
    // Simulate AI briefing generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGeneratingBriefing(false);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    console.log("Posting comment:", newComment);
    setNewComment("");
  };

  const handleQuickMessage = (message: string) => {
    console.log("Sending quick message:", message);
    setShowQuickMessages(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    console.log("Adding tag:", newTag);
    setNewTag("");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container max-w-screen-lg py-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{t("matchMemory.title")}</h1>
          <p className="text-sm text-muted-foreground">{match.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Match Result Card */}
      <Card className={`glass-card border-white/10 mb-6 overflow-hidden`}>
        <div className={`bg-gradient-to-r ${sportConfig[match.sport_type].bgGradient} p-6`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">{sportConfig[match.sport_type].icon}</span>
            <Badge className="bg-white/20 text-white border-0">
              {sportConfig[match.sport_type].label}
            </Badge>
            {match.isWin && (
              <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30">
                <Trophy className="h-3 w-3 mr-1" />
                승리
              </Badge>
            )}
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl">
                  {match.player_a.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg text-white">{match.player_a.name}</p>
              <p className="text-sm text-white/60">{match.player_a.rating}</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {match.myScore} : {match.opponentScore}
              </div>
              <div className={cn(
                "flex items-center justify-center gap-1 text-lg font-semibold",
                match.ratingChange > 0 ? "text-emerald-300" : "text-red-300"
              )}>
                {match.ratingChange > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {match.ratingChange > 0 ? "+" : ""}{match.ratingChange}
              </div>
            </div>

            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-2 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                  {match.player_b.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold text-lg text-white">{match.player_b.name}</p>
              <p className="text-sm text-white/60">{match.player_b.rating}</p>
            </div>
          </div>

          {/* Set Scores */}
          <div className="flex justify-center gap-2 mb-4">
            {match.setScores.map((set, idx) => (
              <Badge
                key={idx}
                className={cn(
                  "text-sm px-3 py-1",
                  set.a > set.b
                    ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/30"
                    : "bg-red-500/30 text-red-200 border-red-400/30"
                )}
              >
                {set.a}-{set.b}
              </Badge>
            ))}
          </div>

          {/* Match Info */}
          <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {match.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {match.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {match.venue}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs for Memory and Comments */}
      <Tabs defaultValue="memory" className="space-y-4">
        <TabsList className="glass border-white/10 w-full">
          <TabsTrigger value="memory" className="flex-1 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Sparkles className="h-4 w-4 mr-2" />
            {t("matchMemory.title")}
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("postMatch.comments")} ({match.comments.length})
          </TabsTrigger>
        </TabsList>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-4">
          {/* AI Briefing */}
          <Card className="glass-card border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Wand2 className="h-5 w-5" />
                {t("matchMemory.briefing")}
              </CardTitle>
              <CardDescription>
                {t("matchMemory.briefingDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {match.memory.ai_briefing_status === "COMPLETED" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-slate-300 leading-relaxed">
                    {match.memory.ai_briefing}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wand2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">{t("matchMemory.noBriefing")}</p>
                  <Button
                    onClick={handleGenerateBriefing}
                    disabled={isGeneratingBriefing}
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    {isGeneratingBriefing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("matchMemory.generatingBriefing")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t("matchMemory.generateBriefing")}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Highlights */}
          {match.memory.highlights && (
            <Card className="glass-card border-amber-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <Zap className="h-5 w-5" />
                  {t("matchMemory.highlights")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Moments */}
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">{t("matchMemory.keyMoments")}</h4>
                  <ul className="space-y-2">
                    {match.memory.highlights.keyMoments.map((moment, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <Target className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        {moment}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <h5 className="text-xs font-medium text-emerald-400 mb-2">잘한 점</h5>
                    <ul className="space-y-1">
                      {match.memory.highlights.strengths.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-1">
                          <span className="text-emerald-400">+</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h5 className="text-xs font-medium text-blue-400 mb-2">개선할 점</h5>
                    <ul className="space-y-1">
                      {match.memory.highlights.improvements.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-1">
                          <span className="text-blue-400">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Snapshot */}
          {match.memory.stats_snapshot && (
            <Card className="glass-card border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Award className="h-5 w-5" />
                  {t("matchMemory.statsSnapshot")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">연승</p>
                    <p className="text-lg font-bold text-slate-200">{match.memory.stats_snapshot.winStreak}연승</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">시즌 전적</p>
                    <p className="text-lg font-bold text-slate-200">{match.memory.stats_snapshot.seasonRecord}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">상대 전적</p>
                    <p className="text-lg font-bold text-slate-200">{match.memory.stats_snapshot.vsOpponent}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-slate-500 mb-1">레이팅 추세</p>
                    <p className="text-lg font-bold text-emerald-400">{match.memory.stats_snapshot.ratingTrend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {t("matchMemory.tags")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {match.memory.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="border-white/20">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("matchMemory.addTag")}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="glass border-white/10"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button variant="outline" onClick={handleAddTag} className="border-white/10">
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Photo */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t("matchMemory.memoryPhoto")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {match.memory.photo_urls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {/* Photos would be displayed here */}
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed border-white/10 h-24">
                  <Camera className="h-6 w-6 mr-2 text-muted-foreground" />
                  {t("matchMemory.addPhoto")}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {/* Quick Messages */}
          <Card className="glass-card border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400">{t("postMatch.quickMessages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickMessages.map((msg) => (
                  <Button
                    key={msg.key}
                    variant="outline"
                    className="h-auto py-2 px-3 border-white/10 hover:bg-white/5 text-left justify-start"
                    onClick={() => handleQuickMessage(msg.label)}
                  >
                    <span className="text-lg mr-2">{msg.icon}</span>
                    <span className="text-xs truncate">{msg.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle>{t("postMatch.comments")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {match.comments.length > 0 ? (
                <div className="space-y-4">
                  {match.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {comment.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(comment.created_at)}
                          </span>
                          {comment.is_quick_message && (
                            <Badge variant="outline" className="text-xs border-white/10">
                              빠른 응원
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-300">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {comment.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                            >
                              {reactionConfig[reaction.reaction].icon} {reaction.count}
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
                            {t("postMatch.react")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">{t("postMatch.noComments")}</p>
                  <p className="text-sm text-slate-500">{t("postMatch.beFirstToComment")}</p>
                </div>
              )}

              {/* Comment Input */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Textarea
                  placeholder={t("postMatch.commentPlaceholder")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="glass border-white/10 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t("postMatch.addComment")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
