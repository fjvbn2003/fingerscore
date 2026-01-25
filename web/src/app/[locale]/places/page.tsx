"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Search,
  Star,
  Clock,
  Phone,
  Users,
  Filter,
  ChevronDown,
  Navigation,
  Heart,
  MessageCircle,
  Sparkles,
  Award,
  DollarSign,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock 탁구장 데이터
const mockPlaces = [
  {
    id: "1",
    name: "강남 탁구클럽",
    type: "탁구장",
    address: "서울 강남구 테헤란로 123",
    distance: "1.2km",
    rating: 4.8,
    reviewCount: 156,
    memberCount: 89,
    images: ["/placeholder.jpg"],
    tags: ["레슨가능", "주차가능", "샤워실"],
    priceRange: "월 8만원~",
    lessonPrice: "1회 3만원",
    openHours: "06:00 - 24:00",
    phone: "02-1234-5678",
    isOpen: true,
    features: {
      tables: 12,
      hasLesson: true,
      hasParking: true,
      hasShower: true,
      hasLocker: true,
    },
    coaches: [
      { name: "김코치", level: "전 국가대표", rating: 4.9 },
      { name: "이코치", level: "생활체육 1급", rating: 4.7 },
    ],
    recentReviews: [
      { user: "탁구왕", rating: 5, text: "시설 깔끔하고 코치님이 친절해요!", date: "2일 전" },
      { user: "초보탁구", rating: 4, text: "레슨 받기 좋아요", date: "1주 전" },
    ],
  },
  {
    id: "2",
    name: "역삼동 탁구동호회",
    type: "동호회",
    address: "서울 강남구 역삼로 456",
    distance: "2.1km",
    rating: 4.6,
    reviewCount: 89,
    memberCount: 45,
    images: ["/placeholder.jpg"],
    tags: ["친목위주", "초보환영", "주말모임"],
    priceRange: "월 3만원",
    lessonPrice: null,
    openHours: "평일 19:00-22:00, 주말 14:00-18:00",
    phone: "010-1234-5678",
    isOpen: false,
    features: {
      tables: 6,
      hasLesson: false,
      hasParking: true,
      hasShower: false,
      hasLocker: true,
    },
    coaches: [],
    recentReviews: [
      { user: "동호인", rating: 5, text: "분위기 좋고 다들 친절해요", date: "3일 전" },
    ],
  },
  {
    id: "3",
    name: "서초 프로탁구센터",
    type: "탁구장",
    address: "서울 서초구 서초대로 789",
    distance: "3.5km",
    rating: 4.9,
    reviewCount: 234,
    memberCount: 156,
    images: ["/placeholder.jpg"],
    tags: ["전문레슨", "대회준비", "선수반"],
    priceRange: "월 12만원~",
    lessonPrice: "1회 5만원",
    openHours: "05:00 - 23:00",
    phone: "02-9876-5432",
    isOpen: true,
    features: {
      tables: 20,
      hasLesson: true,
      hasParking: true,
      hasShower: true,
      hasLocker: true,
    },
    coaches: [
      { name: "박코치", level: "전 실업팀", rating: 5.0 },
      { name: "최코치", level: "전 국가대표", rating: 4.9 },
      { name: "정코치", level: "생활체육 특급", rating: 4.8 },
    ],
    recentReviews: [
      { user: "대회준비생", rating: 5, text: "진짜 실력이 늘어요! 강추!", date: "1일 전" },
    ],
  },
  {
    id: "4",
    name: "송파 여성탁구클럽",
    type: "동호회",
    address: "서울 송파구 올림픽로 321",
    distance: "5.2km",
    rating: 4.7,
    reviewCount: 67,
    memberCount: 38,
    images: ["/placeholder.jpg"],
    tags: ["여성전용", "초보환영", "주2회모임"],
    priceRange: "월 5만원",
    lessonPrice: "1회 2만원",
    openHours: "화/목 10:00-13:00",
    phone: "010-5555-1234",
    isOpen: false,
    features: {
      tables: 4,
      hasLesson: true,
      hasParking: false,
      hasShower: false,
      hasLocker: false,
    },
    coaches: [
      { name: "김코치", level: "생활체육 2급", rating: 4.6 },
    ],
    recentReviews: [
      { user: "탁구맘", rating: 5, text: "엄마들끼리 즐겁게 운동해요", date: "5일 전" },
    ],
  },
];

const regions = [
  "전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종",
  "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

const placeTypes = ["전체", "탁구장", "동호회"];

const sortOptions = [
  { value: "distance", label: "거리순" },
  { value: "rating", label: "평점순" },
  { value: "review", label: "리뷰 많은순" },
  { value: "member", label: "회원 많은순" },
];

export default function PlacesPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedType, setSelectedType] = useState("전체");
  const [sortBy, setSortBy] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredPlaces = mockPlaces.filter(place => {
    if (selectedType !== "전체" && place.type !== selectedType) return false;
    if (searchQuery && !place.name.includes(searchQuery) && !place.address.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          🏓 내 주변 탁구장 찾기
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          전국 500개+ 탁구장과 동호회 정보를 한눈에!
          <br className="hidden md:block" />
          레슨, 시설, 분위기까지 실제 이용자 리뷰로 확인하세요.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <Card className="glass-card border-white/5 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="탁구장 이름이나 지역으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Region Select */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-32 bg-background/50">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Select */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-32 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {placeTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-36 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              필터
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">레슨가능</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">주차가능</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">샤워실</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">초보환영</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">여성전용</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">24시간</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-white/10">대회준비</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{filteredPlaces.length}</span>개의 결과
        </p>
        <Button variant="ghost" size="sm" className="text-emerald-400">
          <Navigation className="h-4 w-4 mr-1" />
          내 위치 기준
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="glass-card border-white/5 overflow-hidden group hover-lift">
            <CardContent className="p-0">
              {/* Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">🏓</span>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={place.type === "탁구장" ? "bg-emerald-500" : "bg-blue-500"}>
                    {place.type}
                  </Badge>
                  {place.isOpen && (
                    <Badge className="bg-green-500">영업중</Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(place.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${favorites.includes(place.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {place.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{place.rating}</span>
                      <span className="text-sm text-muted-foreground">({place.reviewCount})</span>
                    </div>
                    <p className="text-sm text-emerald-400">{place.distance}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {place.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-white/5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="truncate">{place.openHours.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>회원 {place.memberCount}명</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{place.priceRange}</span>
                  </div>
                  {place.lessonPrice && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Award className="h-4 w-4" />
                      <span>레슨 {place.lessonPrice}</span>
                    </div>
                  )}
                </div>

                {/* Coaches Preview */}
                {place.coaches.length > 0 && (
                  <div className="mb-3 p-2 rounded-lg bg-white/5">
                    <p className="text-xs text-muted-foreground mb-1">코치진</p>
                    <div className="flex flex-wrap gap-2">
                      {place.coaches.slice(0, 2).map((coach, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          <span>{coach.name}</span>
                          <span className="text-xs text-muted-foreground">({coach.level})</span>
                        </div>
                      ))}
                      {place.coaches.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{place.coaches.length - 2}명</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Review Preview */}
                {place.recentReviews[0] && (
                  <div className="p-2 rounded-lg bg-white/5 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-3 w-3 text-blue-400" />
                      <span className="text-xs font-medium">{place.recentReviews[0].user}</span>
                      <div className="flex">
                        {[...Array(place.recentReviews[0].rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      "{place.recentReviews[0].text}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                    상세보기
                  </Button>
                  <Button variant="outline" className="border-white/10" asChild>
                    <a href={`tel:${place.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            다른 검색어나 필터를 시도해보세요
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedRegion("전체");
            setSelectedType("전체");
          }}>
            필터 초기화
          </Button>
        </div>
      )}

      {/* CTA Section */}
      <Card className="glass-card border-white/5 mt-8">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">🏓 내 탁구장을 등록하고 싶으신가요?</h3>
          <p className="text-muted-foreground mb-4">
            무료로 탁구장/동호회를 등록하고 더 많은 회원을 만나보세요!
          </p>
          <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white">
            무료 등록 신청하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
