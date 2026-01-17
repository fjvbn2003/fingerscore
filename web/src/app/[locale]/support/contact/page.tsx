"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Send,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  CreditCard,
  Users,
  Shield
} from "lucide-react";

type InquiryType = "general" | "technical" | "bug" | "feature" | "payment" | "partnership" | "privacy";

interface InquiryOption {
  id: InquiryType;
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function ContactPage() {
  const t = useTranslations();
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inquiryOptions: InquiryOption[] = [
    {
      id: "general",
      title: "일반 문의",
      description: "서비스 이용 관련 일반적인 질문",
      icon: HelpCircle
    },
    {
      id: "technical",
      title: "기술 지원",
      description: "앱/디바이스 사용 중 기술적 문제",
      icon: MessageSquare
    },
    {
      id: "bug",
      title: "버그 신고",
      description: "오류나 버그 발견 시 신고",
      icon: Bug
    },
    {
      id: "feature",
      title: "기능 제안",
      description: "새로운 기능이나 개선 사항 제안",
      icon: Lightbulb
    },
    {
      id: "payment",
      title: "결제 문의",
      description: "결제, 환불, 구독 관련 문의",
      icon: CreditCard
    },
    {
      id: "partnership",
      title: "제휴 문의",
      description: "비즈니스 제휴 및 협력 문의",
      icon: Users
    },
    {
      id: "privacy",
      title: "개인정보 문의",
      description: "개인정보 열람, 삭제 요청",
      icon: Shield
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch {
      setError("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {t("contact.submitSuccess")}
          </h1>
          <p className="text-slate-400 mb-8">
            {t("contact.submitSuccessMessage")}
          </p>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              홈으로 돌아가기
            </Link>
            <Link
              href="/support/faq"
              className="block w-full px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              자주 묻는 질문 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">{t("contact.title")}</h1>
              <p className="text-sm text-slate-400">{t("contact.subtitle")}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Methods */}
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                {t("contact.contactInfo")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t("contact.email")}</p>
                    <a href="mailto:support@fingerscore.app" className="text-sm text-emerald-400 hover:underline">
                      support@fingerscore.app
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t("contact.phone")}</p>
                    <a href="tel:02-1234-5678" className="text-sm text-slate-400">
                      02-1234-5678
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <MessageSquare className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t("contact.kakao")}</p>
                    <a href="https://pf.kakao.com/fingerscore" className="text-sm text-slate-400">
                      @fingerscore
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                {t("contact.businessHours")}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">평일</span>
                  <span className="text-white">10:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">점심시간</span>
                  <span className="text-white">12:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">주말/공휴일</span>
                  <span className="text-red-400">휴무</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                * 이메일 문의는 24시간 접수되며, 영업일 기준 1-2일 내에 답변드립니다.
              </p>
            </div>

            {/* Address */}
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                {t("contact.address")}
              </h2>
              <p className="text-sm text-slate-400">
                서울특별시 강남구 테헤란로 123<br />
                핑거스코어 빌딩 5층<br />
                (우) 06234
              </p>
            </div>

            {/* FAQ Link */}
            <Link
              href="/support/faq"
              className="block p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">자주 묻는 질문</p>
                  <p className="text-sm text-slate-400">
                    빠른 답변이 필요하시면 FAQ를 확인해 보세요
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-6">
                {t("contact.formTitle")}
              </h2>

              {/* Inquiry Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t("contact.inquiryType")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {inquiryOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setInquiryType(option.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-colors ${
                        inquiryType === option.id
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      <option.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{option.title}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {inquiryOptions.find(o => o.id === inquiryType)?.description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      {t("contact.name")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      {t("contact.emailAddress")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    {t("contact.phoneNumber")} <span className="text-slate-500">(선택)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    {t("contact.subject")} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="문의 제목을 입력해 주세요"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    {t("contact.message")} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="문의 내용을 자세히 작성해 주세요. 버그 신고의 경우, 사용 기기 정보와 재현 방법을 함께 적어주시면 더 빠른 해결이 가능합니다."
                  />
                </div>

                {/* Privacy Notice */}
                <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                  <p className="text-xs text-slate-400">
                    문의 접수를 위해 이름, 이메일 등 개인정보를 수집합니다.
                    수집된 정보는 문의 답변 목적으로만 사용되며, 답변 완료 후 3개월간 보관 후 파기됩니다.
                    자세한 내용은{" "}
                    <Link href="/legal/privacy" className="text-emerald-400 hover:underline">
                      개인정보처리방침
                    </Link>
                    을 참고해 주세요.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      접수 중...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      {t("contact.submit")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
