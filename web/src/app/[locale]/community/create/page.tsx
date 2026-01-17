"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ArrowLeft, Loader2, ImagePlus, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { BoardType } from "@/types/database";

const postSchema = z.object({
  title: z.string().min(5, "제목은 최소 5자 이상이어야 합니다").max(100, "제목은 100자를 넘을 수 없습니다"),
  content: z.string().min(10, "내용은 최소 10자 이상이어야 합니다").max(10000, "내용은 10000자를 넘을 수 없습니다"),
  board_type: z.enum(["FREE", "TOURNAMENT_REVIEW", "EQUIPMENT_REVIEW", "TIPS"]),
  tournament_id: z.string().optional(),
  equipment_name: z.string().optional(),
  equipment_rating: z.number().min(1).max(5).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const boardTypes = [
  { value: "FREE", label: "자유게시판", description: "자유롭게 이야기를 나눠보세요" },
  { value: "TOURNAMENT_REVIEW", label: "대회 후기", description: "대회 참가 경험을 공유해주세요" },
  { value: "EQUIPMENT_REVIEW", label: "장비 리뷰", description: "라켓, 러버 등 장비를 리뷰해주세요" },
  { value: "TIPS", label: "팁/노하우", description: "유용한 팁과 노하우를 공유해주세요" },
];

export default function CreatePostPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const defaultBoardType = (searchParams.get("board") as BoardType) || "FREE";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      board_type: defaultBoardType,
    },
  });

  const watchedBoardType = watch("board_type");

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Post data:", { ...data, images, author_id: user.id });

    toast.success("게시글이 작성되었습니다");
    router.push("/community");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Preview images (in real app, upload to Supabase Storage)
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            커뮤니티로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">새 글 작성</h1>
        <p className="mt-1 text-muted-foreground">
          커뮤니티에 새로운 글을 작성해주세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>게시글 작성</CardTitle>
            <CardDescription>
              게시판을 선택하고 제목과 내용을 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Board Type Selection */}
            <div className="space-y-2">
              <Label>게시판 선택 *</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {boardTypes.map((board) => (
                  <div
                    key={board.value}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      watchedBoardType === board.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setValue("board_type", board.value as BoardType)}
                  >
                    <div className="font-medium">{board.label}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {board.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment specific fields */}
            {watchedBoardType === "EQUIPMENT_REVIEW" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="equipment_name">장비명 *</Label>
                  <Input
                    id="equipment_name"
                    placeholder="예: Butterfly Viscaria"
                    {...register("equipment_name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>평점</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("equipment_rating", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="평점 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {"★".repeat(rating)}{"☆".repeat(5 - rating)} ({rating}점)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="제목을 입력해주세요"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                placeholder="내용을 입력해주세요"
                rows={12}
                className="resize-none"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch("content")?.length || 0} / 10000자
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>이미지 첨부</Label>
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative h-24 w-24">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-6 w-6 text-muted-foreground" />
                      <span className="mt-1 text-xs text-muted-foreground">추가</span>
                    </div>
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                최대 5장까지 업로드 가능합니다
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/community">취소</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                게시하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
