"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  Swords,
  Clock,
  Save,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock settings
const defaultSettings = {
  emailNotifications: true,
  smsNotifications: false,
  lessonReminder: {
    enabled: true,
    daysBefore: 1,
    time: "09:00",
    email: true,
    sms: true,
  },
  paymentReminder: {
    enabled: true,
    daysBefore: 3,
    time: "10:00",
    email: true,
    sms: false,
  },
  exchangeMatchNotification: {
    enabled: true,
    email: true,
    sms: false,
  },
};

export default function NotificationsPage() {
  const t = useTranslations("admin");
  const [settings, setSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (updates: Partial<typeof settings>) => {
    setSettings({ ...settings, ...updates });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, save to server
    console.log("Save notification settings:", settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("notifications.title")}</h1>
          <p className="text-muted-foreground">
            회원 알림 및 리마인더 설정을 관리하세요
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          설정 저장
        </Button>
      </div>

      <Alert className="glass-card border-blue-500/30 bg-blue-500/10">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-100">
          이메일 및 문자 알림은 회원 등록 시 입력된 연락처로 발송됩니다.
          문자 알림은 SMS 발송 서비스 연동이 필요합니다.
        </AlertDescription>
      </Alert>

      {/* Global Settings */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            전역 알림 설정
          </CardTitle>
          <CardDescription>모든 알림에 적용되는 기본 설정입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <Label className="text-base">{t("notifications.emailNotifications")}</Label>
                <p className="text-sm text-muted-foreground">회원에게 이메일 알림 발송</p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSettings({ emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <Label className="text-base">{t("notifications.smsNotifications")}</Label>
                <p className="text-sm text-muted-foreground">회원에게 문자 알림 발송</p>
              </div>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                updateSettings({ smsNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Lesson Reminder */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                {t("notifications.lessonReminder")}
              </CardTitle>
              <CardDescription>레슨 일정 전 회원에게 리마인더 발송</CardDescription>
            </div>
            <Switch
              checked={settings.lessonReminder.enabled}
              onCheckedChange={(checked) =>
                updateSettings({
                  lessonReminder: { ...settings.lessonReminder, enabled: checked },
                })
              }
            />
          </div>
        </CardHeader>
        {settings.lessonReminder.enabled && (
          <CardContent className="space-y-4 border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("notifications.reminderTime")}</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={String(settings.lessonReminder.daysBefore)}
                    onValueChange={(value) =>
                      updateSettings({
                        lessonReminder: {
                          ...settings.lessonReminder,
                          daysBefore: parseInt(value),
                        },
                      })
                    }
                  >
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="0">당일</SelectItem>
                      <SelectItem value="1">1일 전</SelectItem>
                      <SelectItem value="2">2일 전</SelectItem>
                      <SelectItem value="3">3일 전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>발송 시간</Label>
                <Select
                  value={settings.lessonReminder.time}
                  onValueChange={(value) =>
                    updateSettings({
                      lessonReminder: { ...settings.lessonReminder, time: value },
                    })
                  }
                >
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.lessonReminder.email}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      lessonReminder: { ...settings.lessonReminder, email: checked },
                    })
                  }
                  disabled={!settings.emailNotifications}
                />
                <Label className="text-sm">이메일</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.lessonReminder.sms}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      lessonReminder: { ...settings.lessonReminder, sms: checked },
                    })
                  }
                  disabled={!settings.smsNotifications}
                />
                <Label className="text-sm">문자</Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Payment Reminder */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                {t("notifications.paymentReminder")}
              </CardTitle>
              <CardDescription>결제일 전 회원에게 알림 발송</CardDescription>
            </div>
            <Switch
              checked={settings.paymentReminder.enabled}
              onCheckedChange={(checked) =>
                updateSettings({
                  paymentReminder: { ...settings.paymentReminder, enabled: checked },
                })
              }
            />
          </div>
        </CardHeader>
        {settings.paymentReminder.enabled && (
          <CardContent className="space-y-4 border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("notifications.reminderTime")}</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={String(settings.paymentReminder.daysBefore)}
                    onValueChange={(value) =>
                      updateSettings({
                        paymentReminder: {
                          ...settings.paymentReminder,
                          daysBefore: parseInt(value),
                        },
                      })
                    }
                  >
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="1">1일 전</SelectItem>
                      <SelectItem value="3">3일 전</SelectItem>
                      <SelectItem value="5">5일 전</SelectItem>
                      <SelectItem value="7">7일 전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>발송 시간</Label>
                <Select
                  value={settings.paymentReminder.time}
                  onValueChange={(value) =>
                    updateSettings({
                      paymentReminder: { ...settings.paymentReminder, time: value },
                    })
                  }
                >
                  <SelectTrigger className="glass border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.paymentReminder.email}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      paymentReminder: { ...settings.paymentReminder, email: checked },
                    })
                  }
                  disabled={!settings.emailNotifications}
                />
                <Label className="text-sm">이메일</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.paymentReminder.sms}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      paymentReminder: { ...settings.paymentReminder, sms: checked },
                    })
                  }
                  disabled={!settings.smsNotifications}
                />
                <Label className="text-sm">문자</Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Exchange Match Notification */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-red-400" />
                {t("notifications.exchangeMatchNotification")}
              </CardTitle>
              <CardDescription>교류전 관련 알림 (제안, 수락, 일정 등)</CardDescription>
            </div>
            <Switch
              checked={settings.exchangeMatchNotification.enabled}
              onCheckedChange={(checked) =>
                updateSettings({
                  exchangeMatchNotification: {
                    ...settings.exchangeMatchNotification,
                    enabled: checked,
                  },
                })
              }
            />
          </div>
        </CardHeader>
        {settings.exchangeMatchNotification.enabled && (
          <CardContent className="space-y-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.exchangeMatchNotification.email}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      exchangeMatchNotification: {
                        ...settings.exchangeMatchNotification,
                        email: checked,
                      },
                    })
                  }
                  disabled={!settings.emailNotifications}
                />
                <Label className="text-sm">이메일</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.exchangeMatchNotification.sms}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      exchangeMatchNotification: {
                        ...settings.exchangeMatchNotification,
                        sms: checked,
                      },
                    })
                  }
                  disabled={!settings.smsNotifications}
                />
                <Label className="text-sm">문자</Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
