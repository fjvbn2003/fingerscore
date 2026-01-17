"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  Plus,
  Search,
  Calendar,
  TrendingUp,
  DollarSign,
  Check,
  Clock,
  Filter,
  Download,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data
const mockPayments = [
  { id: "1", memberName: "김철수", amount: 100000, paymentType: "MONTHLY", paymentMethod: "CARD", paymentDate: "2024-01-05", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: true, paidAt: "2024-01-05" },
  { id: "2", memberName: "이영희", amount: 200000, paymentType: "LESSON", paymentMethod: "TRANSFER", paymentDate: "2024-01-03", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: true, paidAt: "2024-01-03" },
  { id: "3", memberName: "박민수", amount: 100000, paymentType: "MONTHLY", paymentMethod: null, paymentDate: "2024-01-20", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: false, paidAt: null },
  { id: "4", memberName: "최지영", amount: 300000, paymentType: "LESSON", paymentMethod: "CARD", paymentDate: "2024-01-10", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: true, paidAt: "2024-01-10" },
  { id: "5", memberName: "정대현", amount: 150000, paymentType: "MONTHLY", paymentMethod: null, paymentDate: "2024-01-22", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: false, paidAt: null },
  { id: "6", memberName: "한소희", amount: 100000, paymentType: "MONTHLY", paymentMethod: "CASH", paymentDate: "2024-01-08", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: true, paidAt: "2024-01-08" },
  { id: "7", memberName: "송민호", amount: 200000, paymentType: "LESSON", paymentMethod: null, paymentDate: "2024-01-25", periodStart: "2024-01-01", periodEnd: "2024-01-31", isPaid: false, paidAt: null },
];

const mockMonthlyStats = {
  totalRevenue: 4250000,
  membershipRevenue: 2850000,
  lessonRevenue: 1400000,
  collectionRate: 78,
  pendingAmount: 450000,
  pendingCount: 3,
};

const paymentTypeColors: Record<string, string> = {
  MONTHLY: "border-blue-500/30 bg-blue-500/20 text-blue-400",
  LESSON: "border-purple-500/30 bg-purple-500/20 text-purple-400",
};

const paymentMethodLabels: Record<string, string> = {
  CASH: "현금",
  CARD: "카드",
  TRANSFER: "계좌이체",
};

export default function PaymentsPage() {
  const t = useTranslations("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.memberName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || payment.paymentType === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && payment.isPaid) ||
      (statusFilter === "unpaid" && !payment.isPaid);
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("payments.title")}</h1>
          <p className="text-muted-foreground">회원 결제 내역을 관리하고 정산하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10">
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0">
                <Plus className="mr-2 h-4 w-4" />
                {t("payments.addPayment")}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("payments.addPayment")}</DialogTitle>
                <DialogDescription>새 결제 내역을 등록하세요</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>회원</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="회원 선택" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      {["김철수", "이영희", "박민수", "최지영"].map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("payments.paymentType")}</Label>
                    <Select>
                      <SelectTrigger className="glass border-white/10">
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        <SelectItem value="MONTHLY">월회비</SelectItem>
                        <SelectItem value="LESSON">레슨비</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("payments.amount")}</Label>
                    <Input type="number" placeholder="100000" className="glass border-white/10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("payments.periodStart")}</Label>
                    <Input type="date" className="glass border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("payments.periodEnd")}</Label>
                    <Input type="date" className="glass border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("payments.paymentMethod")}</Label>
                  <Select>
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="결제 방법" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="CASH">{t("payments.methods.CASH")}</SelectItem>
                      <SelectItem value="CARD">{t("payments.methods.CARD")}</SelectItem>
                      <SelectItem value="TRANSFER">{t("payments.methods.TRANSFER")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>메모</Label>
                  <Textarea placeholder="메모 입력" className="glass border-white/10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-white/10">
                  취소
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                  결제 추가
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.totalRevenue")}</p>
                <p className="text-2xl font-bold">₩{mockMonthlyStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.membershipRevenue")}</p>
                <p className="text-2xl font-bold">₩{mockMonthlyStats.membershipRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.lessonRevenue")}</p>
                <p className="text-2xl font-bold">₩{mockMonthlyStats.lessonRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("payments.unpaid")}</p>
                <p className="text-2xl font-bold text-amber-400">
                  ₩{mockMonthlyStats.pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collection Progress */}
      <Card className="glass-card border-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            이번 달 수금률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={mockMonthlyStats.collectionRate} className="h-3 flex-1" />
            <span className="text-lg font-bold">{mockMonthlyStats.collectionRate}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            미결제 {mockMonthlyStats.pendingCount}건 (₩{mockMonthlyStats.pendingAmount.toLocaleString()})
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="회원 이름으로 검색..."
            className="pl-10 glass border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px] glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="결제 유형" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 유형</SelectItem>
            <SelectItem value="MONTHLY">월회비</SelectItem>
            <SelectItem value="LESSON">레슨비</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px] glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="결제 상태" />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="paid">결제완료</SelectItem>
            <SelectItem value="unpaid">미결제</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="glass border-white/10">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="unpaid" className="data-[state=active]:text-amber-400">
            <Clock className="h-4 w-4 mr-1" />
            미결제
          </TabsTrigger>
          <TabsTrigger value="paid" className="data-[state=active]:text-emerald-400">
            <Check className="h-4 w-4 mr-1" />
            결제완료
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <PaymentList payments={filteredPayments} t={t} />
        </TabsContent>

        <TabsContent value="unpaid" className="space-y-3">
          <PaymentList payments={filteredPayments.filter((p) => !p.isPaid)} t={t} />
        </TabsContent>

        <TabsContent value="paid" className="space-y-3">
          <PaymentList payments={filteredPayments.filter((p) => p.isPaid)} t={t} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentList({
  payments,
  t,
}: {
  payments: typeof mockPayments;
  t: ReturnType<typeof useTranslations>;
}) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">결제 내역이 없습니다</h3>
        <p className="text-sm text-muted-foreground">
          검색 조건에 맞는 결제 내역이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id} className="glass-card border-white/5 hover:border-white/10 transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    payment.isPaid ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}
                >
                  {payment.isPaid ? (
                    <Check className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <Clock className="h-6 w-6 text-amber-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{payment.memberName}</h3>
                    <Badge
                      variant="outline"
                      className={paymentTypeColors[payment.paymentType]}
                    >
                      {payment.paymentType === "MONTHLY" ? "월회비" : "레슨비"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {payment.periodStart} ~ {payment.periodEnd}
                    </span>
                    {payment.paymentMethod && (
                      <>
                        <span>·</span>
                        <span>{paymentMethodLabels[payment.paymentMethod]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">₩{payment.amount.toLocaleString()}</p>
                  {payment.isPaid ? (
                    <p className="text-sm text-emerald-400">
                      {payment.paidAt} 결제완료
                    </p>
                  ) : (
                    <p className="text-sm text-amber-400">
                      {payment.paymentDate} 까지
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-white/5">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card border-white/10">
                    {!payment.isPaid && (
                      <DropdownMenuItem className="cursor-pointer text-emerald-400">
                        <Check className="h-4 w-4 mr-2" />
                        {t("payments.markAsPaid")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="cursor-pointer">
                      상세 보기
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-400">
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
