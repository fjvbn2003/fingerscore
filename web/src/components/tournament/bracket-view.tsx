"use client";

import { useState, useMemo } from "react";
import { Trophy, User, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Bracket, Match, Participant } from "@/lib/bracket-generator";
import { getRoundName } from "@/lib/bracket-generator";

interface BracketViewProps {
  bracket: Bracket;
  onMatchClick?: (match: Match) => void;
  isEditable?: boolean;
}

export function BracketView({ bracket, onMatchClick, isEditable = false }: BracketViewProps) {
  const [selectedRound, setSelectedRound] = useState(0);
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;

  // 모바일에서는 라운드별로 보여주기
  const visibleRounds = useMemo(() => {
    if (isMobileView) {
      return [bracket.rounds[selectedRound]];
    }
    return bracket.rounds;
  }, [bracket.rounds, selectedRound, isMobileView]);

  return (
    <div className="w-full">
      {/* Mobile Round Navigation */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRound(Math.max(0, selectedRound - 1))}
          disabled={selectedRound === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {getRoundName(selectedRound + 1, bracket.total_rounds)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSelectedRound(Math.min(bracket.total_rounds - 1, selectedRound + 1))
          }
          disabled={selectedRound === bracket.total_rounds - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Bracket View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex gap-4 min-w-max p-4">
          {bracket.rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="flex flex-col">
              {/* Round Header */}
              <div className="mb-4 text-center">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {getRoundName(roundIndex + 1, bracket.total_rounds)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {round.length}경기
                </p>
              </div>

              {/* Matches */}
              <div
                className="flex flex-col justify-around flex-1 gap-2"
                style={{
                  minHeight: `${round.length * 100}px`,
                }}
              >
                {round.map((match, matchIndex) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    roundIndex={roundIndex}
                    totalRounds={bracket.total_rounds}
                    onClick={() => onMatchClick?.(match)}
                    isEditable={isEditable}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Champion Display */}
          <div className="flex flex-col justify-center items-center min-w-[200px]">
            <div className="mb-4 text-center">
              <h3 className="font-semibold text-sm text-muted-foreground">우승</h3>
            </div>
            <ChampionCard bracket={bracket} />
          </div>
        </div>
      </div>

      {/* Mobile Bracket View */}
      <div className="md:hidden space-y-3">
        {visibleRounds[0]?.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            roundIndex={selectedRound}
            totalRounds={bracket.total_rounds}
            onClick={() => onMatchClick?.(match)}
            isEditable={isEditable}
            isMobile
          />
        ))}
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  roundIndex: number;
  totalRounds: number;
  onClick?: () => void;
  isEditable?: boolean;
  isMobile?: boolean;
}

function MatchCard({
  match,
  roundIndex,
  totalRounds,
  onClick,
  isEditable,
  isMobile,
}: MatchCardProps) {
  const isFinal = roundIndex === totalRounds - 1;
  const isCompleted = match.status === "COMPLETED";
  const isBye = match.status === "BYE";
  const isInProgress = match.status === "IN_PROGRESS";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "w-[200px] overflow-hidden transition-all",
              isMobile && "w-full",
              isEditable && "cursor-pointer hover:ring-2 hover:ring-primary",
              isFinal && "ring-2 ring-yellow-500",
              isBye && "opacity-50"
            )}
            onClick={onClick}
          >
            {/* Match Header */}
            <div className="flex items-center justify-between bg-muted px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                #{match.match_number}
              </span>
              <MatchStatusBadge status={match.status} />
            </div>

            {/* Players */}
            <div className="divide-y">
              <PlayerRow
                participant={match.participant_a}
                score={match.score_a}
                sets={match.sets_a}
                isWinner={match.winner?.id === match.participant_a?.id}
                isCompleted={isCompleted}
              />
              <PlayerRow
                participant={match.participant_b}
                score={match.score_b}
                sets={match.sets_b}
                isWinner={match.winner?.id === match.participant_b?.id}
                isCompleted={isCompleted}
              />
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isBye
              ? "부전승"
              : isCompleted
              ? `${match.winner?.name} 승리`
              : isInProgress
              ? "경기 진행 중"
              : "경기 예정"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface PlayerRowProps {
  participant?: Participant | null;
  score?: number;
  sets?: number;
  isWinner?: boolean;
  isCompleted?: boolean;
}

function PlayerRow({
  participant,
  score,
  sets,
  isWinner,
  isCompleted,
}: PlayerRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 transition-colors",
        isCompleted && isWinner && "bg-green-50 dark:bg-green-950",
        !participant && "bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {participant ? (
          <>
            {participant.seed && (
              <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-bold">
                {participant.seed}
              </span>
            )}
            <span
              className={cn(
                "truncate text-sm",
                isWinner && "font-semibold",
                !isCompleted && "text-muted-foreground"
              )}
            >
              {participant.name}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">TBD</span>
        )}
      </div>

      {isCompleted && participant && (
        <div className="flex items-center gap-2">
          {sets !== undefined && (
            <span className={cn("text-sm font-medium", isWinner && "text-green-600")}>
              {sets}
            </span>
          )}
          {isWinner && (
            <Trophy className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      )}
    </div>
  );
}

function MatchStatusBadge({ status }: { status: Match["status"] }) {
  const config = {
    PENDING: { label: "예정", variant: "secondary" as const },
    IN_PROGRESS: { label: "진행중", variant: "default" as const },
    COMPLETED: { label: "완료", variant: "outline" as const },
    BYE: { label: "부전승", variant: "outline" as const },
  };

  const { label, variant } = config[status];

  return (
    <Badge variant={variant} className="text-xs px-1.5 py-0">
      {status === "IN_PROGRESS" && (
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {label}
    </Badge>
  );
}

function ChampionCard({ bracket }: { bracket: Bracket }) {
  const finalMatch = bracket.rounds[bracket.total_rounds - 1]?.[0];
  const champion = finalMatch?.winner;

  if (!champion) {
    return (
      <Card className="w-[200px] p-6 text-center border-dashed">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <p className="mt-2 text-sm text-muted-foreground">우승자 미정</p>
      </Card>
    );
  }

  return (
    <Card className="w-[200px] p-6 text-center bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-300">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-white">
        <Trophy className="h-8 w-8" />
      </div>
      <h4 className="font-bold text-lg">{champion.name}</h4>
      {champion.seed && (
        <p className="text-sm text-muted-foreground">시드 #{champion.seed}</p>
      )}
      <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
        우승
      </Badge>
    </Card>
  );
}

// 그룹 스테이지 뷰
interface GroupStageViewProps {
  groups: {
    name: string;
    participants: Participant[];
    matches: Match[];
  }[];
  onMatchClick?: (match: Match) => void;
}

export function GroupStageView({ groups, onMatchClick }: GroupStageViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((group) => (
        <Card key={group.name} className="overflow-hidden">
          <div className="bg-muted px-4 py-2">
            <h3 className="font-semibold">{group.name}조</h3>
          </div>

          {/* Standings Table */}
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 text-left">순위</th>
                  <th className="pb-2 text-left">선수</th>
                  <th className="pb-2 text-center">승</th>
                  <th className="pb-2 text-center">패</th>
                  <th className="pb-2 text-center">득실</th>
                </tr>
              </thead>
              <tbody>
                {group.participants.map((participant, index) => (
                  <tr key={participant.id} className="border-b last:border-0">
                    <td className="py-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                          index < 2
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-muted"
                        )}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {participant.name}
                      </div>
                    </td>
                    <td className="py-2 text-center">0</td>
                    <td className="py-2 text-center">0</td>
                    <td className="py-2 text-center">0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Group Matches */}
          <div className="border-t px-4 py-3">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              조별 경기 ({group.matches.length}경기)
            </h4>
            <div className="space-y-2">
              {group.matches.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onMatchClick?.(match)}
                >
                  <span>{match.participant_a?.name}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span>{match.participant_b?.name}</span>
                </div>
              ))}
              {group.matches.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full">
                  +{group.matches.length - 3}경기 더보기
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
