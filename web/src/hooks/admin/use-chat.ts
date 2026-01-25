"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useClub } from "./use-club";
import { useAuth } from "@/contexts/auth-context";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatRoom {
  id: string;
  club_a_id: string;
  club_b_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count_a: number;
  unread_count_b: number;
  created_at: string;
  // Joined data
  club_a?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  club_b?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_club_id: string;
  content: string;
  message_type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  file_url: string | null;
  is_read: boolean;
  created_at: string;
  // Joined data
  sender?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

interface UseChatReturn {
  rooms: ChatRoom[];
  isLoadingRooms: boolean;
  selectedRoom: ChatRoom | null;
  selectRoom: (room: ChatRoom | null) => void;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  sendMessage: (content: string, type?: ChatMessage["message_type"]) => Promise<{ success: boolean; error?: Error }>;
  markAsRead: () => Promise<void>;
  // 채팅방 생성 (교류전 매칭 시)
  createOrGetRoom: (otherClubId: string) => Promise<{ room: ChatRoom | null; error?: Error }>;
  // 전체 안 읽은 메시지 수
  totalUnreadCount: number;
  refetchRooms: () => Promise<void>;
}

/**
 * 클럽 간 채팅 관리 훅
 */
export function useChat(): UseChatReturn {
  const { club } = useClub();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 채팅방 목록 조회
  const fetchRooms = useCallback(async () => {
    if (!club?.id) {
      setRooms([]);
      setIsLoadingRooms(false);
      return;
    }

    try {
      setIsLoadingRooms(true);

      const { data, error: fetchError } = await supabase
        .from("chat_rooms")
        .select(
          `
          *,
          club_a:clubs!chat_rooms_club_a_id_fkey (
            id,
            name,
            logo_url
          ),
          club_b:clubs!chat_rooms_club_b_id_fkey (
            id,
            name,
            logo_url
          )
        `
        )
        .or(`club_a_id.eq.${club.id},club_b_id.eq.${club.id}`)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (fetchError) throw fetchError;

      const roomsData = (data as ChatRoom[]) || [];
      setRooms(roomsData);

      // 총 안 읽은 메시지 수 계산
      const unread = roomsData.reduce((sum, room) => {
        const isClubA = room.club_a_id === club.id;
        return sum + (isClubA ? room.unread_count_a : room.unread_count_b);
      }, 0);
      setTotalUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch chat rooms:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [club?.id, supabase]);

  // 메시지 목록 조회
  const fetchMessages = useCallback(async () => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    try {
      setIsLoadingMessages(true);

      const { data, error: fetchError } = await supabase
        .from("chat_messages")
        .select(
          `
          *,
          sender:profiles!chat_messages_sender_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `
        )
        .eq("room_id", selectedRoom.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [selectedRoom, supabase]);

  // 메시지 전송
  const sendMessage = useCallback(
    async (
      content: string,
      type: ChatMessage["message_type"] = "TEXT"
    ): Promise<{ success: boolean; error?: Error }> => {
      if (!selectedRoom || !user || !club?.id) {
        return { success: false, error: new Error("채팅방 또는 사용자 정보가 없습니다.") };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any).from("chat_messages").insert({
          room_id: selectedRoom.id,
          sender_id: user.id,
          sender_club_id: club.id,
          content,
          message_type: type,
          is_read: false,
        });

        if (insertError) throw insertError;

        // 채팅방 마지막 메시지 업데이트
        const isClubA = selectedRoom.club_a_id === club.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: roomError } = await (supabase as any)
          .from("chat_rooms")
          .update({
            last_message: content,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", selectedRoom.id);

        if (roomError) throw roomError;

        return { success: true };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("메시지 전송에 실패했습니다.");
        return { success: false, error };
      }
    },
    [selectedRoom, user, club?.id, supabase]
  );

  // 메시지 읽음 처리
  const markAsRead = useCallback(async () => {
    if (!selectedRoom || !club?.id) return;

    try {
      const isClubA = selectedRoom.club_a_id === club.id;

      // 해당 방의 읽지 않은 메시지들 읽음 처리
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("chat_messages")
        .update({ is_read: true })
        .eq("room_id", selectedRoom.id)
        .neq("sender_club_id", club.id);

      // 채팅방의 안 읽은 메시지 수 초기화
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("chat_rooms")
        .update({
          [isClubA ? "unread_count_a" : "unread_count_b"]: 0,
        })
        .eq("id", selectedRoom.id);

      // 목록 새로고침
      await fetchRooms();
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  }, [selectedRoom, club?.id, supabase, fetchRooms]);

  // 채팅방 생성 또는 조회
  const createOrGetRoom = useCallback(
    async (
      otherClubId: string
    ): Promise<{ room: ChatRoom | null; error?: Error }> => {
      if (!club?.id) {
        return { room: null, error: new Error("클럽 정보가 없습니다.") };
      }

      try {
        // 기존 채팅방 확인
        const { data: existingRoom } = await supabase
          .from("chat_rooms")
          .select(
            `
            *,
            club_a:clubs!chat_rooms_club_a_id_fkey (id, name, logo_url),
            club_b:clubs!chat_rooms_club_b_id_fkey (id, name, logo_url)
          `
          )
          .or(
            `and(club_a_id.eq.${club.id},club_b_id.eq.${otherClubId}),and(club_a_id.eq.${otherClubId},club_b_id.eq.${club.id})`
          )
          .single();

        if (existingRoom) {
          return { room: existingRoom as ChatRoom };
        }

        // 새 채팅방 생성
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newRoom, error: insertError } = await (supabase as any)
          .from("chat_rooms")
          .insert({
            club_a_id: club.id,
            club_b_id: otherClubId,
            unread_count_a: 0,
            unread_count_b: 0,
          })
          .select(
            `
            *,
            club_a:clubs!chat_rooms_club_a_id_fkey (id, name, logo_url),
            club_b:clubs!chat_rooms_club_b_id_fkey (id, name, logo_url)
          `
          )
          .single();

        if (insertError) throw insertError;

        await fetchRooms();
        return { room: newRoom as ChatRoom };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("채팅방 생성에 실패했습니다.");
        return { room: null, error };
      }
    },
    [club?.id, supabase, fetchRooms]
  );

  // 채팅방 선택
  const selectRoom = useCallback(
    (room: ChatRoom | null) => {
      setSelectedRoom(room);
      if (room) {
        // 약간의 딜레이 후 읽음 처리
        setTimeout(() => markAsRead(), 500);
      }
    },
    [markAsRead]
  );

  // 실시간 메시지 구독
  useEffect(() => {
    if (!selectedRoom) return;

    // 이전 구독 해제
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // 새 구독 설정
    const channel = supabase
      .channel(`room-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        async (payload) => {
          // 새 메시지 추가
          const newMessage = payload.new as ChatMessage;

          // sender 정보 조회
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .eq("id", newMessage.sender_id)
            .single();

          setMessages((prev) => [...prev, { ...newMessage, sender: sender || undefined }]);

          // 내가 보낸 메시지가 아니면 읽음 처리
          if (newMessage.sender_club_id !== club?.id) {
            markAsRead();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom, club?.id, supabase, markAsRead]);

  // 초기 로드
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 선택된 방 변경 시 메시지 로드
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    rooms,
    isLoadingRooms,
    selectedRoom,
    selectRoom,
    messages,
    isLoadingMessages,
    sendMessage,
    markAsRead,
    createOrGetRoom,
    totalUnreadCount,
    refetchRooms: fetchRooms,
  };
}
