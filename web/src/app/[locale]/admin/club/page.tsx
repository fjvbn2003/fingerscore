"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Users,
  Edit,
  Save,
  Camera,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const mockClubData = {
  id: "my-club",
  name: "서초 탁구클럽",
  description:
    "서초구에서 가장 쾌적한 시설을 자랑하는 탁구 클럽입니다. 초보자부터 고수까지 모두 환영합니다. 전문 코치진과 함께 체계적인 레슨을 받아보세요.",
  address: "서울특별시 서초구 서초대로 123, 4층",
  phone: "02-1234-5678",
  email: "info@seochoclub.com",
  logo_url: null,
  cover_image_url: null,
  operating_hours: {
    weekday: { open: "09:00", close: "22:00" },
    saturday: { open: "09:00", close: "18:00" },
    sunday: { open: "10:00", close: "17:00" },
  },
  facilities: ["탁구대 12대", "샤워실", "락커룸", "휴게실", "주차장", "에어컨"],
  monthly_fee: 100000,
  lesson_fee_per_session: 50000,
  max_capacity: 50,
  is_active: true,
};

export default function ClubPage() {
  const t = useTranslations("admin");
  const [isEditing, setIsEditing] = useState(false);
  const [clubData, setClubData] = useState(mockClubData);
  const [newFacility, setNewFacility] = useState("");

  const handleSave = () => {
    // In real app, save to server
    console.log("Save club data:", clubData);
    setIsEditing(false);
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setClubData({
        ...clubData,
        facilities: [...(clubData.facilities || []), newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    setClubData({
      ...clubData,
      facilities: clubData.facilities?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("club.title")}</h1>
          <p className="text-muted-foreground">탁구장 정보를 관리하세요</p>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setClubData(mockClubData);
                setIsEditing(false);
              }}
              className="border-white/10"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
            >
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("club.edit")}
          </Button>
        )}
      </div>

      {/* Cover Image & Logo */}
      <Card className="glass-card border-white/5 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20">
          {clubData.cover_image_url ? (
            <img
              src={clubData.cover_image_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          {isEditing && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70"
            >
              <Camera className="h-4 w-4 mr-2" />
              커버 변경
            </Button>
          )}
        </div>
        <CardContent className="pt-0">
          <div className="relative -mt-12 flex items-end gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={clubData.logo_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl">
                {clubData.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              {isEditing ? (
                <Input
                  value={clubData.name}
                  onChange={(e) =>
                    setClubData({ ...clubData, name: e.target.value })
                  }
                  className="glass border-white/10 text-xl font-bold"
                />
              ) : (
                <h2 className="text-xl font-bold">{clubData.name}</h2>
              )}
              <Badge
                variant="outline"
                className={
                  clubData.is_active
                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                    : "border-red-500/30 bg-red-500/20 text-red-400"
                }
              >
                {clubData.is_active ? "운영 중" : "휴업"}
              </Badge>
            </div>
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-16 top-0 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-400" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("club.description")}</Label>
              {isEditing ? (
                <Textarea
                  value={clubData.description || ""}
                  onChange={(e) =>
                    setClubData({ ...clubData, description: e.target.value })
                  }
                  className="glass border-white/10 min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{clubData.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("club.address")}
              </Label>
              {isEditing ? (
                <Input
                  value={clubData.address}
                  onChange={(e) =>
                    setClubData({ ...clubData, address: e.target.value })
                  }
                  className="glass border-white/10"
                />
              ) : (
                <p className="text-sm">{clubData.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t("club.phone")}
                </Label>
                {isEditing ? (
                  <Input
                    value={clubData.phone || ""}
                    onChange={(e) =>
                      setClubData({ ...clubData, phone: e.target.value })
                    }
                    className="glass border-white/10"
                  />
                ) : (
                  <p className="text-sm">{clubData.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("club.email")}
                </Label>
                {isEditing ? (
                  <Input
                    value={clubData.email || ""}
                    onChange={(e) =>
                      setClubData({ ...clubData, email: e.target.value })
                    }
                    className="glass border-white/10"
                  />
                ) : (
                  <p className="text-sm">{clubData.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              {t("club.operatingHours")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm font-medium">평일</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={clubData.operating_hours?.weekday?.open}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            weekday: {
                              ...clubData.operating_hours?.weekday,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                    <span>~</span>
                    <Input
                      type="time"
                      value={clubData.operating_hours?.weekday?.close}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            weekday: {
                              ...clubData.operating_hours?.weekday,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {clubData.operating_hours?.weekday?.open} ~{" "}
                    {clubData.operating_hours?.weekday?.close}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm font-medium">토요일</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={clubData.operating_hours?.saturday?.open}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            saturday: {
                              ...clubData.operating_hours?.saturday,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                    <span>~</span>
                    <Input
                      type="time"
                      value={clubData.operating_hours?.saturday?.close}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            saturday: {
                              ...clubData.operating_hours?.saturday,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {clubData.operating_hours?.saturday?.open} ~{" "}
                    {clubData.operating_hours?.saturday?.close}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm font-medium">일요일</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={clubData.operating_hours?.sunday?.open}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            sunday: {
                              ...clubData.operating_hours?.sunday,
                              open: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                    <span>~</span>
                    <Input
                      type="time"
                      value={clubData.operating_hours?.sunday?.close}
                      onChange={(e) =>
                        setClubData({
                          ...clubData,
                          operating_hours: {
                            ...clubData.operating_hours,
                            sunday: {
                              ...clubData.operating_hours?.sunday,
                              close: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-28 glass border-white/10"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {clubData.operating_hours?.sunday?.open} ~{" "}
                    {clubData.operating_hours?.sunday?.close}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              요금 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("club.monthlyFee")}</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={clubData.monthly_fee}
                    onChange={(e) =>
                      setClubData({
                        ...clubData,
                        monthly_fee: parseInt(e.target.value),
                      })
                    }
                    className="glass border-white/10"
                  />
                ) : (
                  <p className="text-lg font-bold">
                    ₩{clubData.monthly_fee.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("club.lessonFee")}</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={clubData.lesson_fee_per_session}
                    onChange={(e) =>
                      setClubData({
                        ...clubData,
                        lesson_fee_per_session: parseInt(e.target.value),
                      })
                    }
                    className="glass border-white/10"
                  />
                ) : (
                  <p className="text-lg font-bold">
                    ₩{clubData.lesson_fee_per_session.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("club.maxCapacity")}
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={clubData.max_capacity}
                  onChange={(e) =>
                    setClubData({
                      ...clubData,
                      max_capacity: parseInt(e.target.value),
                    })
                  }
                  className="glass border-white/10"
                />
              ) : (
                <p className="text-lg font-bold">{clubData.max_capacity}명</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle>{t("club.facilities")}</CardTitle>
            <CardDescription>탁구장의 시설을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clubData.facilities?.map((facility, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/5 text-foreground px-3 py-1.5"
                >
                  {facility}
                  {isEditing && (
                    <button
                      onClick={() => removeFacility(index)}
                      className="ml-2 text-muted-foreground hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex items-center gap-2 mt-4">
                <Input
                  placeholder="새 시설 추가"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFacility();
                    }
                  }}
                  className="glass border-white/10"
                />
                <Button
                  onClick={addFacility}
                  variant="outline"
                  className="border-white/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
