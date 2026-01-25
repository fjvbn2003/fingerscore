"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type NotificationType = "match" | "message" | "system" | "achievement" | "invite";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock initial notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "매칭 요청",
    message: "김탁구님이 연습 경기를 요청했습니다",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionUrl: "/matching",
    avatar: "KT",
  },
  {
    id: "2",
    type: "achievement",
    title: "업적 달성!",
    message: "첫 승리 달성! 축하합니다! 🎉",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "invite",
    title: "대회 초대",
    message: "서울 아마추어 탁구 대회에 초대되었습니다",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/tournaments",
  },
  {
    id: "4",
    type: "message",
    title: "새 메시지",
    message: "이스핀님: 내일 3시에 괜찮으세요?",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    avatar: "IS",
  },
  {
    id: "5",
    type: "system",
    title: "시스템 알림",
    message: "프로필 정보를 업데이트해주세요",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/profile",
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulate receiving notifications periodically (for demo)
  useEffect(() => {
    const demoNotifications = [
      {
        type: "match" as NotificationType,
        title: "경기 결과",
        message: "최근 경기 결과가 기록되었습니다",
      },
      {
        type: "message" as NotificationType,
        title: "새 댓글",
        message: "회원님의 게시글에 새 댓글이 달렸습니다",
      },
    ];

    // Random notification every 2-5 minutes (for demo purposes)
    const interval = setInterval(
      () => {
        const shouldNotify = Math.random() > 0.7; // 30% chance
        if (shouldNotify) {
          const randomNotif =
            demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
          addNotification(randomNotif);
        }
      },
      2 * 60 * 1000
    ); // Check every 2 minutes

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
