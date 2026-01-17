"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  MapPin,
  Trophy,
  Settings,
  Bell,
  Camera,
  Edit3,
  Plus,
  Star,
  Trash2,
  Save,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportType, VisibilityType } from "@/types/database";

// Mock user data
const mockUser = {
  id: "user1",
  username: "pingpong_master",
  display_name: "김탁구",
  avatar_url: null,
  bio: "탁구를 사랑하는 동호인입니다. 강남탁구클럽에서 주로 운동합니다. 언제든 한 판 하실 분 환영합니다!",
  email: "pingpong@example.com",
  phone: "010-1234-5678",
  created_at: "2024-03-15",
};

const mockSportRatings = [
  {
    sport_type: "TABLE_TENNIS" as SportType,
    rating: 1850,
    highest_rating: 1920,
    total_matches: 156,
    wins: 98,
    losses: 58,
    win_streak: 5,
    max_win_streak: 12,
  },
  {
    sport_type: "TENNIS" as SportType,
    rating: 1420,
    highest_rating: 1450,
    total_matches: 23,
    wins: 12,
    losses: 11,
    win_streak: 2,
    max_win_streak: 4,
  },
  {
    sport_type: "BADMINTON" as SportType,
    rating: 1550,
    highest_rating: 1580,
    total_matches: 45,
    wins: 28,
    losses: 17,
    win_streak: 0,
    max_win_streak: 6,
  },
];

const mockUserClubs = [
  {
    id: "uc1",
    club_id: "c1",
    club_name: "강남탁구클럽",
    sport_type: "TABLE_TENNIS" as SportType,
    is_primary: true,
    joined_at: "2024-03-20",
    address: "서울시 강남구 역삼동 123-45",
  },
  {
    id: "uc2",
    club_id: "c2",
    club_name: "서초테니스장",
    sport_type: "TENNIS" as SportType,
    is_primary: false,
    joined_at: "2024-06-15",
    address: "서울시 서초구 서초동 456-78",
  },
  {
    id: "uc3",
    club_id: "c3",
    club_name: "송파배드민턴센터",
    sport_type: "BADMINTON" as SportType,
    is_primary: false,
    joined_at: "2024-09-01",
    address: "서울시 송파구 잠실동 789-12",
  },
];

const mockNotificationSettings = {
  email_enabled: true,
  push_enabled: true,
  sms_enabled: false,
  match_result_notifications: true,
  challenge_notifications: true,
  news_notifications: false,
  club_notifications: true,
  marketing_notifications: false,
  quiet_hours_start: "22:00",
  quiet_hours_end: "08:00",
};

const sportConfig: Record<SportType, { color: string; icon: string; label: string; bgColor: string }> = {
  TABLE_TENNIS: { color: "text-orange-400", icon: "🏓", label: "탁구", bgColor: "bg-orange-500/20" },
  TENNIS: { color: "text-green-400", icon: "🎾", label: "테니스", bgColor: "bg-green-500/20" },
  BADMINTON: { color: "text-blue-400", icon: "🏸", label: "배드민턴", bgColor: "bg-blue-500/20" },
};

export default function ProfilePage() {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(mockUser.display_name);
  const [bio, setBio] = useState(mockUser.bio);
  const [matchVisibility, setMatchVisibility] = useState<VisibilityType>("PUBLIC");
  const [profileVisibility, setProfileVisibility] = useState<VisibilityType>("PUBLIC");
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [isAddClubOpen, setIsAddClubOpen] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save to API
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Cover */}
          <div className="h-32 rounded-t-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30" />

          {/* Avatar & Info */}
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-900">
                  {mockUser.display_name.charAt(0)}
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-slate-100">{mockUser.display_name}</h1>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pro</Badge>
                </div>
                <p className="text-slate-400">@{mockUser.username}</p>
                <p className="text-sm text-slate-500 mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  가입일: {new Date(mockUser.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-slate-700 text-slate-300"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {t("userProfile.editProfile")}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <User className="h-4 w-4 mr-2" />
              프로필
            </TabsTrigger>
            <TabsTrigger
              value="clubs"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              <MapPin className="h-4 w-4 mr-2" />
              운동 장소
            </TabsTrigger>
            <TabsTrigger
              value="ratings"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              <Trophy className="h-4 w-4 mr-2" />
              레이팅
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">{t("userProfile.bio")}</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t("userProfile.displayName")}</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">{t("userProfile.bio")}</label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={t("userProfile.bioPlaceholder")}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 resize-none"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-400">
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300">{mockUser.bio}</p>
              )}
            </div>

            {/* Visibility Settings */}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                {t("visibility.title")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("visibility.matchVisibility")}</p>
                    <p className="text-sm text-slate-400">경기 결과 공개 범위</p>
                  </div>
                  <Select value={matchVisibility} onValueChange={(v) => setMatchVisibility(v as VisibilityType)}>
                    <SelectTrigger className="w-[160px] bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="PUBLIC">
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4" /> {t("visibility.PUBLIC")}
                        </span>
                      </SelectItem>
                      <SelectItem value="CLUB_ONLY">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> {t("visibility.CLUB_ONLY")}
                        </span>
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        <span className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" /> {t("visibility.PRIVATE")}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("visibility.profileVisibility")}</p>
                    <p className="text-sm text-slate-400">프로필 공개 범위</p>
                  </div>
                  <Select value={profileVisibility} onValueChange={(v) => setProfileVisibility(v as VisibilityType)}>
                    <SelectTrigger className="w-[160px] bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="PUBLIC">
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4" /> {t("visibility.PUBLIC")}
                        </span>
                      </SelectItem>
                      <SelectItem value="CLUB_ONLY">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> {t("visibility.CLUB_ONLY")}
                        </span>
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        <span className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" /> {t("visibility.PRIVATE")}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Clubs Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">{t("userProfile.myClubs")}</h2>
              <Dialog open={isAddClubOpen} onOpenChange={setIsAddClubOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("userProfile.addClub")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">{t("userProfile.addClub")}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      운동하는 장소를 추가해주세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">종목</label>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                          <SelectValue placeholder="종목 선택" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="TABLE_TENNIS">🏓 탁구</SelectItem>
                          <SelectItem value="TENNIS">🎾 테니스</SelectItem>
                          <SelectItem value="BADMINTON">🏸 배드민턴</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">구장 검색</label>
                      <Input
                        placeholder="구장 이름으로 검색..."
                        className="bg-slate-800/50 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAddClubOpen(false)} className="text-slate-400">
                      취소
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">추가</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockUserClubs.map((club) => (
                <div
                  key={club.id}
                  className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${sportConfig[club.sport_type].bgColor} flex items-center justify-center text-2xl`}>
                      {sportConfig[club.sport_type].icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-100">{club.club_name}</h3>
                        {club.is_primary && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Star className="h-3 w-3 mr-1" />
                            주 장소
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {club.address}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        가입일: {new Date(club.joined_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!club.is_primary && (
                        <Button variant="ghost" size="sm" className="text-amber-400 hover:bg-amber-500/20">
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-100">{t("userProfile.sportRatings")}</h2>
            <div className="grid gap-4">
              {mockSportRatings.map((rating) => (
                <div
                  key={rating.sport_type}
                  className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl ${sportConfig[rating.sport_type].bgColor} flex items-center justify-center text-3xl`}>
                      {sportConfig[rating.sport_type].icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{sportConfig[rating.sport_type].label}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-mono font-bold ${sportConfig[rating.sport_type].color}`}>
                          {rating.rating}
                        </span>
                        <Badge className="bg-slate-700/50 text-slate-400">
                          최고 {rating.highest_rating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <Target className="h-4 w-4" />
                        총 경기
                      </div>
                      <p className="text-xl font-bold text-slate-100">{rating.total_matches}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <TrendingUp className="h-4 w-4" />
                        승률
                      </div>
                      <p className="text-xl font-bold text-emerald-400">
                        {Math.round((rating.wins / rating.total_matches) * 100)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <Award className="h-4 w-4" />
                        현재 연승
                      </div>
                      <p className="text-xl font-bold text-amber-400">{rating.win_streak}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                        <Trophy className="h-4 w-4" />
                        최고 연승
                      </div>
                      <p className="text-xl font-bold text-purple-400">{rating.max_win_streak}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <span className="text-emerald-400">{rating.wins}승</span>
                    <span className="text-red-400">{rating.losses}패</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notification Channels */}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                {t("notificationSettings.channels")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-100">{t("notificationSettings.email")}</p>
                      <p className="text-sm text-slate-400">{mockUser.email}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.email_enabled}
                    onCheckedChange={(v) => handleNotificationChange("email_enabled", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-100">{t("notificationSettings.push")}</p>
                      <p className="text-sm text-slate-400">브라우저 푸시 알림</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.push_enabled}
                    onCheckedChange={(v) => handleNotificationChange("push_enabled", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-100">{t("notificationSettings.sms")}</p>
                      <p className="text-sm text-slate-400">{mockUser.phone}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.sms_enabled}
                    onCheckedChange={(v) => handleNotificationChange("sms_enabled", v)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Categories */}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">{t("notificationSettings.categories")}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("notificationSettings.matchResults")}</p>
                    <p className="text-sm text-slate-400">{t("notificationSettings.matchResultsDesc")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.match_result_notifications}
                    onCheckedChange={(v) => handleNotificationChange("match_result_notifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("notificationSettings.challenges")}</p>
                    <p className="text-sm text-slate-400">{t("notificationSettings.challengesDesc")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.challenge_notifications}
                    onCheckedChange={(v) => handleNotificationChange("challenge_notifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("notificationSettings.newsUpdates")}</p>
                    <p className="text-sm text-slate-400">{t("notificationSettings.newsUpdatesDesc")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.news_notifications}
                    onCheckedChange={(v) => handleNotificationChange("news_notifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("notificationSettings.clubUpdates")}</p>
                    <p className="text-sm text-slate-400">{t("notificationSettings.clubUpdatesDesc")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.club_notifications}
                    onCheckedChange={(v) => handleNotificationChange("club_notifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-100">{t("notificationSettings.marketing")}</p>
                    <p className="text-sm text-slate-400">{t("notificationSettings.marketingDesc")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketing_notifications}
                    onCheckedChange={(v) => handleNotificationChange("marketing_notifications", v)}
                  />
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                {t("notificationSettings.quietHours")}
              </h2>
              <p className="text-sm text-slate-400 mb-4">{t("notificationSettings.quietHoursDesc")}</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-slate-400 mb-1 block">{t("notificationSettings.startTime")}</label>
                  <Input
                    type="time"
                    value={notificationSettings.quiet_hours_start || ""}
                    onChange={(e) => handleNotificationChange("quiet_hours_start", e.target.value as any)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-slate-400 mb-1 block">{t("notificationSettings.endTime")}</label>
                  <Input
                    type="time"
                    value={notificationSettings.quiet_hours_end || ""}
                    onChange={(e) => handleNotificationChange("quiet_hours_end", e.target.value as any)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
