"use client";

import { useState } from "react";
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
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/auth-context";

// Mock data
const mockPost = {
  id: "1",
  title: "새로운 라켓 구매 고민 중입니다",
  content: `안녕하세요, 탁구를 시작한 지 6개월 된 초보입니다.

현재 사용하고 있는 라켓이 너무 무겁고 컨트롤이 어려워서 새로운 라켓을 구매하려고 합니다.

예산은 10~15만원 정도이고, 컨트롤 위주의 플레이를 좋아합니다.

추천해주실 라켓이 있을까요?

참고로 현재 사용 중인 러버는 테너지 05입니다.

조언 부탁드립니다!`,
  board_type: "FREE",
  author: {
    id: "u1",
    display_name: "탁구초보",
    avatar_url: null,
  },
  view_count: 128,
  like_count: 12,
  comment_count: 5,
  is_liked: false,
  is_bookmarked: false,
  created_at: "2024-01-18T10:30:00Z",
  updated_at: "2024-01-18T10:30:00Z",
};

const mockComments = [
  {
    id: "c1",
    content: "버터플라이 비스카리아 추천드려요! 컨트롤 좋고 가격대도 맞을 것 같습니다.",
    author: {
      id: "u2",
      display_name: "탁구마스터",
      avatar_url: null,
    },
    like_count: 5,
    is_liked: false,
    created_at: "2024-01-18T11:00:00Z",
    replies: [
      {
        id: "c1-1",
        content: "비스카리아 좋은 선택이에요! 저도 쓰고 있는데 만족합니다.",
        author: {
          id: "u3",
          display_name: "프로지망생",
          avatar_url: null,
        },
        like_count: 2,
        is_liked: false,
        created_at: "2024-01-18T11:30:00Z",
      },
    ],
  },
  {
    id: "c2",
    content: "초보자시라면 스틱가 티모볼 ALC도 좋은 선택입니다. 가볍고 컨트롤이 쉬워요.",
    author: {
      id: "u4",
      display_name: "장비덕후",
      avatar_url: null,
    },
    like_count: 3,
    is_liked: false,
    created_at: "2024-01-18T12:00:00Z",
    replies: [],
  },
  {
    id: "c3",
    content: "테너지 05 쓰시면 블레이드도 좀 빠른 걸로 하시는 게 좋을 것 같아요. 티모볼 ZLC 어떠세요?",
    author: {
      id: "u5",
      display_name: "코치님",
      avatar_url: null,
    },
    like_count: 8,
    is_liked: true,
    created_at: "2024-01-18T14:00:00Z",
    replies: [],
  },
];

const commentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요").max(1000, "댓글은 1000자를 넘을 수 없습니다"),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function PostDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLikePost = () => {
    setPost((prev) => ({
      ...prev,
      is_liked: !prev.is_liked,
      like_count: prev.is_liked ? prev.like_count - 1 : prev.like_count + 1,
    }));
  };

  const handleBookmark = () => {
    setPost((prev) => ({
      ...prev,
      is_bookmarked: !prev.is_bookmarked,
    }));
    toast.success(post.is_bookmarked ? "북마크가 해제되었습니다" : "북마크에 추가되었습니다");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다");
    } catch {
      toast.error("링크 복사에 실패했습니다");
    }
  };

  const onSubmitComment = async (data: CommentFormData) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newComment = {
      id: `c${Date.now()}`,
      content: data.content,
      author: {
        id: user.id,
        display_name: user.email?.split("@")[0] || "익명",
        avatar_url: null,
      },
      like_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      replies: [],
    };

    if (replyTo) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === replyTo
            ? { ...comment, replies: [...comment.replies, { ...newComment, id: `${comment.id}-${Date.now()}` }] }
            : comment
        )
      );
      setReplyTo(null);
    } else {
      setComments((prev) => [...prev, newComment]);
    }

    setPost((prev) => ({ ...prev, comment_count: prev.comment_count + 1 }));
    reset();
    setIsSubmitting(false);
    toast.success("댓글이 등록되었습니다");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            is_liked: !comment.is_liked,
            like_count: comment.is_liked ? comment.like_count - 1 : comment.like_count + 1,
          };
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  is_liked: !reply.is_liked,
                  like_count: reply.is_liked ? reply.like_count - 1 : reply.like_count + 1,
                }
              : reply
          ),
        };
      })
    );
  };

  const boardTypeLabels: Record<string, string> = {
    FREE: "자유게시판",
    TOURNAMENT_REVIEW: "대회 후기",
    EQUIPMENT_REVIEW: "장비 리뷰",
    TIPS: "팁/노하우",
  };

  return (
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
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <Badge variant="secondary">{boardTypeLabels[post.board_type]}</Badge>
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

          <h1 className="mt-3 text-2xl font-bold">{post.title}</h1>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar_url || ""} />
                <AvatarFallback>{post.author.display_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.display_name}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.view_count}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {post.content}
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={post.is_liked ? "default" : "outline"}
                size="sm"
                onClick={handleLikePost}
              >
                <Heart
                  className={`mr-1 h-4 w-4 ${post.is_liked ? "fill-current" : ""}`}
                />
                {post.like_count}
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="mr-1 h-4 w-4" />
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
                  className={`h-4 w-4 ${post.is_bookmarked ? "fill-current" : ""}`}
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
        <CardHeader>
          <h2 className="text-lg font-semibold">댓글 {post.comment_count}개</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>답글 작성 중</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  취소
                </Button>
              </div>
            )}
            <Textarea
              placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
              rows={3}
              disabled={!user}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !user}>
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
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar_url || ""} />
                    <AvatarFallback>{comment.author.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <Heart
                          className={`mr-1 h-3 w-3 ${comment.is_liked ? "fill-current text-red-500" : ""}`}
                        />
                        {comment.like_count}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        답글
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-11 space-y-4 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={reply.author.avatar_url || ""} />
                          <AvatarFallback>{reply.author.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{reply.author.display_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(reply.created_at)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{reply.content}</p>
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleLikeComment(reply.id)}
                            >
                              <Heart
                                className={`mr-1 h-3 w-3 ${reply.is_liked ? "fill-current text-red-500" : ""}`}
                              />
                              {reply.like_count}
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
        </CardContent>
      </Card>
    </div>
  );
}
