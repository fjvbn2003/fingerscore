/**
 * Tournament Bracket Generator
 * 대진표 자동 생성 유틸리티
 */

export interface Participant {
  id: string;
  name: string;
  rating?: number;
  seed?: number;
}

export interface Match {
  id: string;
  round: number;
  match_number: number;
  participant_a?: Participant | null;
  participant_b?: Participant | null;
  winner?: Participant | null;
  score_a?: number;
  score_b?: number;
  sets_a?: number;
  sets_b?: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BYE";
  source_match_a?: string | null;
  source_match_b?: string | null;
}

export interface Bracket {
  tournament_id: string;
  type: "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION" | "ROUND_ROBIN" | "GROUP_KNOCKOUT";
  rounds: Match[][];
  total_rounds: number;
}

/**
 * 가장 가까운 2의 거듭제곱 수 계산
 */
function nextPowerOf2(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

/**
 * 시드 배정 알고리즘 (레이팅 기반)
 * 1번 시드와 2번 시드가 결승에서 만나도록 배치
 */
function assignSeeds(participants: Participant[], method: "RATING" | "RANDOM" | "MANUAL"): Participant[] {
  const sorted = [...participants];

  if (method === "RATING") {
    sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (method === "RANDOM") {
    for (let i = sorted.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    }
  }

  return sorted.map((p, index) => ({ ...p, seed: index + 1 }));
}

/**
 * 시드 순서대로 대진표 배치 생성
 * 1번 시드 vs 마지막 시드, 2번 시드 vs (마지막-1) 시드 등
 */
function createSeedOrder(bracketSize: number): number[] {
  if (bracketSize === 2) return [0, 1];

  const half = bracketSize / 2;
  const left = createSeedOrder(half);
  const right = createSeedOrder(half);

  const result: number[] = [];
  for (let i = 0; i < half; i++) {
    result.push(left[i]);
    result.push(bracketSize - 1 - right[i]);
  }

  return result;
}

/**
 * 싱글 엘리미네이션 대진표 생성
 */
export function generateSingleElimination(
  tournamentId: string,
  participants: Participant[],
  seedMethod: "RATING" | "RANDOM" | "MANUAL" = "RATING"
): Bracket {
  const seededParticipants = assignSeeds(participants, seedMethod);
  const bracketSize = nextPowerOf2(seededParticipants.length);
  const totalRounds = Math.log2(bracketSize);
  const byes = bracketSize - seededParticipants.length;

  // BYE 추가
  const paddedParticipants: (Participant | null)[] = [...seededParticipants];
  for (let i = 0; i < byes; i++) {
    paddedParticipants.push(null);
  }

  // 시드 순서대로 배치
  const seedOrder = createSeedOrder(bracketSize);
  const orderedParticipants: (Participant | null)[] = seedOrder.map(
    (index) => paddedParticipants[index] || null
  );

  const rounds: Match[][] = [];
  let matchId = 1;

  // 1라운드 생성
  const firstRound: Match[] = [];
  for (let i = 0; i < bracketSize / 2; i++) {
    const a = orderedParticipants[i * 2];
    const b = orderedParticipants[i * 2 + 1];

    const isBye = !a || !b;
    const winner = isBye ? (a || b) : null;

    firstRound.push({
      id: `${tournamentId}-m${matchId++}`,
      round: 1,
      match_number: i + 1,
      participant_a: a,
      participant_b: b,
      winner,
      status: isBye ? "BYE" : "PENDING",
    });
  }
  rounds.push(firstRound);

  // 나머지 라운드 생성
  for (let round = 2; round <= totalRounds; round++) {
    const prevRound = rounds[round - 2];
    const currentRound: Match[] = [];

    for (let i = 0; i < prevRound.length / 2; i++) {
      const sourceA = prevRound[i * 2];
      const sourceB = prevRound[i * 2 + 1];

      // BYE 매치에서 자동 진출한 선수 배정
      const participantA = sourceA.status === "BYE" ? sourceA.winner : null;
      const participantB = sourceB.status === "BYE" ? sourceB.winner : null;

      currentRound.push({
        id: `${tournamentId}-m${matchId++}`,
        round,
        match_number: i + 1,
        participant_a: participantA || null,
        participant_b: participantB || null,
        status: "PENDING",
        source_match_a: sourceA.id,
        source_match_b: sourceB.id,
      });
    }
    rounds.push(currentRound);
  }

  return {
    tournament_id: tournamentId,
    type: "SINGLE_ELIMINATION",
    rounds,
    total_rounds: totalRounds,
  };
}

/**
 * 조별 리그 대진표 생성
 */
export function generateGroupStage(
  tournamentId: string,
  participants: Participant[],
  groupCount: number,
  seedMethod: "RATING" | "RANDOM" | "MANUAL" = "RATING"
): { groups: { name: string; participants: Participant[]; matches: Match[] }[] } {
  const seededParticipants = assignSeeds(participants, seedMethod);
  const groups: { name: string; participants: Participant[]; matches: Match[] }[] = [];

  // 스네이크 드래프트로 조 편성
  for (let i = 0; i < groupCount; i++) {
    groups.push({
      name: String.fromCharCode(65 + i), // A, B, C, D...
      participants: [],
      matches: [],
    });
  }

  seededParticipants.forEach((participant, index) => {
    const round = Math.floor(index / groupCount);
    const groupIndex = round % 2 === 0 ? index % groupCount : groupCount - 1 - (index % groupCount);
    groups[groupIndex].participants.push(participant);
  });

  // 각 조별 라운드 로빈 매치 생성
  let matchId = 1;
  groups.forEach((group) => {
    const n = group.participants.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        group.matches.push({
          id: `${tournamentId}-g${group.name}-m${matchId++}`,
          round: 1,
          match_number: group.matches.length + 1,
          participant_a: group.participants[i],
          participant_b: group.participants[j],
          status: "PENDING",
        });
      }
    }
  });

  return { groups };
}

/**
 * 라운드 로빈 대진표 생성
 */
export function generateRoundRobin(
  tournamentId: string,
  participants: Participant[],
  seedMethod: "RATING" | "RANDOM" | "MANUAL" = "RATING"
): { matches: Match[][]; totalRounds: number } {
  const seededParticipants = assignSeeds(participants, seedMethod);
  let players = [...seededParticipants];

  // 홀수면 BYE 추가
  if (players.length % 2 === 1) {
    players.push({ id: "BYE", name: "BYE" });
  }

  const n = players.length;
  const rounds: Match[][] = [];
  let matchId = 1;

  // Circle method for round-robin scheduling
  for (let round = 0; round < n - 1; round++) {
    const roundMatches: Match[] = [];

    for (let i = 0; i < n / 2; i++) {
      const home = players[i];
      const away = players[n - 1 - i];

      if (home.id !== "BYE" && away.id !== "BYE") {
        roundMatches.push({
          id: `${tournamentId}-r${round + 1}-m${matchId++}`,
          round: round + 1,
          match_number: i + 1,
          participant_a: home,
          participant_b: away,
          status: "PENDING",
        });
      }
    }

    rounds.push(roundMatches);

    // Rotate players (keep first player fixed)
    const last = players.pop()!;
    players.splice(1, 0, last);
  }

  return { matches: rounds, totalRounds: n - 1 };
}

/**
 * 경기 결과 업데이트 및 다음 라운드 진출자 배정
 */
export function updateMatchResult(
  bracket: Bracket,
  matchId: string,
  winner: Participant,
  scoreA: number,
  scoreB: number,
  setsA?: number,
  setsB?: number
): Bracket {
  const updatedRounds = bracket.rounds.map((round) =>
    round.map((match) => {
      if (match.id === matchId) {
        return {
          ...match,
          winner,
          score_a: scoreA,
          score_b: scoreB,
          sets_a: setsA,
          sets_b: setsB,
          status: "COMPLETED" as const,
        };
      }

      // 다음 라운드 매치에 승자 배정
      if (match.source_match_a === matchId) {
        return { ...match, participant_a: winner };
      }
      if (match.source_match_b === matchId) {
        return { ...match, participant_b: winner };
      }

      return match;
    })
  );

  return { ...bracket, rounds: updatedRounds };
}

/**
 * 라운드 이름 반환
 */
export function getRoundName(round: number, totalRounds: number): string {
  const fromFinal = totalRounds - round;

  switch (fromFinal) {
    case 0:
      return "결승";
    case 1:
      return "4강";
    case 2:
      return "8강";
    case 3:
      return "16강";
    case 4:
      return "32강";
    default:
      return `${round}라운드`;
  }
}
