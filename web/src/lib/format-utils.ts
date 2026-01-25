/**
 * Format utilities for dates, numbers, and text
 */

/**
 * Get relative time parts for translation
 * Returns an object with the translation key and values
 */
export function getRelativeTimeParts(dateString: string): {
  key: string;
  values?: Record<string, number>;
  fallbackDate?: string;
} {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return { key: "community.time.justNow" };
  }
  if (diffInSeconds < 3600) {
    return {
      key: "community.time.minutesAgo",
      values: { minutes: Math.floor(diffInSeconds / 60) },
    };
  }
  if (diffInSeconds < 86400) {
    return {
      key: "community.time.hoursAgo",
      values: { hours: Math.floor(diffInSeconds / 3600) },
    };
  }
  if (diffInSeconds < 604800) {
    return {
      key: "community.time.daysAgo",
      values: { days: Math.floor(diffInSeconds / 86400) },
    };
  }

  // Return fallback date for display
  return {
    key: "",
    fallbackDate: date.toLocaleDateString(),
  };
}

/**
 * Format a number with locale-specific formatting
 */
export function formatNumber(num: number, locale: string = "ko-KR"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
