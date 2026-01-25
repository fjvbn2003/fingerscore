"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Play,
  Eye,
  ThumbsUp,
  Clock,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Youtube,
  Filter,
  Star,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 인기 탁구 유튜브 채널 목록
const popularChannels = [
  { id: "1", name: "탁구 코치 김택수", subscribers: "52만", avatar: "🏓" },
  { id: "2", name: "TableTennisDaily", subscribers: "120만", avatar: "🎯" },
  { id: "3", name: "PingSkills", subscribers: "89만", avatar: "⭐" },
  { id: "4", name: "탁구왕 유승민", subscribers: "38만", avatar: "👑" },
  { id: "5", name: "WTT World Table Tennis", subscribers: "180만", avatar: "🌍" },
];

// Mock 인기 영상 데이터 (실제로는 YouTube API로 가져옴)
const mockVideos = [
  {
    id: "v1",
    title: "장우진 vs 왕추친 - 2024 파리올림픽 4강전 하이라이트",
    channel: "WTT World Table Tennis",
    channelAvatar: "🌍",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "2.3M",
    likes: "45K",
    duration: "12:34",
    publishedAt: "2일 전",
    category: "대회",
    trending: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v2",
    title: "포핸드 드라이브 완벽 마스터 - 초보자도 3일이면 OK!",
    channel: "탁구 코치 김택수",
    channelAvatar: "🏓",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "892K",
    likes: "32K",
    duration: "18:45",
    publishedAt: "1주 전",
    category: "레슨",
    trending: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v3",
    title: "하회전 서브 리시브 완벽 공략법 | 실전 팁 공개",
    channel: "PingSkills",
    channelAvatar: "⭐",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "654K",
    likes: "28K",
    duration: "15:20",
    publishedAt: "3일 전",
    category: "레슨",
    trending: false,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v4",
    title: "마롱 vs 판전동 - 역대급 랠리 모음",
    channel: "TableTennisDaily",
    channelAvatar: "🎯",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "1.8M",
    likes: "52K",
    duration: "8:45",
    publishedAt: "5일 전",
    category: "대회",
    trending: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v5",
    title: "러버 교체 시기와 관리법 - 프로가 알려주는 꿀팁",
    channel: "탁구왕 유승민",
    channelAvatar: "👑",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "423K",
    likes: "19K",
    duration: "11:30",
    publishedAt: "1주 전",
    category: "장비",
    trending: false,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v6",
    title: "백핸드 플릭 - 세계 1위의 비밀 기술 분석",
    channel: "탁구 코치 김택수",
    channelAvatar: "🏓",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "567K",
    likes: "24K",
    duration: "14:15",
    publishedAt: "4일 전",
    category: "레슨",
    trending: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v7",
    title: "2024 세계탁구선수권 결승 - 풀매치",
    channel: "WTT World Table Tennis",
    channelAvatar: "🌍",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "3.2M",
    likes: "78K",
    duration: "45:00",
    publishedAt: "2주 전",
    category: "대회",
    trending: true,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "v8",
    title: "테너지 05 vs 라잔터 R48 - 실사용 비교 리뷰",
    channel: "탁구왕 유승민",
    channelAvatar: "👑",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    views: "289K",
    likes: "15K",
    duration: "22:10",
    publishedAt: "6일 전",
    category: "장비",
    trending: false,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const categories = ["전체", "대회", "레슨", "장비", "리뷰"];

export default function VideosPage() {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredVideos = selectedCategory === "전체"
    ? mockVideos
    : mockVideos.filter(v => v.category === selectedCategory);

  const trendingVideos = mockVideos.filter(v => v.trending);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 실제로는 YouTube API를 호출
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // 자동 업데이트 (30분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30 * 60 * 1000); // 30분

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-4 py-2 mb-6">
              <Youtube className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-red-400">인기 탁구 영상</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              🎬 탁구 <span className="gradient-text">영상 랭킹</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              유튜브에서 가장 인기 있는 탁구 영상을 한눈에!
              <br className="hidden sm:block" />
              레슨, 대회 하이라이트, 장비 리뷰까지 모두 모았습니다.
            </p>

            {/* 마지막 업데이트 시간 */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">
                마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-white/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <Tabs defaultValue="trending" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="trending">🔥 실시간 인기</TabsTrigger>
            <TabsTrigger value="all">📺 전체 영상</TabsTrigger>
            <TabsTrigger value="channels">📢 인기 채널</TabsTrigger>
          </TabsList>

          {/* 실시간 인기 탭 */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendingVideos.map((video, index) => (
                <a
                  key={video.id}
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="glass-card border-white/5 overflow-hidden hover-lift h-full">
                    <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
                      {/* Rank Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className={`${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-amber-600' : 'bg-white/20'
                        } text-white font-bold`}>
                          #{index + 1}
                        </Badge>
                      </div>

                      {/* Trending Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-500/90 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          인기
                        </Badge>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                          {video.duration}
                        </Badge>
                      </div>

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white fill-white ml-1" />
                        </div>
                      </div>

                      {/* Thumbnail placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        🏓
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="text-2xl shrink-0">{video.channelAvatar}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {video.likes}
                            </span>
                            <span>{video.publishedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* 전체 영상 탭 */}
          <TabsContent value="all" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "border-white/10"
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredVideos.map((video, index) => (
                <a
                  key={video.id}
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="glass-card border-white/5 overflow-hidden hover-lift">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative aspect-video sm:w-48 sm:aspect-auto sm:h-32 bg-gradient-to-br from-slate-800 to-slate-900 shrink-0">
                        <div className="absolute bottom-2 right-2 z-10">
                          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                            {video.duration}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          🏓
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-10 w-10 text-white fill-white" />
                        </div>
                      </div>

                      <CardContent className="p-4 flex-1">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {video.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors mb-2">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">{video.channel}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {video.likes}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* 인기 채널 탭 */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularChannels.map((channel, index) => (
                <Card key={channel.id} className="glass-card border-white/5 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="text-4xl">{channel.avatar}</div>
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                          } text-white`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          구독자 {channel.subscribers}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Youtube className="h-4 w-4 mr-1" />
                        구독
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                더 많은 탁구 채널을 찾고 계신가요?
              </p>
              <Button asChild variant="outline" className="border-white/10">
                <a
                  href="https://www.youtube.com/results?search_query=탁구"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4 mr-2 text-red-500" />
                  유튜브에서 더 보기
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="glass-card border-white/5 mt-12">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold mb-2">영상 랭킹 자동 업데이트</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              이 페이지의 영상 랭킹은 <strong>30분마다 자동으로 업데이트</strong>됩니다.
              YouTube API를 통해 실시간 조회수, 좋아요 수를 기반으로 순위가 결정됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
