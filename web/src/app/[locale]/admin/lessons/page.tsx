"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Check,
  X,
  Bell,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock data
const mockLessons = [
  { id: "1", memberId: "1", memberName: "김철수", memberPhone: "010-1234-5678", coachName: "박코치", date: "2024-01-18", startTime: "09:00", endTime: "10:00", isCompleted: true, isCancelled: false, reminderSent: true },
  { id: "2", memberId: "2", memberName: "이영희", memberPhone: "010-2345-6789", coachName: "박코치", date: "2024-01-18", startTime: "10:30", endTime: "11:30", isCompleted: true, isCancelled: false, reminderSent: true },
  { id: "3", memberId: "3", memberName: "박민수", memberPhone: "010-3456-7890", coachName: "김코치", date: "2024-01-18", startTime: "14:00", endTime: "15:00", isCompleted: false, isCancelled: false, reminderSent: true },
  { id: "4", memberId: "4", memberName: "최지영", memberPhone: "010-4567-8901", coachName: "김코치", date: "2024-01-18", startTime: "15:30", endTime: "16:30", isCompleted: false, isCancelled: false, reminderSent: true },
  { id: "5", memberId: "5", memberName: "정대현", memberPhone: "010-5678-9012", coachName: "박코치", date: "2024-01-18", startTime: "17:00", endTime: "18:00", isCompleted: false, isCancelled: false, reminderSent: false },
  { id: "6", memberId: "2", memberName: "이영희", memberPhone: "010-2345-6789", coachName: "박코치", date: "2024-01-19", startTime: "10:30", endTime: "11:30", isCompleted: false, isCancelled: false, reminderSent: false },
  { id: "7", memberId: "4", memberName: "최지영", memberPhone: "010-4567-8901", coachName: "김코치", date: "2024-01-19", startTime: "15:30", endTime: "16:30", isCompleted: false, isCancelled: false, reminderSent: false },
  { id: "8", memberId: "1", memberName: "김철수", memberPhone: "010-1234-5678", coachName: "박코치", date: "2024-01-20", startTime: "09:00", endTime: "10:00", isCompleted: false, isCancelled: true, reminderSent: false },
  { id: "9", memberId: "2", memberName: "이영희", memberPhone: "010-2345-6789", coachName: "박코치", date: "2024-01-20", startTime: "10:30", endTime: "11:30", isCompleted: false, isCancelled: false, reminderSent: false },
  { id: "10", memberId: "4", memberName: "최지영", memberPhone: "010-4567-8901", coachName: "김코치", date: "2024-01-22", startTime: "15:30", endTime: "16:30", isCompleted: false, isCancelled: false, reminderSent: false },
];

const mockMembers = [
  { id: "1", name: "김철수" },
  { id: "2", name: "이영희" },
  { id: "3", name: "박민수" },
  { id: "4", name: "최지영" },
  { id: "5", name: "정대현" },
];

const coaches = ["박코치", "김코치"];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

export default function LessonsPage() {
  const t = useTranslations("admin");
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 18)); // January 18, 2024
  const [view, setView] = useState<"week" | "day">("week");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Get start of week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getLessonsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return mockLessons.filter((lesson) => lesson.date === dateStr);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date(2024, 0, 18); // Mock today
    return formatDate(date) === formatDate(today);
  };

  const stats = {
    totalThisWeek: mockLessons.filter((l) => {
      const lessonDate = new Date(l.date);
      return lessonDate >= weekStart && lessonDate <= weekDays[6];
    }).length,
    completedThisWeek: mockLessons.filter((l) => l.isCompleted).length,
    cancelledThisWeek: mockLessons.filter((l) => l.isCancelled).length,
    pendingReminders: mockLessons.filter((l) => !l.reminderSent && !l.isCompleted && !l.isCancelled).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("lessons.title")}</h1>
          <p className="text-muted-foreground">레슨 일정을 관리하고 리마인더를 발송하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0">
                <Plus className="mr-2 h-4 w-4" />
                {t("lessons.addLesson")}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("lessons.addLesson")}</DialogTitle>
                <DialogDescription>새 레슨 일정을 등록하세요</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>{t("lessons.member")}</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="회원 선택" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {mockMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("lessons.coach")}</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="코치 선택" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {coaches.map((coach) => (
                        <SelectItem key={coach} value={coach}>
                          {coach}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("lessons.date")}</Label>
                  <Input type="date" className="glass border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("lessons.startTime")}</Label>
                    <Select>
                      <SelectTrigger className="glass border-white/10">
                        <SelectValue placeholder="시작 시간" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 max-h-60">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("lessons.endTime")}</Label>
                    <Select>
                      <SelectTrigger className="glass border-white/10">
                        <SelectValue placeholder="종료 시간" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 max-h-60">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>메모</Label>
                  <Textarea placeholder="레슨 관련 메모" className="glass border-white/10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-white/10">
                  취소
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                  레슨 추가
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이번 주 레슨</p>
              <p className="text-2xl font-bold">{stats.totalThisWeek}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
              <Check className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">완료</p>
              <p className="text-2xl font-bold">{stats.completedThisWeek}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
              <X className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">취소</p>
              <p className="text-2xl font-bold">{stats.cancelledThisWeek}건</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
              <Bell className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">리마인더 미발송</p>
              <p className="text-2xl font-bold text-amber-400">{stats.pendingReminders}건</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Header */}
      <Card className="glass-card border-white/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek(-1)}
                  className="hover:bg-white/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateWeek(1)}
                  className="hover:bg-white/5"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle>
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className={view === "week" ? "bg-white/10" : "hover:bg-white/5"}
              >
                주간
              </Button>
              <Button
                variant={view === "day" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
                className={view === "day" ? "bg-white/10" : "hover:bg-white/5"}
              >
                일간
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date(2024, 0, 18))}
                className="border-white/10 hover:bg-white/5"
              >
                오늘
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {weekDays.map((day, i) => {
              const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
              const lessons = getLessonsForDate(day);
              return (
                <div
                  key={i}
                  className={cn(
                    "text-center p-3 rounded-xl transition-colors",
                    isToday(day)
                      ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                      : "glass border-white/5"
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {dayNames[day.getDay()]}
                  </div>
                  <div
                    className={cn(
                      "text-lg font-bold",
                      isToday(day) && "text-purple-400"
                    )}
                  >
                    {day.getDate()}
                  </div>
                  <div className="mt-2 space-y-1">
                    {lessons.slice(0, 3).map((lesson) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          "text-xs p-1.5 rounded-lg truncate cursor-pointer transition-colors",
                          lesson.isCancelled
                            ? "bg-red-500/20 text-red-400 line-through"
                            : lesson.isCompleted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                        )}
                      >
                        {lesson.startTime} {lesson.memberName}
                      </div>
                    ))}
                    {lessons.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{lessons.length - 3}건 더
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Lessons Detail */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            오늘의 레슨 상세
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getLessonsForDate(new Date(2024, 0, 18)).map((lesson) => (
              <div
                key={lesson.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-colors",
                  lesson.isCancelled
                    ? "bg-red-500/10 border border-red-500/20"
                    : lesson.isCompleted
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-white/5 border border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">{lesson.startTime}</span>
                    <span className="text-xs text-muted-foreground">~{lesson.endTime}</span>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{lesson.memberName}</span>
                      <Badge
                        variant="outline"
                        className={
                          lesson.isCancelled
                            ? "border-red-500/30 bg-red-500/20 text-red-400"
                            : lesson.isCompleted
                            ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                            : "border-purple-500/30 bg-purple-500/20 text-purple-400"
                        }
                      >
                        {lesson.isCancelled ? "취소" : lesson.isCompleted ? "완료" : "예정"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{lesson.coachName}</span>
                      <span>·</span>
                      <span>{lesson.memberPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!lesson.isCompleted && !lesson.isCancelled && (
                    <>
                      {lesson.reminderSent ? (
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                          <Bell className="h-3 w-3 mr-1" />
                          발송완료
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          <Bell className="h-3 w-3 mr-1" />
                          리마인더 발송
                        </Button>
                      )}
                    </>
                  )}
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
                      {!lesson.isCompleted && !lesson.isCancelled && (
                        <>
                          <DropdownMenuItem className="cursor-pointer text-emerald-400">
                            <Check className="h-4 w-4 mr-2" />
                            완료 처리
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="h-4 w-4 mr-2" />
                            이메일 발송
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            문자 발송
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      {!lesson.isCancelled && (
                        <DropdownMenuItem className="cursor-pointer text-red-400">
                          <X className="h-4 w-4 mr-2" />
                          취소
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
