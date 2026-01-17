"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ArrowLeft,
  Loader2,
  Info,
  Clock,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import type { SportType, TournamentType, MatchFormat } from "@/types/database";

const tournamentSchema = z.object({
  title: z.string().min(5, "대회명은 최소 5자 이상이어야 합니다"),
  description: z.string().min(10, "대회 설명은 최소 10자 이상이어야 합니다"),
  sport_type: z.enum(["TABLE_TENNIS", "TENNIS", "BADMINTON"]),
  tournament_type: z.enum(["SINGLE_ELIMINATION", "DOUBLE_ELIMINATION", "ROUND_ROBIN", "GROUP_KNOCKOUT"]),
  match_format: z.enum(["SINGLES", "DOUBLES"]),
  location: z.string().min(2, "지역을 입력해주세요"),
  venue: z.string().min(2, "장소를 입력해주세요"),
  venue_address: z.string().optional(),
  registration_start: z.string(),
  registration_end: z.string(),
  tournament_start: z.string(),
  tournament_end: z.string().optional(),
  max_participants: z.number().min(4).max(256),
  entry_fee: z.number().min(0),
  prize_info: z.string().optional(),
  rules: z.string().optional(),
  contact_info: z.string().optional(),
  sets_to_win: z.number().min(1).max(5),
  points_per_set: z.number().min(11).max(21),
  deuce_enabled: z.boolean(),
  seed_method: z.enum(["RATING", "RANDOM", "MANUAL"]),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

export default function CreateTournamentPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      sport_type: "TABLE_TENNIS",
      tournament_type: "SINGLE_ELIMINATION",
      match_format: "SINGLES",
      max_participants: 32,
      entry_fee: 20000,
      sets_to_win: 3,
      points_per_set: 11,
      deuce_enabled: true,
      seed_method: "RATING",
    },
  });

  const watchedSportType = watch("sport_type");
  const watchedTournamentType = watch("tournament_type");

  const onSubmit = async (data: TournamentFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Tournament data:", data);

    toast.success("대회가 생성되었습니다", {
      description: "참가 신청을 받을 준비가 되었습니다.",
    });

    router.push("/tournaments");
  };

  const steps = [
    { id: 1, title: "기본 정보", icon: Info },
    { id: 2, title: "일정 및 장소", icon: Calendar },
    { id: 3, title: "대회 설정", icon: Settings },
  ];

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/tournaments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            대회 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">새 대회 만들기</h1>
        <p className="mt-1 text-muted-foreground">
          대회 정보를 입력하고 참가자를 모집하세요
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`ml-2 hidden text-sm font-medium sm:block ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-12 sm:w-24 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                기본 정보
              </CardTitle>
              <CardDescription>
                대회의 기본 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">대회명 *</Label>
                <Input
                  id="title"
                  placeholder="예: 2024 서울 오픈 탁구 대회"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">대회 설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="대회에 대한 상세 설명을 입력해주세요"
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Sport Type & Format */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>종목 *</Label>
                  <Select
                    value={watchedSportType}
                    onValueChange={(value) => setValue("sport_type", value as SportType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TABLE_TENNIS">탁구</SelectItem>
                      <SelectItem value="TENNIS">테니스</SelectItem>
                      <SelectItem value="BADMINTON">배드민턴</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>대회 방식 *</Label>
                  <Select
                    value={watchedTournamentType}
                    onValueChange={(value) => setValue("tournament_type", value as TournamentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE_ELIMINATION">싱글 엘리미네이션</SelectItem>
                      <SelectItem value="DOUBLE_ELIMINATION">더블 엘리미네이션</SelectItem>
                      <SelectItem value="ROUND_ROBIN">라운드 로빈</SelectItem>
                      <SelectItem value="GROUP_KNOCKOUT">조별 리그 + 토너먼트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>경기 형식 *</Label>
                  <Select
                    value={watch("match_format")}
                    onValueChange={(value) => setValue("match_format", value as MatchFormat)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLES">단식</SelectItem>
                      <SelectItem value="DOUBLES">복식</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Participants & Fee */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max_participants">최대 참가 인원 *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="max_participants"
                      type="number"
                      className="pl-10"
                      {...register("max_participants", { valueAsNumber: true })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    4~256명 사이로 설정 가능합니다
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry_fee">참가비 (원)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="entry_fee"
                      type="number"
                      className="pl-10"
                      {...register("entry_fee", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setCurrentStep(2)}>
                  다음 단계
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule & Location */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                일정 및 장소
              </CardTitle>
              <CardDescription>
                대회 일정과 장소 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Registration Period */}
              <div className="space-y-4">
                <h3 className="font-medium">접수 기간</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="registration_start">접수 시작일 *</Label>
                    <Input
                      id="registration_start"
                      type="datetime-local"
                      {...register("registration_start")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_end">접수 마감일 *</Label>
                    <Input
                      id="registration_end"
                      type="datetime-local"
                      {...register("registration_end")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tournament Period */}
              <div className="space-y-4">
                <h3 className="font-medium">대회 기간</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tournament_start">대회 시작일 *</Label>
                    <Input
                      id="tournament_start"
                      type="datetime-local"
                      {...register("tournament_start")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tournament_end">대회 종료일</Label>
                    <Input
                      id="tournament_end"
                      type="datetime-local"
                      {...register("tournament_end")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-medium">장소 정보</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">지역 *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="예: 서울특별시"
                        className="pl-10"
                        {...register("location")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue">장소명 *</Label>
                    <Input
                      id="venue"
                      placeholder="예: 올림픽공원 체육관"
                      {...register("venue")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue_address">상세 주소</Label>
                  <Input
                    id="venue_address"
                    placeholder="예: 서울특별시 송파구 올림픽로 424"
                    {...register("venue_address")}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  이전 단계
                </Button>
                <Button type="button" onClick={() => setCurrentStep(3)}>
                  다음 단계
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Tournament Settings */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                대회 설정
              </CardTitle>
              <CardDescription>
                경기 규칙과 시드 배정 방식을 설정해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Match Rules */}
              <div className="space-y-4">
                <h3 className="font-medium">경기 규칙</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="sets_to_win">승리 세트 수</Label>
                    <Select
                      value={watch("sets_to_win")?.toString()}
                      onValueChange={(value) => setValue("sets_to_win", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2세트 선승</SelectItem>
                        <SelectItem value="3">3세트 선승</SelectItem>
                        <SelectItem value="4">4세트 선승</SelectItem>
                        <SelectItem value="5">5세트 선승</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points_per_set">세트당 점수</Label>
                    <Select
                      value={watch("points_per_set")?.toString()}
                      onValueChange={(value) => setValue("points_per_set", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11">11점</SelectItem>
                        <SelectItem value="15">15점</SelectItem>
                        <SelectItem value="21">21점</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="deuce"
                      checked={watch("deuce_enabled")}
                      onCheckedChange={(checked) => setValue("deuce_enabled", checked)}
                    />
                    <Label htmlFor="deuce">듀스 적용</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seed Method */}
              <div className="space-y-4">
                <h3 className="font-medium">시드 배정 방식</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: "RATING", label: "레이팅 기반", desc: "ELO 레이팅 순으로 시드 배정" },
                    { value: "RANDOM", label: "랜덤 추첨", desc: "무작위로 시드 배정" },
                    { value: "MANUAL", label: "수동 배정", desc: "운영자가 직접 시드 배정" },
                  ].map((method) => (
                    <div
                      key={method.value}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        watch("seed_method") === method.value
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                      onClick={() => setValue("seed_method", method.value as "RATING" | "RANDOM" | "MANUAL")}
                    >
                      <div className="font-medium">{method.label}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{method.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-medium">추가 정보</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prize_info">상품/시상 정보</Label>
                    <Textarea
                      id="prize_info"
                      placeholder="예: 1등 상금 50만원, 2등 30만원, 3등 20만원"
                      rows={2}
                      {...register("prize_info")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rules">대회 규칙</Label>
                    <Textarea
                      id="rules"
                      placeholder="대회 진행 규칙, 주의사항 등을 입력해주세요"
                      rows={3}
                      {...register("rules")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_info">문의처</Label>
                    <Input
                      id="contact_info"
                      placeholder="예: 010-1234-5678 또는 email@example.com"
                      {...register("contact_info")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  이전 단계
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  대회 생성
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
