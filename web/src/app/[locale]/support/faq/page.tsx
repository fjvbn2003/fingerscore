"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  Smartphone,
  Trophy,
  Users,
  CreditCard,
  Shield,
  Settings,
  MessageCircle
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: FAQItem[];
}

export default function FAQPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("general");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = [
    {
      id: "general",
      title: "일반",
      icon: HelpCircle,
      items: [
        {
          question: "FingerScore는 무엇인가요?",
          answer: "FingerScore는 탁구, 테니스, 배드민턴 등 라켓 스포츠를 위한 스마트 점수 기록 서비스입니다. BLE 링 디바이스나 웹/모바일 앱을 통해 손쉽게 점수를 기록하고, 대회를 관리하며, 실력 향상을 추적할 수 있습니다."
        },
        {
          question: "서비스 이용료가 있나요?",
          answer: "기본 기능은 무료로 제공됩니다. 개인 사용자는 점수 기록, 전적 관리, 기본 통계 기능을 무료로 이용할 수 있습니다. 클럽/단체 관리, 고급 분석, API 연동 등 프리미엄 기능은 유료 플랜으로 제공됩니다."
        },
        {
          question: "어떤 스포츠를 지원하나요?",
          answer: "현재 탁구, 테니스, 배드민턴을 지원합니다. 각 스포츠의 공식 규칙에 맞는 점수 계산 시스템을 제공하며, 향후 스쿼시, 패들 등 더 많은 라켓 스포츠 지원을 계획하고 있습니다."
        },
        {
          question: "회원가입 없이도 사용할 수 있나요?",
          answer: "점수판 기능은 회원가입 없이 게스트 모드로 사용 가능합니다. 단, 경기 기록 저장, 통계 분석, 랭킹 참여 등의 기능은 회원가입이 필요합니다."
        }
      ]
    },
    {
      id: "device",
      title: "BLE 링 디바이스",
      icon: Smartphone,
      items: [
        {
          question: "BLE 링 디바이스는 무엇인가요?",
          answer: "BLE(Bluetooth Low Energy) 링은 손가락에 착용하는 스마트 디바이스입니다. 손가락 제스처만으로 점수를 기록할 수 있어, 경기 중에도 스마트폰을 만질 필요가 없습니다."
        },
        {
          question: "링 디바이스 없이도 사용할 수 있나요?",
          answer: "네, 가능합니다. 웹이나 모바일 앱에서 터치/클릭으로 점수를 기록할 수 있습니다. 링 디바이스는 더 편리한 사용을 위한 선택 사항입니다."
        },
        {
          question: "링 디바이스는 어떻게 구매하나요?",
          answer: "현재 링 디바이스는 공식 스토어에서 구매하실 수 있습니다. 자세한 구매 방법과 가격은 고객센터로 문의해 주세요."
        },
        {
          question: "링 디바이스 연결이 안 됩니다.",
          answer: "1) 스마트폰의 블루투스가 켜져 있는지 확인해 주세요. 2) 링 디바이스의 배터리가 충분한지 확인해 주세요. 3) 앱에서 '설정 > 디바이스 관리'로 이동하여 다시 페어링을 시도해 주세요. 문제가 지속되면 고객센터로 연락 바랍니다."
        },
        {
          question: "링 디바이스 배터리 수명은 얼마나 되나요?",
          answer: "완충 시 약 2주간 사용 가능합니다(하루 평균 2시간 사용 기준). 배터리는 USB-C 충전기로 약 1시간이면 완충됩니다."
        }
      ]
    },
    {
      id: "tournament",
      title: "대회 관리",
      icon: Trophy,
      items: [
        {
          question: "대회를 개최하려면 어떻게 해야 하나요?",
          answer: "'대회 관리' 메뉴에서 '새 대회 만들기'를 선택하세요. 대회명, 일정, 종목, 참가 인원 등을 설정하고 참가자를 초대하면 됩니다. 토너먼트, 리그, 스위스 리그 등 다양한 방식을 지원합니다."
        },
        {
          question: "대회 참가비 결제 기능이 있나요?",
          answer: "네, 프리미엄 플랜에서 참가비 결제 기능을 제공합니다. 카드 결제, 계좌이체 등을 지원하며, 정산 기능도 함께 제공됩니다."
        },
        {
          question: "대진표는 어떻게 만들어지나요?",
          answer: "참가자 등록이 완료되면 '대진표 생성' 버튼을 클릭하세요. 시드 배정, 랜덤 배정 등 다양한 방식을 선택할 수 있으며, 수동으로 조정도 가능합니다."
        },
        {
          question: "실시간 중계 기능이 있나요?",
          answer: "네, 라이브 스코어 기능을 통해 실시간으로 경기 점수를 중계할 수 있습니다. 대회 페이지 링크를 공유하면 누구나 실시간 점수를 확인할 수 있습니다."
        },
        {
          question: "여러 코트에서 동시에 경기를 진행할 수 있나요?",
          answer: "네, 가능합니다. 각 코트별로 별도의 점수판을 운영할 수 있으며, 대회 관리 대시보드에서 모든 코트의 진행 상황을 한눈에 확인할 수 있습니다."
        }
      ]
    },
    {
      id: "club",
      title: "클럽 관리",
      icon: Users,
      items: [
        {
          question: "클럽을 만들려면 어떻게 해야 하나요?",
          answer: "'클럽' 메뉴에서 '클럽 만들기'를 선택하세요. 클럽명, 지역, 종목 등을 설정하고 회원을 초대하면 됩니다. 클럽 생성은 무료입니다."
        },
        {
          question: "클럽 회원 관리는 어떻게 하나요?",
          answer: "클럽 관리자는 '회원 관리' 메뉴에서 회원 초대, 승인, 등급 설정 등을 할 수 있습니다. 회원 등급에 따라 권한을 다르게 설정할 수 있습니다."
        },
        {
          question: "클럽 내 랭킹 시스템이 있나요?",
          answer: "네, 클럽 내 자체 랭킹 시스템을 운영할 수 있습니다. ELO 레이팅 기반으로 클럽 내 경기 결과에 따라 자동으로 랭킹이 업데이트됩니다."
        },
        {
          question: "다른 클럽과 교류전을 할 수 있나요?",
          answer: "네, '교류전' 기능을 통해 다른 클럽과 팀 대항전을 진행할 수 있습니다. 양쪽 클럽 관리자가 합의하면 교류전이 성사됩니다."
        }
      ]
    },
    {
      id: "payment",
      title: "결제 및 환불",
      icon: CreditCard,
      items: [
        {
          question: "어떤 결제 수단을 지원하나요?",
          answer: "신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이 등을 지원합니다."
        },
        {
          question: "구독을 취소하면 어떻게 되나요?",
          answer: "구독 취소 시 현재 결제 기간이 끝날 때까지 프리미엄 기능을 계속 이용할 수 있습니다. 이후에는 무료 플랜으로 자동 전환됩니다."
        },
        {
          question: "환불 정책은 어떻게 되나요?",
          answer: "결제 후 7일 이내에 서비스를 전혀 이용하지 않은 경우 전액 환불이 가능합니다. 그 외의 경우 이용약관에 따라 부분 환불이 적용될 수 있습니다."
        },
        {
          question: "영수증/세금계산서 발급이 가능한가요?",
          answer: "네, 가능합니다. '마이페이지 > 결제 내역'에서 영수증을 직접 출력하실 수 있으며, 세금계산서가 필요하시면 고객센터로 사업자등록증과 함께 요청해 주세요."
        }
      ]
    },
    {
      id: "account",
      title: "계정 및 보안",
      icon: Shield,
      items: [
        {
          question: "비밀번호를 잊어버렸어요.",
          answer: "로그인 페이지에서 '비밀번호 찾기'를 클릭하세요. 가입 시 사용한 이메일로 비밀번호 재설정 링크가 발송됩니다."
        },
        {
          question: "소셜 로그인 연동은 어떻게 하나요?",
          answer: "'설정 > 계정 연동'에서 Google, 카카오, 네이버 등의 계정을 연동할 수 있습니다. 연동 후에는 해당 계정으로 간편 로그인이 가능합니다."
        },
        {
          question: "2단계 인증을 설정하고 싶어요.",
          answer: "'설정 > 보안'에서 2단계 인증을 활성화할 수 있습니다. 이메일 인증 또는 인증 앱(Google Authenticator 등)을 사용할 수 있습니다."
        },
        {
          question: "계정을 탈퇴하면 데이터는 어떻게 되나요?",
          answer: "탈퇴 시 개인정보는 개인정보처리방침에 따라 삭제됩니다. 대회 기록 등 공개된 데이터는 서비스 무결성을 위해 익명화되어 보존될 수 있습니다."
        },
        {
          question: "다른 기기에서 로그아웃하고 싶어요.",
          answer: "'설정 > 보안 > 로그인된 기기'에서 현재 로그인된 모든 기기를 확인하고 개별적으로 또는 전체 로그아웃할 수 있습니다."
        }
      ]
    },
    {
      id: "technical",
      title: "기술 지원",
      icon: Settings,
      items: [
        {
          question: "앱이 계속 튕겨요.",
          answer: "1) 앱을 최신 버전으로 업데이트해 주세요. 2) 앱을 삭제 후 재설치해 보세요. 3) 스마트폰을 재부팅해 보세요. 문제가 지속되면 기기 정보와 함께 고객센터로 문의해 주세요."
        },
        {
          question: "점수가 제대로 저장되지 않아요.",
          answer: "인터넷 연결 상태를 확인해 주세요. 오프라인 모드에서 기록한 경기는 인터넷 연결 시 자동으로 동기화됩니다. 동기화가 안 되면 '설정 > 데이터 동기화'를 수동으로 실행해 주세요."
        },
        {
          question: "알림이 오지 않아요.",
          answer: "1) 스마트폰 설정에서 FingerScore 앱의 알림이 허용되어 있는지 확인해 주세요. 2) 앱 내 '설정 > 알림'에서 원하는 알림이 켜져 있는지 확인해 주세요."
        },
        {
          question: "데이터를 다른 기기로 옮기고 싶어요.",
          answer: "같은 계정으로 로그인하면 모든 데이터가 자동으로 동기화됩니다. 별도의 데이터 이전 작업이 필요하지 않습니다."
        },
        {
          question: "API 연동은 어떻게 하나요?",
          answer: "프리미엄 플랜에서 API 키를 발급받을 수 있습니다. API 문서는 개발자 포털(developers.fingerscore.app)에서 확인하실 수 있습니다."
        }
      ]
    }
  ];

  const toggleItem = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

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
              <h1 className="text-xl font-bold text-white">{t("faq.title")}</h1>
              <p className="text-sm text-slate-400">{t("faq.subtitle")}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("faq.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-slate-400">
              {totalResults}개의 결과를 찾았습니다
            </p>
          )}
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.title}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Content */}
        <div className="space-y-8">
          {(searchQuery ? filteredCategories : categories.filter(c => c.id === activeCategory)).map(category => (
            <div key={category.id}>
              {searchQuery && (
                <div className="flex items-center gap-2 mb-4">
                  <category.icon className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                  <span className="text-sm text-slate-400">({category.items.length})</span>
                </div>
              )}

              <div className="space-y-3">
                {category.items.map((item, index) => {
                  const key = `${category.id}-${index}`;
                  const isOpen = openItems.has(key);

                  return (
                    <div
                      key={index}
                      className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(category.id, index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{item.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <div className="pt-2 border-t border-slate-700">
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && totalResults === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-slate-400 mb-6">
              다른 키워드로 검색하거나, 아래 연락처로 문의해 주세요.
            </p>
            <Link
              href="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              문의하기
            </Link>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {t("faq.stillNeedHelp")}
              </h3>
              <p className="text-slate-400">
                {t("faq.contactSupport")}
              </p>
            </div>
            <Link
              href="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4" />
              {t("faq.contactButton")}
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/legal/terms"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-700">
              <Shield className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-white">이용약관</p>
              <p className="text-sm text-slate-400">서비스 이용 규정 확인</p>
            </div>
          </Link>
          <Link
            href="/legal/privacy"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-700">
              <Shield className="h-5 w-5 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-white">개인정보처리방침</p>
              <p className="text-sm text-slate-400">개인정보 보호 정책 확인</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
