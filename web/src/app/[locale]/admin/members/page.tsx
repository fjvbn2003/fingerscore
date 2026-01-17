"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Filter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MembershipType, MembershipStatus, LessonFrequency } from "@/types/database";

// Mock data
const mockMembers = [
  {
    id: "1",
    name: "김철수",
    phone: "010-1234-5678",
    email: "chulsoo@email.com",
    membership_type: "MONTHLY" as MembershipType,
    membership_status: "ACTIVE" as MembershipStatus,
    lesson_frequency: null as LessonFrequency | null,
    sessions_per_month: 0,
    sessions_used: 0,
    monthly_fee: 100000,
    start_date: "2023-06-01",
    end_date: "2024-06-01",
    notes: "탁구 3년차, 중급",
  },
  {
    id: "2",
    name: "이영희",
    phone: "010-2345-6789",
    email: "younghee@email.com",
    membership_type: "LESSON" as MembershipType,
    membership_status: "ACTIVE" as MembershipStatus,
    lesson_frequency: "TWICE_WEEK" as LessonFrequency,
    sessions_per_month: 8,
    sessions_used: 5,
    monthly_fee: 200000,
    start_date: "2023-09-01",
    end_date: "2024-09-01",
    notes: "초급자, 포핸드 연습 중",
  },
  {
    id: "3",
    name: "박민수",
    phone: "010-3456-7890",
    email: "minsu@email.com",
    membership_type: "MONTHLY" as MembershipType,
    membership_status: "EXPIRED" as MembershipStatus,
    lesson_frequency: null as LessonFrequency | null,
    sessions_per_month: 0,
    sessions_used: 0,
    monthly_fee: 100000,
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    notes: "",
  },
  {
    id: "4",
    name: "최지영",
    phone: "010-4567-8901",
    email: "jiyoung@email.com",
    membership_type: "LESSON" as MembershipType,
    membership_status: "ACTIVE" as MembershipStatus,
    lesson_frequency: "THREE_TIMES_WEEK" as LessonFrequency,
    sessions_per_month: 12,
    sessions_used: 10,
    monthly_fee: 300000,
    start_date: "2023-11-01",
    end_date: "2024-11-01",
    notes: "대회 준비 중",
  },
  {
    id: "5",
    name: "정대현",
    phone: "010-5678-9012",
    email: "daehyun@email.com",
    membership_type: "TRIAL" as MembershipType,
    membership_status: "ACTIVE" as MembershipStatus,
    lesson_frequency: null as LessonFrequency | null,
    sessions_per_month: 0,
    sessions_used: 0,
    monthly_fee: 0,
    start_date: "2024-01-15",
    end_date: "2024-01-31",
    notes: "체험 회원 - 월회원 전환 고려 중",
  },
];

const membershipTypeColors = {
  MONTHLY: "border-blue-500/30 bg-blue-500/20 text-blue-400",
  LESSON: "border-purple-500/30 bg-purple-500/20 text-purple-400",
  TRIAL: "border-amber-500/30 bg-amber-500/20 text-amber-400",
};

const statusColors = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
  EXPIRED: "border-red-500/30 bg-red-500/20 text-red-400",
  SUSPENDED: "border-gray-500/30 bg-gray-500/20 text-gray-400",
};

export default function MembersPage() {
  const t = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || member.membership_type === typeFilter;
    const matchesStatus = statusFilter === "all" || member.membership_status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockMembers.length,
    active: mockMembers.filter((m) => m.membership_status === "ACTIVE").length,
    monthly: mockMembers.filter((m) => m.membership_type === "MONTHLY").length,
    lesson: mockMembers.filter((m) => m.membership_type === "LESSON").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("members.title")}</h1>
          <p className="text-muted-foreground">탁구장 회원들을 관리하세요</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              {t("members.addMember")}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("members.addMember")}</DialogTitle>
              <DialogDescription>새 회원 정보를 입력하세요</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("members.name")}</Label>
                  <Input placeholder="홍길동" className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("members.phone")}</Label>
                  <Input placeholder="010-0000-0000" className="glass border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("members.email")}</Label>
                <Input placeholder="email@example.com" className="glass border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("members.membershipType")}</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="회원 유형 선택" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="MONTHLY">{t("members.types.MONTHLY")}</SelectItem>
                      <SelectItem value="LESSON">{t("members.types.LESSON")}</SelectItem>
                      <SelectItem value="TRIAL">{t("members.types.TRIAL")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("members.monthlyFee")}</Label>
                  <Input type="number" placeholder="100000" className="glass border-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("members.startDate")}</Label>
                  <Input type="date" className="glass border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("members.endDate")}</Label>
                  <Input type="date" className="glass border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("members.notes")}</Label>
                <Textarea placeholder="메모를 입력하세요" className="glass border-white/10" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-white/10">
                취소
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                회원 추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">전체 회원</p>
              <p className="text-2xl font-bold">{stats.total}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <UserCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">활성 회원</p>
              <p className="text-2xl font-bold">{stats.active}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">월회원</p>
              <p className="text-2xl font-bold">{stats.monthly}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">레슨회원</p>
              <p className="text-2xl font-bold">{stats.lesson}명</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="이름, 연락처, 이메일로 검색..."
            className="pl-10 glass border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px] glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="회원 유형" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 유형</SelectItem>
            <SelectItem value="MONTHLY">{t("members.types.MONTHLY")}</SelectItem>
            <SelectItem value="LESSON">{t("members.types.LESSON")}</SelectItem>
            <SelectItem value="TRIAL">{t("members.types.TRIAL")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px] glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="ACTIVE">{t("members.statuses.ACTIVE")}</SelectItem>
            <SelectItem value="EXPIRED">{t("members.statuses.EXPIRED")}</SelectItem>
            <SelectItem value="SUSPENDED">{t("members.statuses.SUSPENDED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="glass-card border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-lg font-bold">
                    {member.name[0]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge variant="outline" className={membershipTypeColors[member.membership_type]}>
                        {t(`members.types.${member.membership_type}`)}
                      </Badge>
                      <Badge variant="outline" className={statusColors[member.membership_status]}>
                        {t(`members.statuses.${member.membership_status}`)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </span>
                      {member.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                      )}
                    </div>
                    {member.membership_type === "LESSON" && member.lesson_frequency && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-purple-400">
                          {t(`lessons.frequency.${member.lesson_frequency}`)}
                        </span>
                        <span className="text-muted-foreground">
                          ({member.sessions_used}/{member.sessions_per_month}회 이용)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">₩{member.monthly_fee.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.start_date} ~ {member.end_date || "무기한"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/5">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Calendar className="h-4 w-4 mr-2" />
                        레슨 일정
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2" />
                        결제 내역
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {member.membership_status === "ACTIVE" ? (
                        <DropdownMenuItem className="cursor-pointer text-amber-400">
                          <UserX className="h-4 w-4 mr-2" />
                          회원 정지
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-pointer text-emerald-400">
                          <UserCheck className="h-4 w-4 mr-2" />
                          회원 활성화
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {member.notes && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-sm text-muted-foreground">{member.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">회원이 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            검색 조건에 맞는 회원이 없습니다
          </p>
        </div>
      )}
    </div>
  );
}
