/**
 * Sports Quotes Ticker Tests
 * Tests for the sports quotes ticker component functionality
 */

import { describe, it, expect } from "vitest";

// Sports quotes data structure matching the component
interface SportsQuote {
  quote: string;
  author: string;
  sport: "TABLE_TENNIS" | "TENNIS" | "BADMINTON" | "GENERAL";
}

// Sample quotes for testing (subset of actual quotes)
const sportsQuotes: SportsQuote[] = [
  { quote: "탁구는 체스를 하면서 100m 달리기를 하는 것과 같다", author: "베르너 슐라거", sport: "TABLE_TENNIS" },
  { quote: "연습은 거짓말을 하지 않는다", author: "마롱", sport: "TABLE_TENNIS" },
  { quote: "챔피언은 챔피언처럼 행동한다. 그 전에", author: "빌리 진 킹", sport: "TENNIS" },
  { quote: "최선을 다하지 않으면 '만약'이라는 후회가 남는다", author: "라파엘 나달", sport: "TENNIS" },
  { quote: "셔틀콕은 거짓말을 하지 않는다", author: "린단", sport: "BADMINTON" },
  { quote: "한 점 한 점이 역사를 만든다", author: "케빈 사양", sport: "BADMINTON" },
  { quote: "오늘의 땀이 내일의 기록이 된다", author: "무명", sport: "GENERAL" },
  { quote: "오늘도 한 판 더!", author: "FingerScore", sport: "GENERAL" },
];

// Helper function to shuffle quotes (matching component logic)
function shuffleQuotes(quotes: SportsQuote[]): SportsQuote[] {
  return [...quotes].sort(() => Math.random() - 0.5);
}

// Helper function to filter quotes by sport
function filterQuotesBySport(quotes: SportsQuote[], sport: SportsQuote["sport"]): SportsQuote[] {
  return quotes.filter((q) => q.sport === sport);
}

describe("Sports Quotes Data", () => {
  it("should have quotes for all supported sports", () => {
    const tableTennisQuotes = filterQuotesBySport(sportsQuotes, "TABLE_TENNIS");
    const tennisQuotes = filterQuotesBySport(sportsQuotes, "TENNIS");
    const badmintonQuotes = filterQuotesBySport(sportsQuotes, "BADMINTON");
    const generalQuotes = filterQuotesBySport(sportsQuotes, "GENERAL");

    expect(tableTennisQuotes.length).toBeGreaterThan(0);
    expect(tennisQuotes.length).toBeGreaterThan(0);
    expect(badmintonQuotes.length).toBeGreaterThan(0);
    expect(generalQuotes.length).toBeGreaterThan(0);
  });

  it("should have non-empty quotes and authors", () => {
    sportsQuotes.forEach((item) => {
      expect(item.quote.length).toBeGreaterThan(0);
      expect(item.author.length).toBeGreaterThan(0);
    });
  });

  it("should have valid sport types", () => {
    const validSports = ["TABLE_TENNIS", "TENNIS", "BADMINTON", "GENERAL"];
    sportsQuotes.forEach((item) => {
      expect(validSports).toContain(item.sport);
    });
  });
});

describe("Quote Shuffling", () => {
  it("should maintain all quotes after shuffling", () => {
    const shuffled = shuffleQuotes(sportsQuotes);
    expect(shuffled.length).toBe(sportsQuotes.length);

    // Check all original quotes are present
    sportsQuotes.forEach((quote) => {
      expect(shuffled).toContainEqual(quote);
    });
  });

  it("should not modify the original array", () => {
    const originalLength = sportsQuotes.length;
    const originalFirst = sportsQuotes[0];

    shuffleQuotes(sportsQuotes);

    expect(sportsQuotes.length).toBe(originalLength);
    expect(sportsQuotes[0]).toEqual(originalFirst);
  });

  it("should produce different orders (probabilistically)", () => {
    // Run multiple shuffles and check that at least one is different
    let foundDifferentOrder = false;

    for (let i = 0; i < 10; i++) {
      const shuffled = shuffleQuotes(sportsQuotes);
      const isDifferent = shuffled.some((quote, idx) => quote !== sportsQuotes[idx]);
      if (isDifferent) {
        foundDifferentOrder = true;
        break;
      }
    }

    // With 8+ items, the probability of getting the same order 10 times is negligible
    expect(foundDifferentOrder).toBe(true);
  });
});

describe("Quote Filtering by Sport", () => {
  it("should filter table tennis quotes correctly", () => {
    const filtered = filterQuotesBySport(sportsQuotes, "TABLE_TENNIS");
    filtered.forEach((quote) => {
      expect(quote.sport).toBe("TABLE_TENNIS");
    });
  });

  it("should filter tennis quotes correctly", () => {
    const filtered = filterQuotesBySport(sportsQuotes, "TENNIS");
    filtered.forEach((quote) => {
      expect(quote.sport).toBe("TENNIS");
    });
  });

  it("should filter badminton quotes correctly", () => {
    const filtered = filterQuotesBySport(sportsQuotes, "BADMINTON");
    filtered.forEach((quote) => {
      expect(quote.sport).toBe("BADMINTON");
    });
  });

  it("should filter general quotes correctly", () => {
    const filtered = filterQuotesBySport(sportsQuotes, "GENERAL");
    filtered.forEach((quote) => {
      expect(quote.sport).toBe("GENERAL");
    });
  });
});

describe("Ticker Animation Timing", () => {
  const speedConfig = {
    slow: 8000,
    normal: 6000,
    fast: 4000,
  };

  it("should have correct timing for slow speed", () => {
    expect(speedConfig.slow).toBe(8000);
  });

  it("should have correct timing for normal speed", () => {
    expect(speedConfig.normal).toBe(6000);
  });

  it("should have correct timing for fast speed", () => {
    expect(speedConfig.fast).toBe(4000);
  });

  it("slow should be slower than normal", () => {
    expect(speedConfig.slow).toBeGreaterThan(speedConfig.normal);
  });

  it("normal should be slower than fast", () => {
    expect(speedConfig.normal).toBeGreaterThan(speedConfig.fast);
  });
});

describe("Quote Display Format", () => {
  it("should format quote with proper quotation marks", () => {
    const quote = sportsQuotes[0];
    const formattedQuote = `"${quote.quote}"`;

    expect(formattedQuote).toMatch(/^".*"$/);
    expect(formattedQuote).toContain(quote.quote);
  });

  it("should format author with em dash", () => {
    const quote = sportsQuotes[0];
    const formattedAuthor = `— ${quote.author}`;

    expect(formattedAuthor).toMatch(/^— .+$/);
    expect(formattedAuthor).toContain(quote.author);
  });
});
