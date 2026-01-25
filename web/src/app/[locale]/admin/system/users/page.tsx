"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldX,
  UserCog,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building,
  Calendar,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import { useAllUsers, type UserRole } from "@/hooks/admin/use-all-users";

const roleColors: Record<UserRole, string> = {
  USER: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  ORGANIZER: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  CLUB_OWNER: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  ADMIN: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
};

const roleLabels: Record<UserRole, string> = {
  USER: "일반 사용자",
  ORGANIZER: "주최자",
  CLUB_OWNER: "클럽 관장",
  ADMIN: "시스템 관리자",
};

export default function SystemUsersPage() {
  const {
    users,
    stats,
    isLoading,
    filters,
    setFilters,
    updateUserRole,
    toggleVerified,
    deleteUser,
    page,
    setPage,
    totalPages,
  } = useAllUsers();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleRoleFilter = (value: string) => {
    if (value === "all") {
      setFilters({ ...filters, role: undefined });
    } else {
      setFilters({ ...filters, role: value as UserRole });
    }
  };

  const handleVerifiedFilter = (value: string) => {
    if (value === "all") {
      setFilters({ ...filters, is_verified: undefined });
    } else {
      setFilters({ ...filters, is_verified: value === "verified" });
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const result = await updateUserRole(userId, newRole);
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleToggleVerified = async (userId: string) => {
    const result = await toggleVerified(userId);
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const result = await deleteUser(userId);
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
          <p className="mt-4 text-sm text-muted-foreground">사용자 목록 로딩 중...</p>
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
            <Users className="h-7 w-7 text-blue-500" />
            전체 사용자 관리
          </h1>
          <p className="text-muted-foreground">플랫폼 전체 사용자를 관리합니다</p>
        </div>
        <Badge variant="outline" className="text-sm">
          총 {stats.total}명
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">일반 사용자</p>
                <p className="text-2xl font-bold text-blue-600">{stats.byRole.USER}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">클럽 관장</p>
                <p className="text-2xl font-bold text-amber-600">{stats.byRole.CLUB_OWNER}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border dark:border-white/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">인증됨</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.verified}</p>
              </div>
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
                placeholder="이름, 이메일, 전화번호 검색..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all" onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="역할 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 역할</SelectItem>
                <SelectItem value="USER">일반 사용자</SelectItem>
                <SelectItem value="ORGANIZER">주최자</SelectItem>
                <SelectItem value="CLUB_OWNER">클럽 관장</SelectItem>
                <SelectItem value="ADMIN">시스템 관리자</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Users Table */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>인증</TableHead>
                <TableHead>클럽</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
                    <p className="mt-4 text-muted-foreground">
                      검색 결과가 없습니다
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                            {user.display_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.display_name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_verified ? (
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {user.clubs_owned > 0 && (
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {user.clubs_owned}
                          </span>
                        )}
                        {user.clubs_member_of > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {user.clubs_member_of}
                          </span>
                        )}
                        {user.clubs_owned === 0 && user.clubs_member_of === 0 && "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <UserCog className="mr-2 h-4 w-4" />
                              역할 변경
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  onClick={() => handleRoleChange(user.id, role)}
                                  disabled={user.role === role}
                                >
                                  {roleLabels[role]}
                                  {user.role === role && " (현재)"}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => handleToggleVerified(user.id)}>
                            {user.is_verified ? (
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
                            onClick={() => handleDeleteUser(user.id)}
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
