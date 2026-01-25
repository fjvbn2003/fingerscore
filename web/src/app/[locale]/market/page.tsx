"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Filter,
  Grid3X3,
  List,
  Plus,
  Tag,
  Eye,
  ChevronDown,
  Package,
  Shield,
  Star,
  Camera,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data - 상품 목록
const products = [
  {
    id: 1,
    title: "버터플라이 티모볼 ALC 블레이드",
    category: "blade",
    condition: "A",
    price: 180000,
    originalPrice: 250000,
    images: ["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400"],
    location: "서울 강남구",
    createdAt: "3시간 전",
    views: 156,
    likes: 23,
    isSold: false,
    isReserved: false,
    seller: {
      name: "탁구왕김씨",
      rating: 4.9,
      trades: 32,
      verified: true,
    },
    description: "6개월 사용, 상태 A급. 직거래 선호합니다. 포핸드 측에 약간의 사용감 있으나 성능엔 문제없습니다.",
    tags: ["버터플라이", "블레이드", "공격형"],
  },
  {
    id: 2,
    title: "테너지 05 포핸드 러버 (새상품)",
    category: "rubber",
    condition: "S",
    price: 45000,
    originalPrice: 65000,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    location: "경기 성남시",
    createdAt: "5시간 전",
    views: 234,
    likes: 45,
    isSold: false,
    isReserved: true,
    seller: {
      name: "러버매니아",
      rating: 4.8,
      trades: 58,
      verified: true,
    },
    description: "잘못 주문해서 판매합니다. 미개봉 새상품입니다. MAX 두께입니다.",
    tags: ["테너지", "러버", "포핸드"],
  },
  {
    id: 3,
    title: "스티가 올라운드 입문용 라켓 세트",
    category: "racket",
    condition: "B",
    price: 35000,
    originalPrice: 80000,
    images: ["https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400"],
    location: "서울 마포구",
    createdAt: "1일 전",
    views: 89,
    likes: 12,
    isSold: false,
    isReserved: false,
    seller: {
      name: "초보탈출",
      rating: 4.5,
      trades: 8,
      verified: false,
    },
    description: "입문용으로 사용했던 라켓입니다. 중급으로 넘어가면서 판매해요. 케이스 포함입니다.",
    tags: ["스티가", "입문용", "세트"],
  },
  {
    id: 4,
    title: "탁구공 3스타 100개 (니타쿠)",
    category: "ball",
    condition: "A",
    price: 25000,
    originalPrice: 50000,
    images: ["https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400"],
    location: "인천 남동구",
    createdAt: "2일 전",
    views: 312,
    likes: 67,
    isSold: true,
    isReserved: false,
    seller: {
      name: "탁구장사장",
      rating: 5.0,
      trades: 124,
      verified: true,
    },
    description: "탁구장 운영하다가 남은 공입니다. 상태 좋은 것만 골라서 드려요.",
    tags: ["니타쿠", "3스타", "연습공"],
  },
  {
    id: 5,
    title: "버터플라이 라켓 케이스 (새상품)",
    category: "accessories",
    condition: "S",
    price: 15000,
    originalPrice: 25000,
    images: ["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400"],
    location: "서울 송파구",
    createdAt: "3일 전",
    views: 67,
    likes: 8,
    isSold: false,
    isReserved: false,
    seller: {
      name: "정리왕",
      rating: 4.7,
      trades: 15,
      verified: true,
    },
    description: "선물받았는데 안 쓰게 되어서 판매합니다. 미개봉입니다.",
    tags: ["버터플라이", "케이스", "악세서리"],
  },
];

// 카테고리
const categories = [
  { value: "all", label: "전체", icon: "📦" },
  { value: "blade", label: "블레이드", icon: "🏓" },
  { value: "rubber", label: "러버", icon: "⚫" },
  { value: "racket", label: "완성 라켓", icon: "🎾" },
  { value: "ball", label: "공", icon: "⚪" },
  { value: "accessories", label: "악세서리", icon: "🎒" },
];

// 상태 배지
function ConditionBadge({ condition }: { condition: string }) {
  const config: Record<string, { label: string; className: string }> = {
    S: { label: "새상품", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    A: { label: "A급", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    B: { label: "B급", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    C: { label: "C급", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  };
  const { label, className } = config[condition] || config.A;
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-orange-500/30 bg-orange-500/10">
              <Tag className="w-3 h-3 mr-1" />
              중고 장터
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">탁구 장비</span> 중고 거래
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              검증된 동호인들과 안전하게 장비를 거래하세요
            </p>

            {/* 검색 */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="찾는 장비를 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-white/10"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <Plus className="h-4 w-4" />
                    판매하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-lg">
                  <DialogHeader>
                    <DialogTitle>장비 판매하기</DialogTitle>
                    <DialogDescription>
                      판매할 장비의 정보를 입력해주세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">제목</label>
                      <Input
                        placeholder="브랜드명과 상품명을 포함해주세요"
                        className="bg-card/50 border-white/10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">카테고리</label>
                        <Select>
                          <SelectTrigger className="bg-card/50 border-white/10">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">상태</label>
                        <Select>
                          <SelectTrigger className="bg-card/50 border-white/10">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">새상품</SelectItem>
                            <SelectItem value="A">A급 (거의 새것)</SelectItem>
                            <SelectItem value="B">B급 (사용감 있음)</SelectItem>
                            <SelectItem value="C">C급 (많이 사용함)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">판매가</label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-card/50 border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">정가 (선택)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-card/50 border-white/10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">상품 설명</label>
                      <Textarea
                        placeholder="상품 상태, 사용 기간, 거래 방법 등을 자세히 적어주세요"
                        className="bg-card/50 border-white/10 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">사진 (최대 5장)</label>
                      <div className="grid grid-cols-5 gap-2">
                        <button className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </button>
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg bg-card/30 border border-white/10"
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">거래 지역</label>
                      <Input
                        placeholder="예: 서울 강남구"
                        className="bg-card/50 border-white/10"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500">
                      등록하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* 카테고리 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.value
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "bg-card/50 border border-white/10 hover:bg-card"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* 필터 & 정렬 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length}개의 상품
          </p>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] bg-card/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">최신순</SelectItem>
                <SelectItem value="price_low">낮은 가격순</SelectItem>
                <SelectItem value="price_high">높은 가격순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`glass-card overflow-hidden group ${product.isSold ? "opacity-60" : ""}`}>
              <div className="relative">
                <div
                  className={`${viewMode === "grid" ? "aspect-[4/3]" : "aspect-[3/1]"} bg-cover bg-center`}
                  style={{ backgroundImage: `url(${product.images[0]})` }}
                >
                  {/* 오버레이 */}
                  {(product.isSold || product.isReserved) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className={product.isSold ? "bg-gray-500" : "bg-emerald-500"}>
                        {product.isSold ? "판매완료" : "예약중"}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <ConditionBadge condition={product.condition} />
                </div>
                <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold">
                    {product.price.toLocaleString()}원
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {product.createdAt}
                  </span>
                </div>

                {/* 판매자 정보 */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                        {product.seller.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{product.seller.name}</span>
                    {product.seller.verified && (
                      <Shield className="h-3 w-3 text-emerald-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {product.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {product.likes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 거래 안전 팁 */}
        <Card className="mt-12 glass-card border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">안전 거래 가이드</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">1</div>
                    <p>직거래 시 공공장소에서 만나세요</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">2</div>
                    <p>상품을 직접 확인 후 결제하세요</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">3</div>
                    <p>선입금을 요구하면 주의하세요</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">4</div>
                    <p>거래 내역을 캡처해 보관하세요</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 인기 검색어 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">인기 검색어</h3>
          <div className="flex flex-wrap gap-2">
            {["버터플라이", "테너지", "티모볼", "장인성", "마롱", "블레이드", "러버", "입문용"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
