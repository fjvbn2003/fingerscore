"use client";

import { useState } from "react";
import {
  Building,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldX,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllClubs } from "@/hooks/admin/use-all-clubs";

export default function SystemClubsPage() {
  const {
    clubs,
    stats,
    isLoading,
    filters,
    setFilters,
    toggleVerified,
    deleteClub,
    page,
    setPage,
    totalPages,
  } = useAllClubs();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleVerifiedFilter = (value: string) => {
    if (value === "all") {
      setFilters({ ...filters, is_verified: undefined });
    } else {
      setFilters({ ...filters, is_verified: value === "verified" });
    }
  };

  const handleToggleVerified = async (clubId: string) => {
    const result = await toggleVerified(clubId);
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    if (window.confirm("정말로 이 클럽을 삭제하시겠습니까? 모든 관련 데이터가 삭제됩니다.")) {
      const result = await deleteClub(clubId);
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
          <p className="mt-4 text-sm text-muted-foreground">클럽 목록 로딩 중...</p>
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
            <Building className="h-7 w-7 text-purple-500" />
            전체 클럽 관리
          </h1>
          <p className="text-muted-foreground">플랫폼 전체 클럽을 관리합니다</p>
        </div>
        <Badge variant="outline" className="text-sm">
          총 {stats.total}개
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 클럽</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">인증 클럽</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.verified}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 회원</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">이번 달 신규</p>
                <p className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500/30" />
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
                placeholder="클럽 이름, 지역, 관장 이름 검색..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all" onValueChange={handleVerifiedFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Shield className="mr-2 h-4 w-4" />
                <SelectValue placeholder="인증 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="verified">인증됨</SelectItem>
                <SelectItem value="unverified">미인증</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clubs Table */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>클럽</TableHead>
                <TableHead>관장</TableHead>
                <TableHead>인증</TableHead>
                <TableHead>회원</TableHead>
                <TableHead>레슨</TableHead>
                <TableHead>매출</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <Building className="mx-auto h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">
                      검색 결과가 없습니다
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                clubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage src={club.logo_url || ""} />
                          <AvatarFallback className="rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                            {club.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{club.name}</p>
                          {club.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {club.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={club.owner?.avatar_url || ""} />
                          <AvatarFallback className="text-xs">
                            {club.owner?.display_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{club.owner?.display_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {club.is_verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          인증됨
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <ShieldX className="mr-1 h-3 w-3" />
                          미인증
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {club.member_count}명
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {club.total_lessons}건
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        ₩{(club.total_revenue / 10000).toFixed(0)}만
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleVerified(club.id)}>
                            {club.is_verified ? (
                              <>
                                <ShieldX className="mr-2 h-4 w-4" />
                                인증 취소
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                인증하기
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClub(club.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                페이지 {page} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
