"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Star,
  ExternalLink,
  TrendingUp,
  Zap,
  Target,
  Award,
  ShoppingCart,
  Bookmark,
  ChevronRight,
  Store,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Types
interface RubberSpecs {
  speed: number;
  spin: number;
  control: number;
}

interface BladeSpecs {
  speed: number;
  control: number;
}

interface Equipment {
  id: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  specs: RubberSpecs | BladeSpecs;
  expertOpinion: string;
  shopUrl: string;
}

// 유명 탁구 용품 사이트
const equipmentShops = [
  {
    id: "1",
    name: "탁구인",
    description: "국내 최대 탁구 용품 전문몰",
    url: "https://www.takguin.co.kr",
    logo: "🏓",
    features: ["정품 보장", "빠른 배송", "A/S 지원"],
    highlight: true,
  },
  {
    id: "2",
    name: "탁구사랑",
    description: "다양한 브랜드 취급",
    url: "https://www.taksarang.com",
    logo: "❤️",
    features: ["가격 비교", "리뷰 다수", "회원 할인"],
    highlight: false,
  },
  {
    id: "3",
    name: "TableTennisDB",
    description: "글로벌 탁구 장비 데이터베이스",
    url: "https://www.tabletennisdb.com",
    logo: "🌍",
    features: ["장비 비교", "스펙 분석", "글로벌 리뷰"],
    highlight: false,
  },
  {
    id: "4",
    name: "버터플라이 코리아",
    description: "버터플라이 공식 스토어",
    url: "https://www.butterflykorea.co.kr",
    logo: "🦋",
    features: ["공식 정품", "신제품 우선", "AS 센터"],
    highlight: false,
  },
  {
    id: "5",
    name: "쿠팡 탁구용품",
    description: "로켓배송 탁구 용품",
    url: "https://www.coupang.com/np/search?q=탁구",
    logo: "🚀",
    features: ["로켓배송", "무료반품", "최저가"],
    highlight: false,
  },
];

// Mock 장비 데이터
const mockRubbers: Equipment[] = [
  {
    id: "1",
    name: "테너지 05",
    brand: "버터플라이",
    type: "러버",
    category: "공격형",
    price: 85000,
    rating: 4.9,
    reviewCount: 423,
    tags: ["스핀", "올라운드", "상급자추천"],
    specs: { speed: 92, spin: 95, control: 80 },
    expertOpinion: "세계 최고 수준의 스핀 러버. 상급자에게 강력 추천!",
    shopUrl: "https://www.takguin.co.kr/product/search.html?banner_action=&keyword=테너지+05",
  },
  {
    id: "2",
    name: "라잔터 R48",
    brand: "안드로",
    type: "러버",
    category: "공격형",
    price: 55000,
    rating: 4.7,
    reviewCount: 287,
    tags: ["가성비", "스피드", "중급자추천"],
    specs: { speed: 88, spin: 85, control: 85 },
    expertOpinion: "가성비 최고의 독일 러버. 중급자 입문용으로 추천!",
    shopUrl: "https://www.takguin.co.kr/product/search.html?banner_action=&keyword=라잔터",
  },
  {
    id: "3",
    name: "마크V",
    brand: "야사카",
    type: "러버",
    category: "올라운드",
    price: 32000,
    rating: 4.5,
    reviewCount: 512,
    tags: ["초보추천", "컨트롤", "클래식"],
    specs: { speed: 75, spin: 78, control: 92 },
    expertOpinion: "40년 역사의 클래식 러버. 기본기 연습에 최고!",
    shopUrl: "https://www.takguin.co.kr/product/search.html?banner_action=&keyword=마크V",
  },
];

const mockBlades: Equipment[] = [
  {
    id: "b1",
    name: "비스카리아",
    brand: "버터플라이",
    type: "블레이드",
    category: "공격형",
    price: 280000,
    rating: 4.9,
    reviewCount: 312,
    tags: ["ALC", "장첸", "상급자"],
    specs: { speed: 95, control: 75 },
    expertOpinion: "장지커의 선택. 파워와 안정성의 완벽한 조화!",
    shopUrl: "https://www.takguin.co.kr/product/search.html?banner_action=&keyword=비스카리아",
  },
  {
    id: "b2",
    name: "코르벨",
    brand: "버터플라이",
    type: "블레이드",
    category: "올라운드",
    price: 85000,
    rating: 4.6,
    reviewCount: 456,
    tags: ["순목", "초중급추천", "클래식"],
    specs: { speed: 78, control: 90 },
    expertOpinion: "입문용 순목 블레이드의 대명사. 기본기 완성에 최적!",
    shopUrl: "https://www.takguin.co.kr/product/search.html?banner_action=&keyword=코르벨",
  },
];

// 초보자 추천 조합
const recommendedCombos = [
  {
    title: "🌱 왕초보 입문 세트",
    desc: "기본기 연습에 최적화된 조합",
    blade: "코르벨",
    forehand: "마크V",
    backhand: "마크V",
    totalPrice: 149000,
    level: "초보",
  },
  {
    title: "🌿 중급 도약 세트",
    desc: "실력 향상을 위한 업그레이드",
    blade: "코르벨 SK7",
    forehand: "라잔터 R48",
    backhand: "라잔터 R42",
    totalPrice: 205000,
    level: "중급",
  },
  {
    title: "🔥 공격형 세트",
    desc: "드라이브 위주 플레이어용",
    blade: "비스카리아",
    forehand: "테너지 05",
    backhand: "테너지 80",
    totalPrice: 450000,
    level: "상급",
  },
];

export default function EquipmentPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const allEquipment = [...mockRubbers, ...mockBlades];

  const filteredEquipment = allEquipment.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: string) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 mb-6">
              <ShoppingCart className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">장비 가이드</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              🏓 탁구 <span className="gradient-text">장비 가이드</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              초보부터 상급자까지, 나에게 맞는 장비를 찾아보세요!
              <br className="hidden sm:block" />
              전문가 리뷰와 실제 사용자 후기를 한눈에 비교할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <Tabs defaultValue="shops" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
            <TabsTrigger value="shops">🛒 구매처</TabsTrigger>
            <TabsTrigger value="guide">🎯 추천 조합</TabsTrigger>
            <TabsTrigger value="search">🔍 장비 검색</TabsTrigger>
            <TabsTrigger value="compare">⚖️ 비교</TabsTrigger>
          </TabsList>

          {/* 구매처 탭 */}
          <TabsContent value="shops" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-2">신뢰할 수 있는 탁구 용품점</h2>
              <p className="text-sm text-muted-foreground">
                정품 보장, 빠른 배송, A/S까지 검증된 쇼핑몰을 추천합니다.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentShops.map((shop) => (
                <a
                  key={shop.id}
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className={`glass-card border-white/5 h-full hover-lift transition-all ${
                    shop.highlight ? 'ring-2 ring-emerald-500/50' : ''
                  }`}>
                    {shop.highlight && (
                      <div className="absolute -top-3 left-4">
                        <Badge className="bg-emerald-500 text-white">추천</Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{shop.logo}</div>
                        <div className="flex-1">
                          <h3 className="font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                            {shop.name}
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{shop.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {shop.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>

            <Card className="glass-card border-white/5">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-semibold mb-2">해외 직구도 고려해보세요</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  일본, 중국, 유럽에서 직구하면 더 저렴하게 구매할 수 있어요.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild variant="outline" size="sm" className="border-white/10">
                    <a href="https://www.tabletennisdb.com" target="_blank" rel="noopener noreferrer">
                      TableTennisDB
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-white/10">
                    <a href="https://www.tabletennis11.com" target="_blank" rel="noopener noreferrer">
                      TT11 (유럽)
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 추천 조합 탭 */}
          <TabsContent value="guide" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {recommendedCombos.map((combo, i) => (
                <Card key={i} className="glass-card border-white/5 hover-lift">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{combo.title}</CardTitle>
                      <Badge className={
                        combo.level === "초보" ? "bg-green-500" :
                        combo.level === "중급" ? "bg-blue-500" : "bg-purple-500"
                      }>
                        {combo.level}
                      </Badge>
                    </div>
                    <CardDescription>{combo.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-sm text-muted-foreground">블레이드</span>
                        <span className="font-medium">{combo.blade}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-sm text-muted-foreground">포핸드</span>
                        <span className="font-medium">{combo.forehand}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-sm text-muted-foreground">백핸드</span>
                        <span className="font-medium">{combo.backhand}</span>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">예상 가격</span>
                          <span className="text-lg font-bold text-emerald-400">
                            ₩{combo.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
                    >
                      <a
                        href={`https://www.takguin.co.kr/product/search.html?keyword=${encodeURIComponent(combo.blade)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Store className="h-4 w-4 mr-2" />
                        구매처 보기
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 레벨별 가이드 */}
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle>📚 레벨별 장비 선택 가이드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h4 className="font-bold text-green-400 mb-2">🌱 초보자 (1~6개월)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    컨트롤 위주의 순목 블레이드 + 부드러운 러버를 추천합니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">컨트롤 90+</Badge>
                    <Badge variant="outline">순목 5겹</Badge>
                    <Badge variant="outline">중~중연 러버</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-bold text-blue-400 mb-2">🌿 중급자 (6개월~2년)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    어느 정도 스핀과 스피드를 낼 수 있는 조합으로 업그레이드합니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">스피드 80+</Badge>
                    <Badge variant="outline">카본 or 7겹</Badge>
                    <Badge variant="outline">텐션 러버</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-bold text-purple-400 mb-2">🔥 상급자 (2년+)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    자신의 플레이 스타일에 맞는 고급 장비를 선택합니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">ALC/ZLC 소재</Badge>
                    <Badge variant="outline">하이텐션 러버</Badge>
                    <Badge variant="outline">전형별 최적화</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 장비 검색 탭 */}
          <TabsContent value="search" className="space-y-6">
            {/* Search */}
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="장비명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="glass-card border-white/5 overflow-hidden group hover-lift">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 relative flex items-center justify-center">
                      <span className="text-5xl">{item.type === "러버" ? "🔴" : "🪵"}</span>
                      <Badge className="absolute top-3 left-3 bg-black/50">
                        {item.brand}
                      </Badge>
                      <button
                        onClick={() => toggleSave(item.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50"
                      >
                        <Bookmark className={`h-4 w-4 ${savedItems.includes(item.id) ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                      </button>
                    </div>

                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold">{item.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">({item.reviewCount})</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Specs */}
                      <div className="space-y-2 mb-3">
                        {"speed" in item.specs && (
                          <div className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-red-400" />
                            <span className="text-xs w-12">스피드</span>
                            <Progress value={item.specs.speed} className="h-1.5 flex-1" />
                            <span className="text-xs w-8">{item.specs.speed}</span>
                          </div>
                        )}
                        {"spin" in item.specs && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-blue-400" />
                            <span className="text-xs w-12">스핀</span>
                            <Progress value={item.specs.spin} className="h-1.5 flex-1" />
                            <span className="text-xs w-8">{item.specs.spin}</span>
                          </div>
                        )}
                        {"control" in item.specs && (
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-green-400" />
                            <span className="text-xs w-12">컨트롤</span>
                            <Progress value={item.specs.control} className="h-1.5 flex-1" />
                            <span className="text-xs w-8">{item.specs.control}</span>
                          </div>
                        )}
                      </div>

                      {/* Expert Opinion */}
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Award className="h-3 w-3 text-amber-400" />
                          <span className="text-xs font-medium text-amber-400">전문가 의견</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.expertOpinion}</p>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-400">
                          ₩{item.price.toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          asChild
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <a href={item.shopUrl} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            구매
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 비교하기 탭 */}
          <TabsContent value="compare" className="space-y-6">
            <Card className="glass-card border-white/5">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-xl font-bold mb-2">장비 비교 기능</h3>
                <p className="text-muted-foreground mb-4">
                  최대 3개의 장비를 선택해서 스펙을 비교해보세요!
                </p>
                <p className="text-sm text-muted-foreground">
                  장비 검색에서 <Bookmark className="inline h-4 w-4 mx-1" /> 아이콘을 눌러 저장하면
                  <br />
                  이곳에서 비교할 수 있습니다.
                </p>
                {savedItems.length > 0 && (
                  <div className="mt-4">
                    <Badge variant="secondary">{savedItems.length}개 저장됨</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="glass-card border-white/5 mt-8">
          <CardHeader>
            <CardTitle>❓ 자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-medium mb-2">Q. 초보자는 어떤 라켓을 사야 하나요?</h4>
              <p className="text-sm text-muted-foreground">
                A. 순목 5겹 블레이드(코르벨 등) + 컨트롤 좋은 러버(마크V 등)로 시작하시는 걸 추천드립니다.
                레슨을 받으신다면 코치님과 상담 후 구매하세요!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-medium mb-2">Q. 러버는 얼마나 자주 교체해야 하나요?</h4>
              <p className="text-sm text-muted-foreground">
                A. 주 2-3회 치신다면 3-6개월, 매일 치신다면 1-2개월 주기로 교체를 권장합니다.
                러버 표면이 미끄러워지면 교체 시기입니다.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-medium mb-2">Q. 장비빨이 중요한가요?</h4>
              <p className="text-sm text-muted-foreground">
                A. 기본기가 없으면 아무리 좋은 장비도 무용지물입니다.
                실력에 맞는 장비를 사용하고, 레슨과 연습으로 실력을 키우는 게 먼저입니다!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
