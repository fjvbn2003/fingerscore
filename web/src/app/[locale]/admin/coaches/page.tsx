"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Calendar,
  Users,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Loader2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoaches } from "@/hooks/admin/use-coaches";

export default function AdminCoachesPage() {
  const t = useTranslations("admin");
  const {
    coaches,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    toggleActive,
    removeCoach,
  } = useCoaches();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleStatusFilter = (value: string) => {
    if (value === "all") {
      setFilters({ ...filters, is_active: undefined });
    } else {
      setFilters({ ...filters, is_active: value === "active" });
    }
  };

  const handleToggleActive = async (coachId: string) => {
    const result = await toggleActive(coachId);
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleRemoveCoach = async (coachId: string) => {
    if (window.confirm("정말로 이 코치를 삭제하시겠습니까?")) {
      const result = await removeCoach(coachId);
      if (!result.success) {
        console.error(result.error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">코치 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-purple-500" />
            코치 관리
          </h1>
          <p className="text-muted-foreground">클럽 소속 코치를 관리합니다</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0">
          <Plus className="mr-2 h-4 w-4" />
          코치 등록
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 코치
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}명</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              활동 중
            </CardTitle>
            <Power className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}명
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 레슨
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessons}건</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              평균 평점
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="코치 이름, 이메일 검색..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              defaultValue="all"
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활동 중</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coach List */}
      {coaches.length === 0 ? (
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="py-16">
            <div className="text-center">
              <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold">등록된 코치가 없습니다</h3>
              <p className="mt-2 text-muted-foreground">
                새 코치를 등록하여 레슨 관리를 시작하세요
              </p>
              <Button className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                코치 등록
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <Card
              key={coach.id}
              className="glass-card border-border dark:border-white/5 hover-lift"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={coach.profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-semibold">
                        {coach.profile?.display_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {coach.profile?.display_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {coach.profile?.email}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          coach.is_active
                            ? "mt-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "mt-2 border-border bg-muted text-muted-foreground"
                        }
                      >
                        {coach.is_active ? "활동 중" : "비활성"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        정보 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        스케줄 관리
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleActive(coach.id)}>
                        {coach.is_active ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            비활성화
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            활성화
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveCoach(coach.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{coach.total_lessons}</div>
                    <div className="text-xs text-muted-foreground">총 레슨</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{coach.total_students}</div>
                    <div className="text-xs text-muted-foreground">수강생</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      {coach.average_rating ? coach.average_rating.toFixed(1) : "-"}
                      {coach.average_rating && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">평점</div>
                  </div>
                </div>

                {/* Specialties */}
                {coach.specialties && coach.specialties.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">전문 분야</p>
                    <div className="flex flex-wrap gap-1">
                      {coach.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hourly Rate */}
                {coach.hourly_rate && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    시간당 ₩{coach.hourly_rate.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
