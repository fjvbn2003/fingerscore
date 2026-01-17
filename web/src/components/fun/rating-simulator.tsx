"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Zap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  simulateMatch,
  getTierInfo,
  getProgressToNextTier,
  calculateExpectedScore,
  TIER_CONFIG,
} from "@/lib/elo-rating";
import { cn } from "@/lib/utils";

interface RatingSimulatorProps {
  defaultMyRating?: number;
  defaultOpponentRating?: number;
}

export function RatingSimulator({
  defaultMyRating = 1500,
  defaultOpponentRating = 1500,
}: RatingSimulatorProps) {
  const [myRating, setMyRating] = useState(defaultMyRating);
  const [opponentRating, setOpponentRating] = useState(defaultOpponentRating);

  const simulation = useMemo(
    () => simulateMatch(myRating, opponentRating),
    [myRating, opponentRating]
  );

  const myTier = getTierInfo(myRating);
  const opponentTier = getTierInfo(opponentRating);
  const myProgress = getProgressToNextTier(myRating);

  const ratingDiff = myRating - opponentRating;
  const isUpset = ratingDiff < -100;
  const isFavored = ratingDiff > 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          레이팅 시뮬레이터
        </CardTitle>
        <CardDescription>
          상대를 이기면 몇 점 오를지 미리 계산해보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Inputs */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* My Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">내 레이팅</Label>
              <Badge
                style={{ backgroundColor: myTier.color, color: "#fff" }}
                className="gap-1"
              >
                {myTier.icon} {myTier.koreanName}
              </Badge>
            </div>
            <Input
              type="number"
              value={myRating}
              onChange={(e) => setMyRating(Number(e.target.value) || 1500)}
              className="text-2xl font-bold text-center h-14"
            />
            <Slider
              value={[myRating]}
              onValueChange={([value]) => setMyRating(value)}
              min={100}
              max={3000}
              step={10}
              className="py-2"
            />

            {/* Progress to next tier */}
            {myProgress.nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">다음 티어까지</span>
                  <span className="font-medium">
                    {myProgress.pointsNeeded}점 필요
                  </span>
                </div>
                <Progress value={myProgress.progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {myProgress.nextTier.icon} {myProgress.nextTier.koreanName} 승급까지{" "}
                  {myProgress.progressPercent}%
                </p>
              </div>
            )}
          </div>

          {/* Opponent Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">상대 레이팅</Label>
              <Badge
                style={{ backgroundColor: opponentTier.color, color: "#fff" }}
                className="gap-1"
              >
                {opponentTier.icon} {opponentTier.koreanName}
              </Badge>
            </div>
            <Input
              type="number"
              value={opponentRating}
              onChange={(e) => setOpponentRating(Number(e.target.value) || 1500)}
              className="text-2xl font-bold text-center h-14"
            />
            <Slider
              value={[opponentRating]}
              onValueChange={([value]) => setOpponentRating(value)}
              min={100}
              max={3000}
              step={10}
              className="py-2"
            />

            {/* Rating difference indicator */}
            <div
              className={cn(
                "rounded-lg p-3 text-center",
                isUpset && "bg-orange-100 dark:bg-orange-900/30",
                isFavored && "bg-blue-100 dark:bg-blue-900/30",
                !isUpset && !isFavored && "bg-muted"
              )}
            >
              {isUpset ? (
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  <Zap className="inline h-4 w-4 mr-1" />
                  언더독 매치! 업셋 승리 시 추가 점수
                </p>
              ) : isFavored ? (
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Target className="inline h-4 w-4 mr-1" />
                  유리한 매치! 하지만 패배 시 큰 손실
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  균형 잡힌 매치업
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Simulation Results */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Win Result */}
          <Card className="bg-green-50 dark:bg-green-950 border-green-200">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-green-600" />
              <p className="mt-2 text-sm text-muted-foreground">승리 시</p>
              <p className="text-3xl font-bold text-green-600">
                +{simulation.winPoints}
              </p>
              <p className="text-sm text-muted-foreground">
                → {myRating + simulation.winPoints}점
              </p>
            </CardContent>
          </Card>

          {/* Expected Win Rate */}
          <Card className="border-primary/30">
            <CardContent className="pt-6 text-center">
              <Target className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">예상 승률</p>
              <p className="text-3xl font-bold text-primary">
                {simulation.expectedWinRate}%
              </p>
              <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${simulation.expectedWinRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lose Result */}
          <Card className="bg-red-50 dark:bg-red-950 border-red-200">
            <CardContent className="pt-6 text-center">
              <TrendingDown className="mx-auto h-8 w-8 text-red-600" />
              <p className="mt-2 text-sm text-muted-foreground">패배 시</p>
              <p className="text-3xl font-bold text-red-600">
                -{simulation.losePoints}
              </p>
              <p className="text-sm text-muted-foreground">
                → {myRating - simulation.losePoints}점
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Quick Select */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            빠른 레이팅 선택
          </Label>
          <div className="flex flex-wrap gap-2">
            {TIER_CONFIG.map((tier) => (
              <TooltipProvider key={tier.tier}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpponentRating(tier.minRating + 100)}
                      style={{
                        borderColor: tier.color,
                        color: tier.color,
                      }}
                    >
                      {tier.icon} {tier.koreanName}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {tier.minRating} ~ {tier.maxRating}점
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-1 text-muted-foreground">
              <p>
                <strong>ELO 레이팅 시스템</strong>은 체스에서 유래한 실력 측정
                시스템입니다.
              </p>
              <p>
                • 신규 선수 (10경기 미만): 빠른 레이팅 변동 (K=40)
              </p>
              <p>
                • 일반 선수: 표준 변동 (K=20)
              </p>
              <p>
                • 고레이팅 선수 (2400+): 안정적 변동 (K=10)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
