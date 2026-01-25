"use client";

import { useState } from "react";
import {
  Search,
  Play,
  Clock,
  Eye,
  Heart,
  BookOpen,
  Target,
  Zap,
  Shield,
  RotateCcw,
  ChevronRight,
  Star,
  Trophy,
  Users,
  Filter
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
import { Progress } from "@/components/ui/progress";

// Mock data - 기술 카테고리
const skillCategories = [
  { id: "basics", name: "기초", icon: BookOpen, color: "bg-green-500", count: 12 },
  { id: "serve", name: "서브", icon: Target, color: "bg-blue-500", count: 8 },
  { id: "attack", name: "공격", icon: Zap, color: "bg-red-500", count: 15 },
  { id: "defense", name: "수비", icon: Shield, color: "bg-purple-500", count: 10 },
  { id: "spin", name: "회전", icon: RotateCcw, color: "bg-orange-500", count: 9 },
];

// Mock data - 인기 레슨
const popularLessons = [
  {
    id: 1,
    title: "포핸드 드라이브 완벽 가이드",
    category: "attack",
    level: "beginner",
    duration: "15:30",
    views: 12500,
    likes: 890,
    thumbnail: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400",
    instructor: "김프로 코치",
    instructorRating: 4.9,
    description: "포핸드 드라이브의 기본 자세부터 실전 활용까지",
    progress: 75,
  },
  {
    id: 2,
    title: "백핸드 플릭 마스터하기",
    category: "attack",
    level: "intermediate",
    duration: "12:45",
    views: 8300,
    likes: 620,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    instructor: "이코치",
    instructorRating: 4.8,
    description: "짧은 서브를 공격으로 전환하는 플릭 기술",
    progress: 0,
  },
  {
    id: 3,
    title: "하회전 서브의 모든 것",
    category: "serve",
    level: "beginner",
    duration: "18:20",
    views: 15200,
    likes: 1100,
    thumbnail: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400",
    instructor: "박서브왕",
    instructorRating: 4.95,
    description: "기본 하회전부터 변화구까지 서브의 모든 것",
    progress: 100,
  },
  {
    id: 4,
    title: "숏 커트 수비 기술",
    category: "defense",
    level: "intermediate",
    duration: "10:15",
    views: 6800,
    likes: 450,
    thumbnail: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400",
    instructor: "정수비 코치",
    instructorRating: 4.7,
    description: "강력한 드라이브를 막아내는 커트 기술",
    progress: 30,
  },
];

// Mock data - 학습 경로
const learningPaths = [
  {
    id: 1,
    title: "입문자 완성 코스",
    description: "탁구를 처음 시작하는 분들을 위한 체계적인 커리큘럼",
    level: "beginner",
    totalLessons: 20,
    completedLessons: 8,
    duration: "6시간",
    students: 3420,
    rating: 4.9,
    lessons: [
      { title: "그립 잡는 법", completed: true },
      { title: "기본 자세와 스텝", completed: true },
      { title: "포핸드 기초", completed: true },
      { title: "백핸드 기초", completed: false },
    ],
  },
  {
    id: 2,
    title: "서브 마스터 코스",
    description: "다양한 서브 기술을 익히고 실전에서 활용하는 방법",
    level: "intermediate",
    totalLessons: 15,
    completedLessons: 0,
    duration: "4시간",
    students: 2150,
    rating: 4.85,
    lessons: [
      { title: "서브의 기본 원리", completed: false },
      { title: "하회전 서브", completed: false },
      { title: "상회전 서브", completed: false },
      { title: "측회전 서브", completed: false },
    ],
  },
  {
    id: 3,
    title: "공격 테크닉 심화",
    description: "강력하고 다양한 공격 패턴을 익히는 고급 과정",
    level: "advanced",
    totalLessons: 18,
    completedLessons: 5,
    duration: "5시간 30분",
    students: 1280,
    rating: 4.92,
    lessons: [
      { title: "루프 드라이브", completed: true },
      { title: "카운터 드라이브", completed: true },
      { title: "스매시 타이밍", completed: false },
      { title: "연속 공격 패턴", completed: false },
    ],
  },
];

// Mock data - 오늘의 팁
const dailyTips = [
  {
    id: 1,
    emoji: "🎯",
    title: "서브 회전량 높이기",
    tip: "손목 스냅을 더 활용하면 회전량이 크게 증가합니다. 공을 스치듯이 치는 느낌을 연습해보세요.",
  },
  {
    id: 2,
    emoji: "👟",
    title: "풋워크의 중요성",
    tip: "좋은 풋워크는 모든 기술의 기반입니다. 매일 5분씩 사이드 스텝 연습을 해보세요.",
  },
  {
    id: 3,
    emoji: "🧠",
    title: "상대 분석하기",
    tip: "경기 전 상대의 약점을 파악하세요. 백핸드가 약하다면 그쪽을 집중 공략하세요.",
  },
];

// Mock data - 연습 드릴
const practiceDrills = [
  {
    id: 1,
    name: "멀티볼 드라이브",
    duration: "10분",
    difficulty: 2,
    focus: "포핸드 연속 드라이브",
    description: "연속으로 포핸드 드라이브를 연습하여 일관성 향상",
  },
  {
    id: 2,
    name: "서브 & 3구 공격",
    duration: "15분",
    difficulty: 3,
    focus: "서브 후 공격 전환",
    description: "서브 후 상대의 리턴을 공격하는 패턴 연습",
  },
  {
    id: 3,
    name: "풋워크 드릴",
    duration: "5분",
    difficulty: 1,
    focus: "이동 스피드",
    description: "빠른 이동과 복귀를 위한 기초 풋워크",
  },
];

function LevelBadge({ level }: { level: string }) {
  const config = {
    beginner: { label: "입문", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    intermediate: { label: "중급", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    advanced: { label: "상급", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  };
  const { label, className } = config[level as keyof typeof config] || config.beginner;
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10">
              <BookOpen className="w-3 h-3 mr-1" />
              탁구 교실
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">기술을 업그레이드</span>하세요
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              프로 코치들의 노하우를 담은 레슨으로 실력을 한 단계 높여보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="배우고 싶은 기술 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-white/10"
                />
              </div>
              <Button variant="outline" className="gap-2 border-white/10">
                <Filter className="h-4 w-4" />
                필터
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* 기술 카테고리 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">기술 카테고리</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {skillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-xl border transition-all ${
                    selectedCategory === category.id
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-white/10 bg-card/50 hover:bg-card hover:border-white/20"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-3 mx-auto`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.count}개 레슨</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 메인 컨텐츠 */}
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="bg-card/50 border border-white/10">
            <TabsTrigger value="lessons">인기 레슨</TabsTrigger>
            <TabsTrigger value="paths">학습 경로</TabsTrigger>
            <TabsTrigger value="drills">연습 드릴</TabsTrigger>
            <TabsTrigger value="tips">오늘의 팁</TabsTrigger>
          </TabsList>

          {/* 인기 레슨 */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {popularLessons.map((lesson) => (
                <Card key={lesson.id} className="glass-card group overflow-hidden">
                  <div className="relative">
                    <div
                      className="aspect-video bg-cover bg-center"
                      style={{ backgroundImage: `url(${lesson.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                          <Play className="h-5 w-5" fill="currentColor" />
                          시청하기
                        </Button>
                      </div>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-black/70">
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.duration}
                    </Badge>
                    {lesson.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <LevelBadge level={lesson.level} />
                      <span className="text-xs text-muted-foreground">
                        {lesson.progress === 100 ? "완료" : lesson.progress > 0 ? `${lesson.progress}% 진행` : ""}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {lesson.instructor[0]}
                        </div>
                        <span className="text-sm">{lesson.instructor}</span>
                        <div className="flex items-center text-amber-400 text-xs">
                          <Star className="h-3 w-3 fill-current" />
                          {lesson.instructorRating}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {(lesson.views / 1000).toFixed(1)}K
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {lesson.likes}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline" className="gap-2 border-white/10">
                더 많은 레슨 보기
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* 학습 경로 */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="glass-card">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <LevelBadge level={path.level} />
                          <div className="flex items-center text-amber-400 text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            {path.rating}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {path.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {path.totalLessons}개 레슨
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {path.students.toLocaleString()}명
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* 진행률 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">진행률</span>
                        <span className="font-medium">
                          {path.completedLessons}/{path.totalLessons} 완료
                        </span>
                      </div>
                      <Progress
                        value={(path.completedLessons / path.totalLessons) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* 레슨 목록 미리보기 */}
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      {path.lessons.map((lesson, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-3 rounded-lg ${
                            lesson.completed
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-card border border-white/10"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            lesson.completed
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {lesson.completed ? "✓" : index + 1}
                          </div>
                          <span className={lesson.completed ? "text-emerald-400" : ""}>
                            {lesson.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                      {path.completedLessons > 0 ? "이어서 학습하기" : "학습 시작하기"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 연습 드릴 */}
          <TabsContent value="drills" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {practiceDrills.map((drill) => (
                <Card key={drill.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {drill.duration}
                      </Badge>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < drill.difficulty ? "bg-amber-400" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{drill.name}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-muted-foreground">집중: {drill.focus}</span>
                    </div>
                    <Button variant="outline" className="w-full border-white/10">
                      <Play className="h-4 w-4 mr-2" />
                      드릴 시작
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 오늘의 추천 루틴 */}
            <Card className="glass-card border-emerald-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Trophy className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>오늘의 추천 루틴</CardTitle>
                    <CardDescription>30분 집중 연습으로 실력 향상</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {practiceDrills.map((drill, index) => (
                    <Badge key={index} variant="outline" className="bg-card border-white/10">
                      {drill.name} ({drill.duration})
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">총 30분 소요</span>
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-600">
                    루틴 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 오늘의 팁 */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {dailyTips.map((tip) => (
                <Card key={tip.id} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{tip.emoji}</div>
                    <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground">{tip.tip}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 전문가 Q&A */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>전문가에게 질문하기</CardTitle>
                <CardDescription>
                  기술에 대한 궁금증을 프로 코치에게 직접 물어보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="질문을 입력하세요 (예: 하회전 서브가 잘 안 걸려요)"
                    className="flex-1 bg-card/50 border-white/10"
                  />
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-600">
                    질문하기
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * 영업일 기준 24시간 내 답변을 드립니다
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
