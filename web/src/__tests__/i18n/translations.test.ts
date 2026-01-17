import { describe, it, expect } from "vitest";
import ko from "@/i18n/ko.json";
import en from "@/i18n/en.json";
import { locales, defaultLocale, localeNames } from "@/i18n/config";

describe("i18n Configuration", () => {
  it("has correct default locale", () => {
    expect(defaultLocale).toBe("ko");
  });

  it("has all supported locales", () => {
    expect(locales).toContain("ko");
    expect(locales).toContain("en");
    expect(locales).toContain("ja");
    expect(locales).toContain("zh");
  });

  it("has locale names for all locales", () => {
    expect(localeNames.ko).toBe("한국어");
    expect(localeNames.en).toBe("English");
    expect(localeNames.ja).toBe("日本語");
    expect(localeNames.zh).toBe("简体中文");
  });
});

describe("Translation Files", () => {
  it("Korean translations have all required keys", () => {
    expect(ko.common).toBeDefined();
    expect(ko.nav).toBeDefined();
    expect(ko.home).toBeDefined();
    expect(ko.auth).toBeDefined();
    expect(ko.tournaments).toBeDefined();
    expect(ko.match).toBeDefined();
    expect(ko.community).toBeDefined();
    expect(ko.rankings).toBeDefined();
    expect(ko.live).toBeDefined();
    expect(ko.profile).toBeDefined();
    expect(ko.settings).toBeDefined();
    expect(ko.footer).toBeDefined();
  });

  it("English translations have all required keys", () => {
    expect(en.common).toBeDefined();
    expect(en.nav).toBeDefined();
    expect(en.home).toBeDefined();
    expect(en.auth).toBeDefined();
    expect(en.tournaments).toBeDefined();
    expect(en.match).toBeDefined();
    expect(en.community).toBeDefined();
    expect(en.rankings).toBeDefined();
    expect(en.live).toBeDefined();
    expect(en.profile).toBeDefined();
    expect(en.settings).toBeDefined();
    expect(en.footer).toBeDefined();
  });

  it("Korean and English have matching structure", () => {
    const koKeys = Object.keys(ko);
    const enKeys = Object.keys(en);

    expect(koKeys.sort()).toEqual(enKeys.sort());
  });

  it("navigation translations are complete", () => {
    expect(ko.nav.tournaments).toBe("대회");
    expect(ko.nav.community).toBe("커뮤니티");
    expect(ko.nav.rankings).toBe("랭킹");
    expect(ko.nav.live).toBe("라이브");

    expect(en.nav.tournaments).toBe("Tournaments");
    expect(en.nav.community).toBe("Community");
    expect(en.nav.rankings).toBe("Rankings");
    expect(en.nav.live).toBe("Live");
  });

  it("sport types are translated", () => {
    expect(ko.tournaments.sportType.TABLE_TENNIS).toBe("탁구");
    expect(ko.tournaments.sportType.TENNIS).toBe("테니스");
    expect(ko.tournaments.sportType.BADMINTON).toBe("배드민턴");

    expect(en.tournaments.sportType.TABLE_TENNIS).toBe("Table Tennis");
    expect(en.tournaments.sportType.TENNIS).toBe("Tennis");
    expect(en.tournaments.sportType.BADMINTON).toBe("Badminton");
  });
});
