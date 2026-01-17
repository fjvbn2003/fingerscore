"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Newspaper,
  ExternalLink,
  Eye,
  Clock,
  Star,
  Filter,
  RefreshCw,
  CircleDot,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportType, NewsCategory } from "@/types/database";

// Mock news data
const mockNews = [
  {
    id: "1",
    sport_type: "TABLE_TENNIS" as SportType,
    category: "TOURNAMENT" as NewsCategory,
    title: "2026 세계탁구선수권대회 한국 대표팀 명단 발표",
    summary: "대한탁구협회가 오는 5월 중국에서 열리는 세계탁구선수권대회에 출전할 한국 대표팀 명단을 발표했다. 남자부에는 장우진, 임종훈, 조대성이, 여자부에는 신유빈, 전지희, 이은혜가 선발됐다.",
    source_url: "https://example.com/news/1",
    source_name: "스포츠조선",
    image_url: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800",
    published_at: "2026-01-18T09:00:00",
    is_featured: true,
    view_count: 2450,
  },
  {
    id: "2",
    sport_type: "TENNIS" as SportType,
    category: "PLAYER" as NewsCategory,
    title: "정현, ATP 투어 복귀전에서 8강 진출",
    summary: "부상에서 회복한 정현이 ATP 250 대회에서 8강에 진출하며 성공적인 복귀전을 치렀다. 정현은 2회전에서 세계 랭킹 45위 선수를 꺾고 8강에 올랐다.",
    source_url: "https://example.com/news/2",
    source_name: "테니스코리아",
    image_url: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
    published_at: "2026-01-17T14:30:00",
    is_featured: true,
    view_count: 1820,
  },
  {
    id: "3",
    sport_type: "BADMINTON" as SportType,
    category: "TOURNAMENT" as NewsCategory,
    title: "안세영, 전영오픈 결승 진출... 타이틀 방어 도전",
    summary: "세계 랭킹 1위 안세영이 전영오픈 준결승에서 일본의 야마구치 아카네를 2-0으로 꺾고 결승에 진출했다. 안세영은 대회 2연패에 도전한다.",
    source_url: "https://example.com/news/3",
    source_name: "배드민턴코리아",
    image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
    published_at: "2026-01-17T11:00:00",
    is_featured: true,
    view_count: 3200,
  },
  {
    id: "4",
    sport_type: "TABLE_TENNIS" as SportType,
    category: "EQUIPMENT" as NewsCategory,
    title: "버터플라이, 신형 라켓 '디그닉스 09C' 출시",
    summary: "탁구 장비 전문 브랜드 버터플라이가 새로운 러버 '디그닉스 09C'를 출시했다. 기존 제품 대비 회전력이 15% 향상되었으며, 프로 선수들 사이에서 높은 관심을 받고 있다.",
    source_url: "https://example.com/news/4",
    source_name: "탁구사랑",
    image_url: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800",
    published_at: "2026-01-16T16:00:00",
    is_featured: false,
    view_count: 980,
  },
  {
    id: "5",
    sport_type: "TENNIS" as SportType,
    category: "TECHNIQUE" as NewsCategory,
    title: "서브 속도 향상을 위한 5가지 훈련법",
    summary: "프로 코치들이 추천하는 서브 속도 향상 훈련법을 소개한다. 체중 이동, 토스 위치, 팔의 회전 등 핵심 요소를 분석하고 효과적인 연습 방법을 알아본다.",
    source_url: "https://example.com/news/5",
    source_name: "테니스매거진",
    image_url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800",
    published_at: "2026-01-16T10:00:00",
    is_featured: false,
    view_count: 1540,
  },
  {
    id: "6",
    sport_type: "BADMINTON" as SportType,
    category: "GENERAL" as NewsCategory,
    title: "2026년 배드민턴 국제대회 일정 총정리",
    summary: "BWF가 2026년 국제대회 일정을 확정 발표했다. 올해는 총 45개의 월드투어 대회와 4개의 메이저 대회가 예정되어 있으며, 한국에서는 코리아오픈이 9월에 개최된다.",
    source_url: "https://example.com/news/6",
    source_name: "셔틀콕뉴스",
    image_url: "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=800",
    published_at: "2026-01-15T09:00:00",
    is_featured: false,
    view_count: 2100,
  },
];

const sportConfig: Record<SportType, { color: string; icon: string; label: string }> = {
  TABLE_TENNIS: { color: "bg-orange-500", icon: "🏓", label: "탁구" },
  TENNIS: { color: "bg-green-500", icon: "🎾", label: "테니스" },
  BADMINTON: { color: "bg-blue-500", icon: "🏸", label: "배드민턴" },
};

const categoryConfig: Record<NewsCategory, { color: string; label: string }> = {
  GENERAL: { color: "border-slate-500/30 bg-slate-500/20 text-slate-400", label: "일반" },
  TOURNAMENT: { color: "border-amber-500/30 bg-amber-500/20 text-amber-400", label: "대회" },
  PLAYER: { color: "border-blue-500/30 bg-blue-500/20 text-blue-400", label: "선수" },
  EQUIPMENT: { color: "border-purple-500/30 bg-purple-500/20 text-purple-400", label: "장비" },
  TECHNIQUE: { color: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400", label: "기술" },
};

export default function NewsPage() {
  const t = useTranslations();
  const [selectedSport, setSelectedSport] = useState<SportType | "ALL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredNews = mockNews.filter((news) => {
    const matchesSport = selectedSport === "ALL" || news.sport_type === selectedSport;
    const matchesCategory = selectedCategory === "ALL" || news.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.filter((news) => news.is_featured);
  const latestNews = filteredNews.filter((news) => !news.is_featured);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "방금 전";
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-blue-400" />
            {t("news.title")}
          </h1>
          <p className="text-slate-400 mt-1">{t("news.description")}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-slate-700 text-slate-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? t("news.refreshing") : "새로고침"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="뉴스 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100"
          />
        </div>
        <Select value={selectedSport} onValueChange={(v) => setSelectedSport(v as SportType | "ALL")}>
          <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-slate-100">
            <SelectValue placeholder={t("sports.selectSport")} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="ALL">{t("sports.allSports")}</SelectItem>
            <SelectItem value="TABLE_TENNIS">🏓 {t("sports.tableTennis")}</SelectItem>
            <SelectItem value="TENNIS">🎾 {t("sports.tennis")}</SelectItem>
            <SelectItem value="BADMINTON">🏸 {t("sports.badminton")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as NewsCategory | "ALL")}>
          <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-700 text-slate-100">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="GENERAL">{t("news.category.GENERAL")}</SelectItem>
            <SelectItem value="TOURNAMENT">{t("news.category.TOURNAMENT")}</SelectItem>
            <SelectItem value="PLAYER">{t("news.category.PLAYER")}</SelectItem>
            <SelectItem value="EQUIPMENT">{t("news.category.EQUIPMENT")}</SelectItem>
            <SelectItem value="TECHNIQUE">{t("news.category.TECHNIQUE")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            {t("news.featured")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {featuredNews.map((news) => (
              <a
                key={news.id}
                href={news.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl overflow-hidden bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={news.image_url || "/placeholder.jpg"}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={sportConfig[news.sport_type].color + " text-white"}>
                      {sportConfig[news.sport_type].icon} {sportConfig[news.sport_type].label}
                    </Badge>
                  </div>
                  <Badge className={`absolute top-3 right-3 ${categoryConfig[news.category].color}`}>
                    {categoryConfig[news.category].label}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{news.summary}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(news.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {news.view_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Latest News */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <CircleDot className="h-5 w-5 text-emerald-400" />
          {t("news.latest")}
        </h2>
        {latestNews.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <Newspaper className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{t("news.noNews")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestNews.map((news) => (
              <a
                key={news.id}
                href={news.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/50 transition-all"
              >
                {news.image_url && (
                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={sportConfig[news.sport_type].color + " text-white text-xs"}>
                      {sportConfig[news.sport_type].icon}
                    </Badge>
                    <Badge className={`text-xs ${categoryConfig[news.category].color}`}>
                      {categoryConfig[news.category].label}
                    </Badge>
                    <span className="text-xs text-slate-500">{news.source_name}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{news.summary}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(news.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {news.view_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3" />
                      {t("news.readMore")}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* News Sources Info */}
      <div className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/30">
        <h3 className="text-sm font-medium text-slate-300 mb-3">뉴스 출처</h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div>
            <span className="text-orange-400">🏓 탁구</span>
            <p className="mt-1">대한탁구협회, ITTF, 탁구사랑, 스포츠조선</p>
          </div>
          <div>
            <span className="text-green-400">🎾 테니스</span>
            <p className="mt-1">대한테니스협회, ATP/WTA, 테니스코리아</p>
          </div>
          <div>
            <span className="text-blue-400">🏸 배드민턴</span>
            <p className="mt-1">대한배드민턴협회, BWF, 셔틀콕뉴스</p>
          </div>
        </div>
      </div>
    </div>
  );
}
