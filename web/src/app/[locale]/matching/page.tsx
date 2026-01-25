"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Users,
  MessageCircle,
  Filter,
  ChevronDown,
  Heart,
  Zap,
  Shield,
  Trophy,
  Calendar,
  Send,
  UserPlus,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock data - 매칭 가능한 유저
const availableUsers = [
  {
    id: 1,
    name: "김탁구",
    avatar: null,
    rating: 1650,
    level: "intermediate",
    location: "서울 강남구",
    club: "강남탁구클럽",
    playStyle: "공격형",
    preferredTime: ["평일 저녁", "주말 오전"],
    introduction: "즐겁게 칠 분 찾습니다! 실력보다는 매너를 중시해요.",
    matchCount: 127,
    winRate: 58,
    lastActive: "10분 전",
    isOnline: true,
    badges: ["친절왕", "열정맨"],
  },
  {
    id: 2,
    name: "이스핀",
    avatar: null,
    rating: 1820,
    level: "advanced",
    location: "서울 송파구",
    club: "잠실탁구장",
    playStyle: "회전형",
    preferredTime: ["주말 오후"],
    introduction: "드라이브 연습 같이 하실 분! 서브 리시브 훈련도 환영",
    matchCount: 203,
    winRate: 65,
    lastActive: "1시간 전",
    isOnline: true,
    badges: ["기술파", "고수"],
  },
  {
    id: 3,
    name: "박수비",
    avatar: null,
    rating: 1450,
    level: "beginner",
    location: "경기 성남시",
    club: "분당생활체육관",
    playStyle: "수비형",
    preferredTime: ["평일 오전", "평일 저녁"],
    introduction: "입문한 지 6개월, 함께 성장할 파트너 구해요~",
    matchCount: 34,
    winRate: 41,
    lastActive: "방금 전",
    isOnline: true,
    badges: ["초보환영", "성실왕"],
  },
  {
    id: 4,
    name: "최드라이브",
    avatar: null,
    rating: 1720,
    level: "intermediate",
    location: "서울 마포구",
    club: "홍대탁구",
    playStyle: "공격형",
    preferredTime: ["평일 저녁"],
    introduction: "포핸드 드라이브 실력자, 백핸드 연습 같이 할 분!",
    matchCount: 89,
    winRate: 62,
    lastActive: "30분 전",
    isOnline: false,
    badges: ["파워히터"],
  },
];

// Mock data - 매칭 요청
const matchingRequests = [
  {
    id: 1,
    from: {
      name: "정배드민턴",
      avatar: null,
      rating: 1580,
      location: "서울 강서구",
    },
    message: "안녕하세요! 레이팅이 비슷해서 연락드려요. 주말에 한 번 치실래요?",
    preferredDate: "2024-01-20",
    preferredTime: "14:00",
    venue: "양천구민체육관",
    status: "pending",
    createdAt: "2시간 전",
  },
  {
    id: 2,
    from: {
      name: "홍길동",
      avatar: null,
      rating: 1620,
      location: "서울 영등포구",
    },
    message: "게시글 보고 연락드립니다. 평일 저녁에 꾸준히 치실 분 찾는다고 하셔서요!",
    preferredDate: "2024-01-18",
    preferredTime: "19:30",
    venue: "여의도 탁구클럽",
    status: "pending",
    createdAt: "5시간 전",
  },
];

// Mock data - 내가 보낸 요청
const sentRequests = [
  {
    id: 1,
    to: {
      name: "김프로",
      avatar: null,
      rating: 1900,
      location: "서울 강남구",
    },
    message: "고수님 한 수 가르침 받고 싶습니다!",
    preferredDate: "2024-01-21",
    preferredTime: "10:00",
    venue: "강남탁구클럽",
    status: "accepted",
    createdAt: "1일 전",
  },
];

// Mock data - 퀵매칭 (실시간)
const quickMatchUsers = [
  {
    id: 1,
    name: "실시간1",
    rating: 1550,
    distance: "1.2km",
    waitingTime: "5분",
  },
  {
    id: 2,
    name: "실시간2",
    rating: 1680,
    distance: "2.5km",
    waitingTime: "3분",
  },
];

function PlayStyleBadge({ style }: { style: string }) {
  const config: Record<string, { icon: React.ElementType; color: string }> = {
    공격형: { icon: Zap, color: "bg-red-500/10 text-red-400 border-red-500/20" },
    수비형: { icon: Shield, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    회전형: { icon: Trophy, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  };
  const { icon: Icon, color } = config[style] || config["공격형"];
  return (
    <Badge variant="outline" className={color}>
      <Icon className="w-3 h-3 mr-1" />
      {style}
    </Badge>
  );
}

function LevelBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; className: string }> = {
    beginner: { label: "입문", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    intermediate: { label: "중급", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    advanced: { label: "상급", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  };
  const { label, className } = config[level] || config.beginner;
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

export default function MatchingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isQuickMatchActive, setIsQuickMatchActive] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-pink-500/30 bg-pink-500/10">
              <Users className="w-3 h-3 mr-1" />
              연습 상대 매칭
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              함께 칠 <span className="gradient-text">파트너</span>를 찾아보세요
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              비슷한 실력, 가까운 거리의 파트너와 함께 실력을 키워보세요
            </p>

            {/* 퀵매칭 버튼 */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsQuickMatchActive(!isQuickMatchActive)}
                className={`gap-2 ${
                  isQuickMatchActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                }`}
              >
                <Zap className="h-5 w-5" />
                {isQuickMatchActive ? "매칭 중지" : "퀵매칭 시작"}
              </Button>
              {isQuickMatchActive && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  주변에서 상대를 찾고 있습니다...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* 퀵매칭 결과 (활성화 시) */}
        {isQuickMatchActive && quickMatchUsers.length > 0 && (
          <Card className="mb-8 glass-card border-emerald-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <CardTitle>실시간 매칭 가능</CardTitle>
              </div>
              <CardDescription>지금 바로 경기 가능한 상대입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickMatchUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-card border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Rating {user.rating}</span>
                          <span>•</span>
                          <span>{user.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        대기 {user.waitingTime}
                      </span>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                        수락
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, 지역, 탁구장으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-white/10"
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[140px] bg-card/50 border-white/10">
              <SelectValue placeholder="실력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 실력</SelectItem>
              <SelectItem value="beginner">입문</SelectItem>
              <SelectItem value="intermediate">중급</SelectItem>
              <SelectItem value="advanced">상급</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[140px] bg-card/50 border-white/10">
              <SelectValue placeholder="지역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              <SelectItem value="seoul">서울</SelectItem>
              <SelectItem value="gyeonggi">경기</SelectItem>
              <SelectItem value="incheon">인천</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 메인 컨텐츠 */}
        <Tabs defaultValue="find" className="space-y-6">
          <TabsList className="bg-card/50 border border-white/10">
            <TabsTrigger value="find">파트너 찾기</TabsTrigger>
            <TabsTrigger value="received" className="relative">
              받은 요청
              {matchingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {matchingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">보낸 요청</TabsTrigger>
          </TabsList>

          {/* 파트너 찾기 */}
          <TabsContent value="find" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {availableUsers.map((user) => (
                <Card key={user.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xl">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            {user.isOnline && (
                              <span className="text-xs text-emerald-400">접속 중</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <LevelBadge level={user.level} />
                            <PlayStyleBadge style={user.playStyle} />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">{user.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>

                    {/* 소개글 */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {user.introduction}
                    </p>

                    {/* 배지 */}
                    {user.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {user.badges.map((badge, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 선호 시간 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.preferredTime.map((time, index) => (
                        <Badge key={index} variant="outline" className="bg-card border-white/10 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>

                    {/* 통계 */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-card/50">
                      <span>경기 {user.matchCount}회</span>
                      <span>•</span>
                      <span>승률 {user.winRate}%</span>
                      <span>•</span>
                      <span>{user.lastActive}</span>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                            <Send className="h-4 w-4 mr-2" />
                            매칭 신청
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card">
                          <DialogHeader>
                            <DialogTitle>{user.name}님에게 매칭 신청</DialogTitle>
                            <DialogDescription>
                              메시지와 함께 원하는 시간을 알려주세요
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">메시지</label>
                              <Textarea
                                placeholder="자기소개와 함께 인사를 건네보세요!"
                                className="bg-card/50 border-white/10"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">희망 날짜</label>
                                <Input type="date" className="bg-card/50 border-white/10" />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">희망 시간</label>
                                <Input type="time" className="bg-card/50 border-white/10" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">희망 장소</label>
                              <Input
                                placeholder="경기할 장소를 입력하세요"
                                className="bg-card/50 border-white/10"
                              />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                              매칭 신청 보내기
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" className="border-white/10">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-white/10">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 받은 요청 */}
          <TabsContent value="received" className="space-y-4">
            {matchingRequests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">받은 매칭 요청이 없습니다</p>
                </CardContent>
              </Card>
            ) : (
              matchingRequests.map((request) => (
                <Card key={request.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                            {request.from.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{request.from.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {request.from.rating} RP
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {request.from.location}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{request.createdAt}</span>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-card/50 border border-white/5">
                      <p className="text-sm mb-3">{request.message}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {request.preferredDate} {request.preferredTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        수락
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/10 text-red-400 hover:bg-red-500/10">
                        <X className="h-4 w-4 mr-2" />
                        거절
                      </Button>
                      <Button variant="outline" className="border-white/10">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 보낸 요청 */}
          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">보낸 매칭 요청이 없습니다</p>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <Card key={request.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                            {request.to.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{request.to.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {request.to.rating} RP
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {request.to.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="outline"
                          className={
                            request.status === "accepted"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : request.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }
                        >
                          {request.status === "accepted"
                            ? "수락됨"
                            : request.status === "pending"
                            ? "대기 중"
                            : "거절됨"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{request.createdAt}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-card/50 border border-white/5">
                      <p className="text-sm mb-3">{request.message}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {request.preferredDate} {request.preferredTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.venue}
                        </span>
                      </div>
                    </div>

                    {request.status === "accepted" && (
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          대화하기
                        </Button>
                        <Button variant="outline" className="border-white/10">
                          <Calendar className="h-4 w-4 mr-2" />
                          일정 확인
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* 매칭 팁 */}
        <Card className="mt-8 glass-card border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              매칭 성공률 높이는 팁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl mb-2">👋</div>
                <h4 className="font-semibold mb-1">정중한 인사</h4>
                <p className="text-sm text-muted-foreground">
                  첫 메시지에서 자기소개와 함께 인사를 건네세요
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-semibold mb-1">구체적인 일정</h4>
                <p className="text-sm text-muted-foreground">
                  희망하는 날짜와 시간을 명확히 제안하세요
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50">
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="font-semibold mb-1">프로필 완성</h4>
                <p className="text-sm text-muted-foreground">
                  완성된 프로필은 신뢰도를 높여줍니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
