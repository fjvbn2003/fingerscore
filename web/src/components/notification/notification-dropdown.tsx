"use client";

import { useState } from "react";
import {
  Bell,
  Trophy,
  MessageCircle,
  Calendar,
  UserPlus,
  CheckCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface Notification {
  id: string;
  type: "MATCH_START" | "MATCH_RESULT" | "TOURNAMENT_UPDATE" | "COMMENT" | "LIKE" | "FOLLOW" | "SYSTEM";
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "MATCH_START",
    title: "경기 시작 알림",
    body: "2024 서울 오픈 대회 8강전이 10분 후 시작됩니다.",
    is_read: false,
    created_at: "2024-01-18T10:00:00Z",
    link: "/tournaments/1",
  },
  {
    id: "2",
    type: "COMMENT",
    title: "새 댓글",
    body: '탁구마스터님이 "새로운 라켓 구매 고민" 게시글에 댓글을 남겼습니다.',
    is_read: false,
    created_at: "2024-01-18T09:30:00Z",
    link: "/community/1",
  },
  {
    id: "3",
    type: "MATCH_RESULT",
    title: "경기 결과",
    body: "8강전에서 승리하셨습니다! 다음 경기는 4강전입니다.",
    is_read: true,
    created_at: "2024-01-17T18:00:00Z",
    link: "/tournaments/1",
  },
  {
    id: "4",
    type: "TOURNAMENT_UPDATE",
    title: "대회 일정 변경",
    body: "2024 서울 오픈 대회 일정이 변경되었습니다.",
    is_read: true,
    created_at: "2024-01-17T14:00:00Z",
    link: "/tournaments/1",
  },
  {
    id: "5",
    type: "LIKE",
    title: "좋아요",
    body: '프로지망생님이 "장비 리뷰" 게시글에 좋아요를 눌렀습니다.',
    is_read: true,
    created_at: "2024-01-16T20:00:00Z",
    link: "/community/2",
  },
];

const notificationIcons: Record<string, typeof Trophy> = {
  MATCH_START: Calendar,
  MATCH_RESULT: Trophy,
  TOURNAMENT_UPDATE: Calendar,
  COMMENT: MessageCircle,
  LIKE: Trophy,
  FOLLOW: UserPlus,
  SYSTEM: Bell,
};

const notificationColors: Record<string, string> = {
  MATCH_START: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  MATCH_RESULT: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
  TOURNAMENT_UPDATE: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  COMMENT: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
  LIKE: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
  FOLLOW: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400",
  SYSTEM: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>알림</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              모두 읽음
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          <DropdownMenuGroup>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  알림이 없습니다
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex gap-3 p-3 cursor-pointer",
                      !notification.is_read && "bg-muted/50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                    asChild
                  >
                    <Link href={notification.link || "#"}>
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          notificationColors[notification.type]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuGroup>
        </ScrollArea>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link href="/settings/notifications" className="text-sm">
            <Settings className="mr-2 h-4 w-4" />
            알림 설정
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
