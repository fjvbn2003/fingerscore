"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Loader2,
  Flag,
  Edit,
  Trash2,
  Clock,
  Eye,
  Award,
  ThumbsUp,
  Laugh,
  Flame,
  Lightbulb,
  PartyPopper,
  Crown,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

// Reaction types
const REACTIONS = [
  { id: "like", emoji: "👍", label: "좋아요" },
  { id: "love", emoji: "❤️", label: "최고" },
  { id: "haha", emoji: "😂", label: "웃겨요" },
  { id: "wow", emoji: "😮", label: "놀라워요" },
  { id: "fire", emoji: "🔥", label: "불타오르네" },
  { id: "idea", emoji: "💡", label: "도움됐어요" },
] as const;

// Quick reply options
const QUICK_REPLIES = [
  "동의합니다! 👍",
  "좋은 정보 감사합니다!",
  "저도 궁금했어요",
  "추천 감사합니다 🙏",
  "도움이 많이 됐어요!",
];

// Mock data with more engagement features
const mockPost = {
  id: "1",
  title: "새로운 라켓 구매 고민 중입니다",
  content: `안녕하세요, 탁구를 시작한 지 6개월 된 초보입니다.

현재 사용하고 있는 라켓이 너무 무겁고 컨트롤이 어려워서 새로운 라켓을 구매하려고 합니다.

예산은 10~15만원 정도이고, 컨트롤 위주의 플레이를 좋아합니다.

추천해주실 라켓이 있을까요?

참고로 현재 사용 중인 러버는 테너지 05입니다.

조언 부탁드립니다!`,
  board_type: "EQUIPMENT_REVIEW",
  author: {
    id: "u1",
    display_name: "탁구초보",
    avatar_url: null,
    level: 3,
    badge: null,
    post_count: 12,
  },
  view_count: 1283,
  like_count: 89,
  comment_count: 23,
  is_liked: false,
  is_bookmarked: false,
  reactions: {
    like: 45,
    love: 23,
    haha: 5,
    wow: 8,
    fire: 3,
    idea: 12,
  },
  user_reaction: null as string | null,
  created_at: "2024-01-18T10:30:00Z",
  updated_at: "2024-01-18T10:30:00Z",
  tags: ["라켓추천", "초보", "장비상담"],
};

type CommentReply = {
  id: string;
  content: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: null;
    level: number;
    badge: string | null;
    is_author: boolean;
  };
  like_count: number;
  is_liked: boolean;
  created_at: string;
};

type Comment = {
  id: string;
  content: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: null;
    level: number;
    badge: string | null;
    is_author: boolean;
  };
  like_count: number;
  is_liked: boolean;
  is_best: boolean;
  created_at: string;
  replies: CommentReply[];
};

const mockComments: Comment[] = [
  {
    id: "c1",
    content:
      "버터플라이 비스카리아 추천드려요! 컨트롤 좋고 가격대도 맞을 것 같습니다. 저도 처음에 이거로 시작했는데 아직까지 쓰고 있어요 👍",
    author: {
      id: "u2",
      display_name: "탁구마스터",
      avatar_url: null,
      level: 15,
      badge: "expert",
      is_author: false,
    },
    like_count: 42,
    is_liked: false,
    is_best: true,
    created_at: "2024-01-18T11:00:00Z",
    replies: [
      {
        id: "c1-1",
        content: "비스카리아 좋은 선택이에요! 저도 쓰고 있는데 만족합니다.",
        author: {
          id: "u3",
          display_name: "프로지망생",
          avatar_url: null,
          level: 8,
          badge: null,
          is_author: false,
        },
        like_count: 12,
        is_liked: false,
        created_at: "2024-01-18T11:30:00Z",
      },
      {
        id: "c1-2",
        content: "오 저도 비스카리아 고민중이었는데 참고할게요!",
        author: {
          id: "u1",
          display_name: "탁구초보",
          avatar_url: null,
          level: 3,
          badge: null,
          is_author: true,
        },
        like_count: 5,
        is_liked: false,
        created_at: "2024-01-18T11:45:00Z",
      },
    ],
  },
  {
    id: "c2",
    content:
      "초보자시라면 스틱가 티모볼 ALC도 좋은 선택입니다. 가볍고 컨트롤이 쉬워요. 다만 가격이 조금 높을 수 있어요.",
    author: {
      id: "u4",
      display_name: "장비덕후",
      avatar_url: null,
      level: 22,
      badge: "verified",
      is_author: false,
    },
    like_count: 28,
    is_liked: true,
    is_best: false,
    created_at: "2024-01-18T12:00:00Z",
    replies: [],
  },
  {
    id: "c3",
    content:
      "테너지 05 쓰시면 블레이드도 좀 빠른 걸로 하시는 게 좋을 것 같아요. 티모볼 ZLC 어떠세요? 제가 코칭하는 학생들한테 많이 추천하는 조합입니다.",
    author: {
      id: "u5",
      display_name: "김코치",
      avatar_url: null,
      level: 30,
      badge: "coach",
      is_author: false,
    },
    like_count: 67,
    is_liked: false,
    is_best: true,
    created_at: "2024-01-18T14:00:00Z",
    replies: [],
  },
];

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글 내용을 입력해주세요")
    .max(1000, "댓글은 1000자를 넘을 수 없습니다"),
});

type CommentFormData = z.infer<typeof commentSchema>;

// Badge component
function UserBadge({ badge }: { badge: string | null }) {
  if (!badge) return null;

  const badges: Record<
    string,
    { label: string; icon: typeof Award; color: string }
  > = {
    expert: {
      label: "전문가",
      icon: Award,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    verified: {
      label: "인증됨",
      icon: CheckCircle2,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    coach: {
      label: "코치",
      icon: Crown,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    top: {
      label: "TOP",
      icon: TrendingUp,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  };

  const badgeInfo = badges[badge];
  if (!badgeInfo) return null;

  const Icon = badgeInfo.icon;

  return (
    <Badge variant="outline" className={cn("text-xs gap-1", badgeInfo.color)}>
      <Icon className="h-3 w-3" />
      {badgeInfo.label}
    </Badge>
  );
}

// Level indicator
function UserLevel({ level }: { level: number }) {
  const getColor = () => {
    if (level >= 20) return "text-amber-400";
    if (level >= 10) return "text-purple-400";
    if (level >= 5) return "text-blue-400";
    return "text-slate-400";
  };

  return <span className={cn("text-xs font-medium", getColor())}>Lv.{level}</span>;
}

export default function PostDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const commentContent = watch("content");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReaction = (reactionId: string) => {
    setPost((prev) => {
      const newReactions = { ...prev.reactions };
      const prevReaction = prev.user_reaction;

      // Remove previous reaction if exists
      if (prevReaction && prevReaction in newReactions) {
        newReactions[prevReaction as keyof typeof newReactions]--;
      }

      // Add new reaction if different from previous
      if (prevReaction !== reactionId) {
        newReactions[reactionId as keyof typeof newReactions]++;
        return { ...prev, reactions: newReactions, user_reaction: reactionId };
      }

      return { ...prev, reactions: newReactions, user_reaction: null };
    });
    setShowReactions(false);
  };

  const handleBookmark = () => {
    setPost((prev) => ({
      ...prev,
      is_bookmarked: !prev.is_bookmarked,
    }));
    toast.success(
      post.is_bookmarked ? "북마크가 해제되었습니다" : "북마크에 추가되었습니다"
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("링크가 복사되었습니다");
      }
    } catch {
      // User cancelled share
    }
  };

  const handleQuickReply = (reply: string) => {
    setValue("content", reply);
    setShowQuickReplies(false);
  };

  const onSubmitComment = async (data: CommentFormData) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newComment: Comment = {
      id: `c${Date.now()}`,
      content: data.content,
      author: {
        id: user.id,
        display_name: user.email?.split("@")[0] || "익명",
        avatar_url: null,
        level: 1,
        badge: null,
        is_author: user.id === post.author.id,
      },
      like_count: 0,
      is_liked: false,
      is_best: false,
      created_at: new Date().toISOString(),
      replies: [],
    };

    if (replyTo) {
      const newReply: CommentReply = {
        id: `${replyTo}-${Date.now()}`,
        content: data.content,
        author: newComment.author,
        like_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
      };
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === replyTo
            ? {
                ...comment,
                replies: [...comment.replies, newReply],
              }
            : comment
        )
      );
      setReplyTo(null);
    } else {
      setComments((prev) => [newComment, ...prev]);
    }

    setPost((prev) => ({ ...prev, comment_count: prev.comment_count + 1 }));
    reset();
    setIsSubmitting(false);
    toast.success("댓글이 등록되었습니다 🎉");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            is_liked: !comment.is_liked,
            like_count: comment.is_liked
              ? comment.like_count - 1
              : comment.like_count + 1,
          };
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  is_liked: !reply.is_liked,
                  like_count: reply.is_liked
                    ? reply.like_count - 1
                    : reply.like_count + 1,
                }
              : reply
          ),
        };
      })
    );
  };

  const boardTypeConfig: Record<
    string,
    { label: string; color: string }
  > = {
    FREE: { label: "자유게시판", color: "bg-slate-500/20 text-slate-300" },
    TOURNAMENT_REVIEW: {
      label: "대회 후기",
      color: "bg-amber-500/20 text-amber-300",
    },
    EQUIPMENT_REVIEW: {
      label: "장비 리뷰",
      color: "bg-blue-500/20 text-blue-300",
    },
    TIPS: { label: "팁/노하우", color: "bg-emerald-500/20 text-emerald-300" },
  };

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  // Sort comments: best first, then by likes
  const sortedComments = [...comments].sort((a, b) => {
    if (a.is_best && !b.is_best) return -1;
    if (!a.is_best && b.is_best) return 1;
    return b.like_count - a.like_count;
  });

  return (
    <TooltipProvider>
      <div className="container max-w-3xl py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              커뮤니티로
            </Link>
          </Button>
        </div>

        {/* Post Content */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={boardTypeConfig[post.board_type]?.color}
                >
                  {boardTypeConfig[post.board_type]?.label}
                </Badge>
                {post.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-muted"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user?.id === post.author.id ? (
                    <>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제하기
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      신고하기
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h1 className="mt-4 text-2xl font-bold">{post.title}</h1>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={post.author.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                    {post.author.display_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.author.display_name}</span>
                    <UserLevel level={post.author.level} />
                    <UserBadge badge={post.author.badge} />
                  </div>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(post.created_at)}
                    <span>·</span>
                    <Eye className="h-3 w-3" />
                    {post.view_count.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>

            <Separator className="my-6" />

            {/* Reactions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Reaction Button */}
                <div className="relative">
                  <Button
                    variant={post.user_reaction ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowReactions(!showReactions)}
                  >
                    {post.user_reaction ? (
                      <span className="text-base">
                        {REACTIONS.find((r) => r.id === post.user_reaction)?.emoji}
                      </span>
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    <span>{totalReactions}</span>
                  </Button>

                  {/* Reaction Picker */}
                  {showReactions && (
                    <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-full bg-card border shadow-lg p-2 animate-in fade-in slide-in-from-bottom-2">
                      {REACTIONS.map((reaction) => (
                        <Tooltip key={reaction.id}>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                "text-2xl hover:scale-125 transition-transform p-1 rounded-full",
                                post.user_reaction === reaction.id && "bg-muted"
                              )}
                              onClick={() => handleReaction(reaction.id)}
                            >
                              {reaction.emoji}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{reaction.label}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reaction Summary */}
                {totalReactions > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {Object.entries(post.reactions)
                      .filter(([, count]) => count > 0)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([id]) => (
                        <span key={id} className="text-base">
                          {REACTIONS.find((r) => r.id === id)?.emoji}
                        </span>
                      ))}
                  </div>
                )}

                <Button variant="outline" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {post.comment_count}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={post.is_bookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={cn("h-4 w-4", post.is_bookmarked && "fill-current")}
                  />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">
              댓글 <span className="text-primary">{post.comment_count}</span>개
            </h2>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
              {replyTo && (
                <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">답글 작성 중</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-6"
                    onClick={() => setReplyTo(null)}
                  >
                    취소
                  </Button>
                </div>
              )}

              <div className="relative">
                <Textarea
                  placeholder={
                    user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다"
                  }
                  rows={3}
                  disabled={!user}
                  className="pr-12 resize-none"
                  {...register("content")}
                />
                {user && (
                  <div className="absolute right-2 top-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setShowQuickReplies(!showQuickReplies)}
                        >
                          <Lightbulb className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>빠른 답글</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}

              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {commentContent?.length || 0} / 1000
                </span>
                <Button type="submit" disabled={isSubmitting || !user} size="sm">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  댓글 등록
                </Button>
              </div>
            </form>

            <Separator />

            {/* Comments List */}
            <div className="space-y-6">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div
                    className={cn(
                      "flex gap-3 p-3 rounded-lg -mx-3",
                      comment.is_best && "bg-amber-500/5 border border-amber-500/20"
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar_url || ""} />
                      <AvatarFallback
                        className={cn(
                          comment.author.badge === "coach" &&
                            "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                        )}
                      >
                        {comment.author.display_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">
                          {comment.author.display_name}
                        </span>
                        <UserLevel level={comment.author.level} />
                        <UserBadge badge={comment.author.badge} />
                        {comment.author.is_author && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-primary/10 text-primary border-primary/30"
                          >
                            작성자
                          </Badge>
                        )}
                        {comment.is_best && (
                          <Badge className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                            <Award className="h-3 w-3" />
                            BEST
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-auto py-1 px-2 text-muted-foreground hover:text-foreground gap-1",
                            comment.is_liked && "text-red-500 hover:text-red-500"
                          )}
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <Heart
                            className={cn("h-4 w-4", comment.is_liked && "fill-current")}
                          />
                          <span className="text-sm">{comment.like_count}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setReplyTo(comment.id)}
                        >
                          답글 달기
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-6 space-y-3 border-l-2 border-muted pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 p-2 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatar_url || ""} />
                            <AvatarFallback>{reply.author.display_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {reply.author.display_name}
                              </span>
                              <UserLevel level={reply.author.level} />
                              {reply.author.is_author && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-primary/10 text-primary border-primary/30"
                                >
                                  작성자
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm">{reply.content}</p>
                            <div className="mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-auto py-1 px-2 text-muted-foreground hover:text-foreground gap-1",
                                  reply.is_liked && "text-red-500 hover:text-red-500"
                                )}
                                onClick={() => handleLikeComment(reply.id)}
                              >
                                <Heart
                                  className={cn(
                                    "h-3 w-3",
                                    reply.is_liked && "fill-current"
                                  )}
                                />
                                <span className="text-xs">{reply.like_count}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {comments.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
