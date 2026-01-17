"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  MessageSquare,
  Trophy,
  Wrench,
  Lightbulb,
  Search,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Pin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BoardType } from "@/types/database";

const boardTypes: {
  type: BoardType;
  icon: typeof MessageSquare;
  color: string;
}[] = [
  { type: "FREE", icon: MessageSquare, color: "text-gray-500" },
  { type: "TOURNAMENT_REVIEW", icon: Trophy, color: "text-yellow-500" },
  { type: "EQUIPMENT_REVIEW", icon: Wrench, color: "text-blue-500" },
  { type: "TIPS", icon: Lightbulb, color: "text-green-500" },
];

const mockPosts = [
  {
    id: "1",
    board_type: "FREE" as BoardType,
    title: "오늘 탁구장에서 있었던 일",
    content:
      "오늘 동네 탁구장에서 3시간 동안 연습했는데 실력이 느는 것 같아서 기분이 좋네요!",
    author: { id: "u1", display_name: "탁구러버", avatar_url: null },
    view_count: 156,
    like_count: 12,
    comment_count: 5,
    is_pinned: false,
    created_at: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    board_type: "TOURNAMENT_REVIEW" as BoardType,
    title: "[후기] 서울 오픈 대회 참가 후기",
    content:
      "지난 주말 서울 오픈 대회에 처음 참가했습니다. 긴장되었지만 좋은 경험이었어요.",
    author: { id: "u2", display_name: "대회마스터", avatar_url: null },
    view_count: 342,
    like_count: 45,
    comment_count: 23,
    is_pinned: true,
    created_at: "2024-01-19T15:20:00Z",
  },
  {
    id: "3",
    board_type: "EQUIPMENT_REVIEW" as BoardType,
    title: "[리뷰] 버터플라이 테너지 05 사용기",
    content:
      "3개월간 테너지 05를 사용해봤습니다. 스핀과 스피드 모두 만족스러운 러버입니다.",
    author: { id: "u3", display_name: "장비매니아", avatar_url: null },
    view_count: 567,
    like_count: 78,
    comment_count: 34,
    is_pinned: false,
    created_at: "2024-01-18T09:15:00Z",
  },
  {
    id: "4",
    board_type: "TIPS" as BoardType,
    title: "[팁] 백핸드 드라이브 잘 치는 방법",
    content:
      "백핸드 드라이브가 어려우신 분들을 위한 팁을 공유합니다. 가장 중요한 것은...",
    author: { id: "u4", display_name: "코치님", avatar_url: null },
    view_count: 892,
    like_count: 134,
    comment_count: 56,
    is_pinned: true,
    created_at: "2024-01-17T14:00:00Z",
  },
  {
    id: "5",
    board_type: "FREE" as BoardType,
    title: "같이 탁구 치실 분 구합니다 (서울 강남)",
    content:
      "주말에 강남역 근처에서 탁구 치실 분 구합니다. 실력 무관, 즐겁게 치실 분이면 좋겠습니다!",
    author: { id: "u5", display_name: "탁구친구", avatar_url: null },
    view_count: 234,
    like_count: 8,
    comment_count: 12,
    is_pinned: false,
    created_at: "2024-01-20T08:00:00Z",
  },
];

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export default function CommunityPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBoard, setActiveBoard] = useState<BoardType | "all">("all");

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBoard =
      activeBoard === "all" || post.board_type === activeBoard;
    return matchesSearch && matchesBoard;
  });

  // Sort: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="container max-w-screen-xl py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("community.title")}</h1>
          <p className="mt-1 text-muted-foreground">
            탁구에 대한 이야기를 나눠보세요
          </p>
        </div>
        <Button asChild>
          <Link href="/community/write">
            <Plus className="mr-2 h-4 w-4" />
            {t("community.writePost")}
          </Link>
        </Button>
      </div>

      {/* Board Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {boardTypes.map((board) => {
          const Icon = board.icon;
          const postCount = mockPosts.filter(
            (p) => p.board_type === board.type
          ).length;
          return (
            <Card
              key={board.type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeBoard === board.type ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setActiveBoard(activeBoard === board.type ? "all" : board.type)
              }
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${board.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {t(`community.boards.${board.type.toLowerCase()}`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {postCount}개의 글
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="게시글 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Posts List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {sortedPosts.map((post) => {
              const boardType = boardTypes.find(
                (b) => b.type === post.board_type
              );
              const Icon = boardType?.icon || MessageSquare;

              return (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="flex gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ${boardType?.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      {post.is_pinned && (
                        <Pin className="h-3 w-3 text-primary" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {t(`community.boards.${post.board_type.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <h3 className="font-medium line-clamp-1">{post.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {post.content}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[10px]">
                            {post.author.display_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author.display_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.like_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comment_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
