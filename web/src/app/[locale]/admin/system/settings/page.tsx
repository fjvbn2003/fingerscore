"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Smartphone,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SystemSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // 일반 설정
    siteName: "FingerScore",
    siteDescription: "탁구/당구 점수 기록 및 클럽 관리 플랫폼",
    maintenanceMode: false,

    // 알림 설정
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,

    // 보안 설정
    requireEmailVerification: true,
    allowSocialLogin: true,
    sessionTimeout: "24",

    // 클럽 설정
    maxMembersPerClub: "500",
    requireClubVerification: false,

    // 레슨 설정
    defaultLessonDuration: "60",
    maxLessonsPerDay: "20",
  });

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: 실제 저장 로직 구현
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-7 w-7 text-emerald-500" />
            시스템 설정
          </h1>
          <p className="text-muted-foreground">플랫폼 전체 설정을 관리합니다</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          저장
        </Button>
      </div>

      {/* General Settings */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            일반 설정
          </CardTitle>
          <CardDescription>사이트 기본 정보를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">사이트 이름</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">사이트 설명</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>유지보수 모드</Label>
              <p className="text-sm text-muted-foreground">
                활성화하면 관리자 외 모든 사용자의 접근이 제한됩니다
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            알림 설정
          </CardTitle>
          <CardDescription>사용자 알림 방식을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <Label>이메일 알림</Label>
                <p className="text-sm text-muted-foreground">
                  중요한 업데이트를 이메일로 전송합니다
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Smartphone className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <Label>푸시 알림</Label>
                <p className="text-sm text-muted-foreground">
                  모바일 앱 푸시 알림을 활성화합니다
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <FileText className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <Label>SMS 알림</Label>
                <p className="text-sm text-muted-foreground">
                  문자 메시지로 알림을 전송합니다 (추가 비용 발생)
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, smsNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            보안 설정
          </CardTitle>
          <CardDescription>사용자 인증 및 보안 정책을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>이메일 인증 필수</Label>
              <p className="text-sm text-muted-foreground">
                회원가입 시 이메일 인증을 필수로 요구합니다
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireEmailVerification: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>소셜 로그인 허용</Label>
              <p className="text-sm text-muted-foreground">
                Google, Kakao 등 소셜 로그인을 허용합니다
              </p>
            </div>
            <Switch
              checked={settings.allowSocialLogin}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowSocialLogin: checked })
              }
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>세션 유지 시간</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) =>
                  setSettings({ ...settings, sessionTimeout: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1시간</SelectItem>
                  <SelectItem value="6">6시간</SelectItem>
                  <SelectItem value="24">24시간</SelectItem>
                  <SelectItem value="168">7일</SelectItem>
                  <SelectItem value="720">30일</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Club Settings */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            클럽 설정
          </CardTitle>
          <CardDescription>클럽 관련 정책을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>클럽당 최대 회원 수</Label>
              <Input
                type="number"
                value={settings.maxMembersPerClub}
                onChange={(e) =>
                  setSettings({ ...settings, maxMembersPerClub: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>기본 레슨 시간 (분)</Label>
              <Input
                type="number"
                value={settings.defaultLessonDuration}
                onChange={(e) =>
                  setSettings({ ...settings, defaultLessonDuration: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>클럽 인증 필수</Label>
              <p className="text-sm text-muted-foreground">
                새 클럽 등록 시 관리자 인증을 필수로 요구합니다
              </p>
            </div>
            <Switch
              checked={settings.requireClubVerification}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireClubVerification: checked })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>일일 최대 레슨 수</Label>
              <Input
                type="number"
                value={settings.maxLessonsPerDay}
                onChange={(e) =>
                  setSettings({ ...settings, maxLessonsPerDay: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="glass-card border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-500" />
            시스템 상태
          </CardTitle>
          <CardDescription>현재 시스템 상태를 확인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>데이터베이스</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                정상
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>인증 서비스</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                정상
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>스토리지</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                정상
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>실시간 서비스</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                정상
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
