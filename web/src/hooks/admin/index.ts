// Admin 권한 관리
export { useAdminAuth, useSystemAuth, canAccessAdminMenu, hasRole } from "./use-admin-auth";
// UserRole is re-exported from @/types/database within use-admin-auth

// 클럽 관리
export { useClub, useClubById } from "./use-club";
export type { Club, ClubFormData } from "./use-club";

// 회원 관리
export { useMembers } from "./use-members";
export type { ClubMember, MemberFormData, MemberFilters, MemberStats } from "./use-members";

// 레슨 관리
export { useLessons } from "./use-lessons";
export type {
  Lesson,
  LessonParticipant,
  LessonFormData,
  LessonFilters,
  LessonStats,
} from "./use-lessons";

// 결제 관리
export { usePayments } from "./use-payments";
export type { Payment, PaymentFormData, PaymentFilters, PaymentStats } from "./use-payments";

// 코치 관리
export { useCoaches } from "./use-coaches";
export type { Coach, CoachFormData, CoachFilters, CoachStats } from "./use-coaches";

// 교류전 관리
export { useExchangeMatches } from "./use-exchange-matches";
export type {
  ExchangeMatch,
  ExchangeMatchFormData,
  ExchangeMatchFilters,
  ExchangeMatchStats,
} from "./use-exchange-matches";

// 채팅
export { useChat } from "./use-chat";
export type { ChatRoom, ChatMessage } from "./use-chat";

// 대시보드
export { useDashboard } from "./use-dashboard";
export type { DashboardStats, RecentActivity, UpcomingEvent } from "./use-dashboard";

// ADMIN 전용 - 전체 사용자 관리
export { useAllUsers } from "./use-all-users";
export type { SystemUser, UserFilters, UserStats } from "./use-all-users";

// ADMIN 전용 - 전체 클럽 관리
export { useAllClubs } from "./use-all-clubs";
export type { SystemClub, ClubFilters, ClubStats } from "./use-all-clubs";
