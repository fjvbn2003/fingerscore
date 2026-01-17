"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  MessageSquare,
  Search,
  Send,
  Building2,
  MoreVertical,
  Phone,
  MapPin,
  Image,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data
const mockChatRooms = [
  {
    id: "room-1",
    otherClub: {
      id: "club-1",
      name: "강남 탁구클럽",
      logo: null,
      location: "서울 강남구",
    },
    lastMessage: {
      content: "네, 그럼 28일에 뵙겠습니다!",
      timestamp: "2024-01-18T14:30:00",
      isRead: true,
      senderId: "my-club",
    },
    unreadCount: 0,
  },
  {
    id: "room-2",
    otherClub: {
      id: "club-2",
      name: "송파 탁구사랑",
      logo: null,
      location: "서울 송파구",
    },
    lastMessage: {
      content: "교류전 제안 감사합니다. 일정 조율 부탁드립니다.",
      timestamp: "2024-01-18T10:15:00",
      isRead: false,
      senderId: "club-2",
    },
    unreadCount: 2,
  },
  {
    id: "room-3",
    otherClub: {
      id: "club-3",
      name: "용산 탁구동호회",
      logo: null,
      location: "서울 용산구",
    },
    lastMessage: {
      content: "지난 교류전 즐거웠습니다. 다음에 또 뵙겠습니다!",
      timestamp: "2024-01-15T18:45:00",
      isRead: true,
      senderId: "club-3",
    },
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Array<{
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}>> = {
  "room-1": [
    { id: "1", senderId: "club-1", content: "안녕하세요! 1월 교류전 일정 논의하고 싶습니다.", timestamp: "2024-01-17T09:00:00", isRead: true },
    { id: "2", senderId: "my-club", content: "네, 안녕하세요! 어떤 날짜가 좋으실까요?", timestamp: "2024-01-17T09:15:00", isRead: true },
    { id: "3", senderId: "club-1", content: "1월 28일 토요일 오후 2시는 어떠세요?", timestamp: "2024-01-17T09:30:00", isRead: true },
    { id: "4", senderId: "my-club", content: "좋습니다! 저희 클럽에서 진행하면 될까요?", timestamp: "2024-01-17T10:00:00", isRead: true },
    { id: "5", senderId: "club-1", content: "네, 그렇게 하죠. 참가 인원은 10명 정도로 생각하고 있습니다.", timestamp: "2024-01-17T10:30:00", isRead: true },
    { id: "6", senderId: "my-club", content: "알겠습니다. 그럼 교류전 제안 올리겠습니다.", timestamp: "2024-01-17T11:00:00", isRead: true },
    { id: "7", senderId: "club-1", content: "감사합니다! 제안 수락했습니다.", timestamp: "2024-01-18T09:00:00", isRead: true },
    { id: "8", senderId: "my-club", content: "네, 그럼 28일에 뵙겠습니다!", timestamp: "2024-01-18T14:30:00", isRead: true },
  ],
  "room-2": [
    { id: "1", senderId: "club-2", content: "안녕하세요, 서초 탁구클럽입니다!", timestamp: "2024-01-18T10:00:00", isRead: true },
    { id: "2", senderId: "club-2", content: "교류전 제안 감사합니다. 일정 조율 부탁드립니다.", timestamp: "2024-01-18T10:15:00", isRead: false },
  ],
  "room-3": [
    { id: "1", senderId: "my-club", content: "지난 교류전 수고하셨습니다!", timestamp: "2024-01-15T18:00:00", isRead: true },
    { id: "2", senderId: "club-3", content: "지난 교류전 즐거웠습니다. 다음에 또 뵙겠습니다!", timestamp: "2024-01-15T18:45:00", isRead: true },
  ],
};

export default function ChatPage() {
  const t = useTranslations("admin");
  const [selectedRoom, setSelectedRoom] = useState<string | null>("room-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredRooms = mockChatRooms.filter((room) =>
    room.otherClub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRoom = mockChatRooms.find((r) => r.id === selectedRoom);
  const messages = selectedRoom ? mockMessages[selectedRoom] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date(2024, 0, 18);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "오늘";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "어제";
    }
    return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In real app, send message to server
    console.log("Send message:", message);
    setMessage("");
  };

  const totalUnread = mockChatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Chat List */}
        <Card className="glass-card border-white/5 lg:w-96 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                {t("chat.title")}
                {totalUnread > 0 && (
                  <Badge className="bg-red-500 text-white">{totalUnread}</Badge>
                )}
              </h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="탁구장 검색..."
                className="pl-10 glass border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                    selectedRoom === room.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                      : "hover:bg-white/5"
                  )}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={room.otherClub.logo || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {room.otherClub.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{room.otherClub.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(room.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage.senderId === "my-club" && "나: "}
                        {room.lastMessage.content}
                      </p>
                      {room.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {filteredRooms.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">대화가 없습니다</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="glass-card border-white/5 flex-1 flex flex-col">
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentRoom.otherClub.logo || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {currentRoom.otherClub.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentRoom.otherClub.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {currentRoom.otherClub.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-white/5">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/5">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10">
                      <DropdownMenuItem className="cursor-pointer">
                        <Building2 className="h-4 w-4 mr-2" />
                        탁구장 정보
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        교류전 제안하기
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-400">
                        대화방 나가기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isMe = msg.senderId === "my-club";
                    const showDate =
                      index === 0 ||
                      formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 rounded-full glass text-xs text-muted-foreground">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              isMe
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                : "glass border border-white/10"
                            )}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1 mt-1",
                                isMe ? "text-white/70" : "text-muted-foreground"
                              )}
                            >
                              <span className="text-xs">{formatTime(msg.timestamp)}</span>
                              {isMe && (
                                msg.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-white/5 flex-shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-white/5 flex-shrink-0">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={t("chat.typePlaceholder")}
                    className="glass border-white/10"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="hover:bg-white/5 flex-shrink-0">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mb-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">대화를 선택하세요</h3>
              <p className="text-sm text-muted-foreground">
                왼쪽 목록에서 대화할 탁구장을 선택하세요
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
