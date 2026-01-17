"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Map,
  Search,
  MapPin,
  Users,
  Trophy,
  Star,
  ChevronRight,
  Filter,
  Navigation,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Mock data - 서울 지역 탁구장
const mockClubs = [
  {
    id: "c1",
    name: "서초 탁구클럽",
    address: "서울 서초구 서초대로 123",
    lat: 37.4912,
    lng: 127.0075,
    memberCount: 48,
    avgRating: 1450,
    topRating: 1850,
    distance: 0.5,
    ratingDistribution: { beginners: 8, intermediate: 25, advanced: 12, expert: 3 },
    isMyClub: true,
  },
  {
    id: "c2",
    name: "강남 탁구클럽",
    address: "서울 강남구 테헤란로 456",
    lat: 37.5012,
    lng: 127.0389,
    memberCount: 62,
    avgRating: 1520,
    topRating: 1920,
    distance: 2.3,
    ratingDistribution: { beginners: 10, intermediate: 30, advanced: 18, expert: 4 },
    isMyClub: false,
  },
  {
    id: "c3",
    name: "송파 탁구사랑",
    address: "서울 송파구 올림픽로 789",
    lat: 37.5145,
    lng: 127.1058,
    memberCount: 35,
    avgRating: 1380,
    topRating: 1680,
    distance: 5.1,
    ratingDistribution: { beginners: 12, intermediate: 18, advanced: 5, expert: 0 },
    isMyClub: false,
  },
  {
    id: "c4",
    name: "용산 탁구동호회",
    address: "서울 용산구 이태원로 321",
    lat: 37.5340,
    lng: 126.9945,
    memberCount: 28,
    avgRating: 1420,
    topRating: 1750,
    distance: 4.2,
    ratingDistribution: { beginners: 6, intermediate: 15, advanced: 6, expert: 1 },
    isMyClub: false,
  },
  {
    id: "c5",
    name: "마포 탁구사랑",
    address: "서울 마포구 월드컵북로 654",
    lat: 37.5665,
    lng: 126.9014,
    memberCount: 41,
    avgRating: 1480,
    topRating: 1800,
    distance: 7.8,
    ratingDistribution: { beginners: 8, intermediate: 22, advanced: 9, expert: 2 },
    isMyClub: false,
  },
  {
    id: "c6",
    name: "광진 탁구클럽",
    address: "서울 광진구 능동로 987",
    lat: 37.5478,
    lng: 127.0857,
    memberCount: 33,
    avgRating: 1350,
    topRating: 1620,
    distance: 6.5,
    ratingDistribution: { beginners: 14, intermediate: 15, advanced: 4, expert: 0 },
    isMyClub: false,
  },
];

const ratingRanges = [
  { value: "all", label: "전체 레이팅" },
  { value: "1000-1200", label: "초급 (1000-1200)" },
  { value: "1200-1400", label: "중급 (1200-1400)" },
  { value: "1400-1600", label: "상급 (1400-1600)" },
  { value: "1600+", label: "고수 (1600+)" },
];

export default function ClubMapPage() {
  const t = useTranslations("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState<typeof mockClubs[0] | null>(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [maxDistance, setMaxDistance] = useState([10]);

  const filteredClubs = mockClubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = club.distance <= maxDistance[0];
    let matchesRating = true;
    if (ratingFilter !== "all") {
      if (ratingFilter === "1000-1200") matchesRating = club.avgRating >= 1000 && club.avgRating < 1200;
      else if (ratingFilter === "1200-1400") matchesRating = club.avgRating >= 1200 && club.avgRating < 1400;
      else if (ratingFilter === "1400-1600") matchesRating = club.avgRating >= 1400 && club.avgRating < 1600;
      else if (ratingFilter === "1600+") matchesRating = club.avgRating >= 1600;
    }
    return matchesSearch && matchesDistance && matchesRating;
  });

  return (
    <div className="container max-w-screen-xl py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          주변 탁구장을 찾고 레이팅 분포를 한눈에 확인하세요
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/5 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-white/10">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchLocation")}
                    className="pl-10 glass border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-white/10">
                  <Navigation className="h-4 w-4 mr-2" />
                  현재 위치
                </Button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-[500px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

              {/* Club markers */}
              {filteredClubs.map((club) => {
                // Simple positioning based on mock data (would use actual map library in production)
                const x = ((club.lng - 126.8) / 0.4) * 100;
                const y = ((37.6 - club.lat) / 0.15) * 100;

                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all",
                      selectedClub?.id === club.id && "z-10 scale-125"
                    )}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className={cn(
                        "relative flex flex-col items-center",
                        club.isMyClub && "animate-pulse"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors",
                          club.isMyClub
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                            : selectedClub?.id === club.id
                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        )}
                      >
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      {selectedClub?.id === club.id && (
                        <div className="absolute -bottom-8 whitespace-nowrap rounded-lg bg-background/95 px-2 py-1 text-xs font-medium shadow-lg">
                          {club.name}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 glass-card rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600" />
                  <span>내 구장</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  <span>주변 구장</span>
                </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute top-4 right-4 glass-card rounded-lg p-3 text-xs space-y-1">
                <p className="font-medium">{filteredClubs.length}개 구장</p>
                <p className="text-muted-foreground">
                  총 {filteredClubs.reduce((sum, c) => sum + c.memberCount, 0)}명
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Club List & Filters */}
        <div className="space-y-4">
          {/* Filters */}
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                필터
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t("filterByRating")}</label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {ratingRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  {t("distance")} (최대 {maxDistance[0]}km)
                </label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={20}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Club List */}
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                {t("nearbyClubs")} ({filteredClubs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredClubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left",
                    selectedClub?.id === club.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        club.isMyClub ? "bg-emerald-500/20" : "bg-blue-500/20"
                      )}
                    >
                      <Building2
                        className={cn(
                          "h-5 w-5",
                          club.isMyClub ? "text-emerald-400" : "text-blue-400"
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{club.name}</p>
                        {club.isMyClub && (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                            내 구장
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{club.distance}km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{club.avgRating}</p>
                    <p className="text-xs text-muted-foreground">{club.memberCount}명</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Selected Club Detail */}
          {selectedClub && (
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-amber-400" />
                  {t("clubInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedClub.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {selectedClub.address}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <Users className="h-4 w-4 mx-auto text-blue-400 mb-1" />
                    <p className="text-lg font-bold">{selectedClub.memberCount}</p>
                    <p className="text-xs text-muted-foreground">{t("memberCount")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <Trophy className="h-4 w-4 mx-auto text-amber-400 mb-1" />
                    <p className="text-lg font-bold">{selectedClub.avgRating}</p>
                    <p className="text-xs text-muted-foreground">{t("avgRating")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <Star className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                    <p className="text-lg font-bold">{selectedClub.topRating}</p>
                    <p className="text-xs text-muted-foreground">{t("topRating")}</p>
                  </div>
                </div>

                {/* Rating Distribution Mini Bar */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">레이팅 분포</p>
                  <div className="flex gap-1 h-6 rounded-lg overflow-hidden">
                    <div
                      className="bg-blue-400"
                      style={{
                        width: `${(selectedClub.ratingDistribution.beginners / selectedClub.memberCount) * 100}%`,
                      }}
                      title={`초급: ${selectedClub.ratingDistribution.beginners}명`}
                    />
                    <div
                      className="bg-emerald-400"
                      style={{
                        width: `${(selectedClub.ratingDistribution.intermediate / selectedClub.memberCount) * 100}%`,
                      }}
                      title={`중급: ${selectedClub.ratingDistribution.intermediate}명`}
                    />
                    <div
                      className="bg-amber-400"
                      style={{
                        width: `${(selectedClub.ratingDistribution.advanced / selectedClub.memberCount) * 100}%`,
                      }}
                      title={`상급: ${selectedClub.ratingDistribution.advanced}명`}
                    />
                    <div
                      className="bg-red-400"
                      style={{
                        width: `${(selectedClub.ratingDistribution.expert / selectedClub.memberCount) * 100}%`,
                      }}
                      title={`고수: ${selectedClub.ratingDistribution.expert}명`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>초급 {selectedClub.ratingDistribution.beginners}</span>
                    <span>중급 {selectedClub.ratingDistribution.intermediate}</span>
                    <span>상급 {selectedClub.ratingDistribution.advanced}</span>
                    <span>고수 {selectedClub.ratingDistribution.expert}</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  {t("viewClub")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
