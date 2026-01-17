/**
 * Security Utilities for FingerScore
 * 보안 관련 유틸리티 모음
 */

import DOMPurify from "isomorphic-dompurify";

// === Input Sanitization ===

/**
 * HTML 태그 제거 및 XSS 방지
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

/**
 * 일반 텍스트 sanitization (HTML 완전 제거)
 */
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * SQL Injection 방지를 위한 특수문자 이스케이프
 * (Supabase는 자체적으로 처리하지만, 추가 안전장치)
 */
export function escapeSqlChars(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/;/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "");
}

/**
 * 파일명 sanitization
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9가-힣._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 255);
}

// === Rate Limiting (Client-side) ===

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Rate Limiter 체크
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetAt - now,
  };
}

// === CSRF Protection ===

/**
 * CSRF 토큰 생성
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * CSRF 토큰 검증
 */
export function validateCsrfToken(
  token: string,
  expectedToken: string
): boolean {
  if (!token || !expectedToken) return false;
  if (token.length !== expectedToken.length) return false;

  // Timing-safe comparison
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  return result === 0;
}

// === Password Validation ===

export interface PasswordStrength {
  score: number; // 0-4
  label: "매우 약함" | "약함" | "보통" | "강함" | "매우 강함";
  suggestions: string[];
}

/**
 * 비밀번호 강도 체크
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score++;
  else suggestions.push("8자 이상 입력하세요");

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else suggestions.push("대소문자를 혼합하세요");

  if (/\d/.test(password)) score++;
  else suggestions.push("숫자를 포함하세요");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else suggestions.push("특수문자를 포함하세요");

  // 연속 문자 체크
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    suggestions.push("연속된 같은 문자 사용을 피하세요");
  }

  // 일반적인 패턴 체크
  const commonPatterns = [
    "123456",
    "password",
    "qwerty",
    "abc123",
    "111111",
  ];
  if (commonPatterns.some((p) => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 1);
    suggestions.push("흔한 비밀번호 패턴을 피하세요");
  }

  const labels: PasswordStrength["label"][] = [
    "매우 약함",
    "약함",
    "보통",
    "강함",
    "매우 강함",
  ];

  return {
    score: Math.min(4, Math.max(0, score)),
    label: labels[Math.min(4, Math.max(0, score))],
    suggestions: suggestions.slice(0, 3),
  };
}

// === URL Validation ===

/**
 * 안전한 URL인지 확인
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * 리다이렉트 URL 검증 (Open Redirect 방지)
 */
export function isValidRedirectUrl(
  urlString: string,
  allowedDomains: string[]
): boolean {
  try {
    const url = new URL(urlString, window.location.origin);

    // 상대 경로는 허용
    if (urlString.startsWith("/") && !urlString.startsWith("//")) {
      return true;
    }

    // 허용된 도메인만 허용
    return allowedDomains.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// === Content Security ===

/**
 * 이미지 파일 검증
 */
export function isValidImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "허용되지 않는 파일 형식입니다 (JPG, PNG, GIF, WebP만 가능)",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "파일 크기는 5MB 이하여야 합니다" };
  }

  return { valid: true };
}

// === Session Security ===

/**
 * 세션 만료 시간 확인
 */
export function isSessionExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt * 1000;
}

/**
 * 세션 갱신 필요 여부 (만료 5분 전)
 */
export function shouldRefreshSession(expiresAt: number): boolean {
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() > expiresAt * 1000 - fiveMinutes;
}

// === Audit Logging ===

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "SIGNUP"
  | "PASSWORD_CHANGE"
  | "PROFILE_UPDATE"
  | "TOURNAMENT_CREATE"
  | "TOURNAMENT_JOIN"
  | "SCORE_SUBMIT"
  | "SCORE_APPROVE"
  | "POST_CREATE"
  | "POST_DELETE"
  | "ADMIN_ACTION";

export interface AuditLogEntry {
  action: AuditAction;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * 감사 로그 생성
 */
export function createAuditLog(
  action: AuditAction,
  userId: string,
  details?: Record<string, unknown>
): AuditLogEntry {
  return {
    action,
    userId,
    userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
    details,
    timestamp: new Date().toISOString(),
  };
}

// === Permission & Role Based Access Control ===

export type UserRole = "USER" | "MODERATOR" | "ORGANIZER" | "ADMIN";

export interface Permission {
  action: string;
  resource: string;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: [
    { action: "read", resource: "tournament" },
    { action: "join", resource: "tournament" },
    { action: "create", resource: "post" },
    { action: "read", resource: "post" },
    { action: "submit", resource: "score" },
  ],
  MODERATOR: [
    { action: "read", resource: "tournament" },
    { action: "join", resource: "tournament" },
    { action: "create", resource: "post" },
    { action: "read", resource: "post" },
    { action: "delete", resource: "post" },
    { action: "submit", resource: "score" },
    { action: "moderate", resource: "comment" },
  ],
  ORGANIZER: [
    { action: "read", resource: "tournament" },
    { action: "create", resource: "tournament" },
    { action: "update", resource: "tournament" },
    { action: "join", resource: "tournament" },
    { action: "create", resource: "post" },
    { action: "read", resource: "post" },
    { action: "submit", resource: "score" },
    { action: "approve", resource: "score" },
    { action: "manage", resource: "bracket" },
  ],
  ADMIN: [
    { action: "*", resource: "*" }, // 모든 권한
  ],
};

/**
 * 권한 확인
 */
export function hasPermission(
  role: UserRole,
  action: string,
  resource: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  return permissions.some(
    (p) =>
      (p.action === "*" || p.action === action) &&
      (p.resource === "*" || p.resource === resource)
  );
}

/**
 * 역할 계층 확인
 */
export function isRoleAtLeast(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  const hierarchy: UserRole[] = ["USER", "MODERATOR", "ORGANIZER", "ADMIN"];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
