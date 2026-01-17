"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Shield, Database, Eye, Lock, UserCheck, Globe, Clock, Mail, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const t = useTranslations();

  const sections = [
    { id: "overview", title: "개요", icon: Shield },
    { id: "collection", title: "수집하는 개인정보", icon: Database },
    { id: "purpose", title: "개인정보 이용 목적", icon: Eye },
    { id: "retention", title: "보유 및 이용 기간", icon: Clock },
    { id: "sharing", title: "제3자 제공", icon: Globe },
    { id: "rights", title: "이용자의 권리", icon: UserCheck },
    { id: "security", title: "보안 조치", icon: Lock },
    { id: "cookies", title: "쿠키 정책", icon: FileText },
    { id: "children", title: "아동 개인정보", icon: UserCheck },
    { id: "changes", title: "정책 변경", icon: FileText },
    { id: "contact", title: "문의처", icon: Mail },
  ];

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
              <h1 className="text-xl font-bold text-white">{t("legal.privacyTitle")}</h1>
              <p className="text-sm text-slate-400">FingerScore 개인정보처리방침</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Last Updated */}
        <div className="mb-8 p-4 rounded-lg bg-slate-800 border border-slate-700">
          <p className="text-sm text-slate-400">
            <span className="font-medium text-slate-300">{t("legal.lastUpdated")}:</span> 2025년 1월 18일
          </p>
          <p className="text-sm text-slate-400 mt-1">
            <span className="font-medium text-slate-300">시행일:</span> 2025년 1월 25일
          </p>
        </div>

        {/* Summary Box */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            개인정보 보호 요약
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>최소한의 개인정보만 수집합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>개인정보를 제3자에게 판매하지 않습니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>업계 표준 보안 조치를 적용합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              <span>언제든지 데이터 삭제를 요청할 수 있습니다</span>
            </li>
          </ul>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            {t("legal.tableOfContents")}
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
              >
                <span className="text-emerald-400 font-mono text-sm">{String(index + 1).padStart(2, "0")}</span>
                <section.icon className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-12 text-slate-300">
          {/* Section 1: Overview */}
          <section id="overview" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">01</span>
              개요
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                FingerScore(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」,
                「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다.
              </p>
              <p>
                본 개인정보처리방침은 회사가 제공하는 FingerScore 서비스(이하 &quot;서비스&quot;)와 관련하여
                이용자의 개인정보를 어떻게 수집, 이용, 보관, 파기하는지 설명합니다.
              </p>
              <p>
                본 방침은 대한민국에 거주하는 이용자에게 적용되며, 해외 이용자의 경우 해당 국가의
                법률이 추가로 적용될 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 2: Collection */}
          <section id="collection" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">02</span>
              수집하는 개인정보
            </h2>
            <div className="space-y-6 pl-11">
              <div>
                <h3 className="font-semibold text-white mb-3">2.1 필수 수집 정보</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">수집 시점</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">수집 항목</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4">회원가입</td>
                        <td className="py-3 px-4">이메일, 닉네임, 비밀번호(암호화)</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4">소셜 로그인</td>
                        <td className="py-3 px-4">이메일, 이름, 프로필 사진(선택)</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4">서비스 이용</td>
                        <td className="py-3 px-4">경기 기록, 대회 참가 정보, 랭킹 데이터</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">2.2 선택 수집 정보</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>프로필 사진</li>
                  <li>소속 클럽/팀 정보</li>
                  <li>연락처(대회 참가 시)</li>
                  <li>주민등록번호 앞자리(만 14세 이상 확인용, 미저장)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">2.3 자동 수집 정보</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP 주소, 접속 기록, 서비스 이용 기록</li>
                  <li>기기 정보(OS, 브라우저, 디바이스 종류)</li>
                  <li>쿠키, 세션 정보</li>
                  <li>BLE 링 디바이스 연결 정보</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-3">2.4 수집하지 않는 정보</h3>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-300 text-sm">
                    회사는 민감정보(건강정보, 정치적 성향, 종교 등) 및 고유식별정보(주민등록번호,
                    여권번호 등)를 수집하지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Purpose */}
          <section id="purpose" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">03</span>
              개인정보 이용 목적
            </h2>
            <div className="space-y-4 pl-11">
              <div className="grid gap-4">
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2">서비스 제공</h4>
                  <p className="text-sm text-slate-400">
                    회원 관리, 경기 기록 저장, 대회 운영, 랭킹 시스템 운영
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2">커뮤니케이션</h4>
                  <p className="text-sm text-slate-400">
                    서비스 공지, 대회 안내, 경기 결과 알림, 고객 문의 응대
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2">서비스 개선</h4>
                  <p className="text-sm text-slate-400">
                    이용 통계 분석, 서비스 품질 향상, 신규 기능 개발
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2">법적 의무 이행</h4>
                  <p className="text-sm text-slate-400">
                    법령에 따른 정보 보관, 분쟁 해결, 법적 요청 대응
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Retention */}
          <section id="retention" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">04</span>
              보유 및 이용 기간
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                회사는 이용자의 개인정보를 수집 목적이 달성될 때까지 보유하며,
                회원 탈퇴 시 지체 없이 파기합니다. 단, 다음의 경우 명시된 기간 동안 보관합니다:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">보관 항목</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">보관 기간</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">근거</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">계약 및 청약철회 기록</td>
                      <td className="py-3 px-4">5년</td>
                      <td className="py-3 px-4">전자상거래법</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">대금 결제 기록</td>
                      <td className="py-3 px-4">5년</td>
                      <td className="py-3 px-4">전자상거래법</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">소비자 불만/분쟁 기록</td>
                      <td className="py-3 px-4">3년</td>
                      <td className="py-3 px-4">전자상거래법</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">접속 기록</td>
                      <td className="py-3 px-4">3개월</td>
                      <td className="py-3 px-4">통신비밀보호법</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">경기/대회 기록</td>
                      <td className="py-3 px-4">영구(익명화)</td>
                      <td className="py-3 px-4">서비스 무결성</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: Sharing */}
          <section id="sharing" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">05</span>
              제3자 제공
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우는 예외입니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>

              <h3 className="font-semibold text-white mt-6 mb-3">업무 위탁</h3>
              <p>회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다:</p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">수탁업체</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">위탁 업무</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">Supabase</td>
                      <td className="py-3 px-4">데이터베이스 호스팅</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">Vercel</td>
                      <td className="py-3 px-4">웹 서비스 호스팅</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">AWS</td>
                      <td className="py-3 px-4">클라우드 인프라</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">Google</td>
                      <td className="py-3 px-4">소셜 로그인, 분석</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 6: Rights */}
          <section id="rights" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">06</span>
              이용자의 권리
            </h2>
            <div className="space-y-4 pl-11">
              <p>이용자는 다음과 같은 권리를 행사할 수 있습니다:</p>

              <div className="grid gap-4 mt-4">
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-emerald-400" />
                    열람권
                  </h4>
                  <p className="text-sm text-slate-400">
                    본인의 개인정보 처리 현황을 열람할 수 있습니다.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    정정권
                  </h4>
                  <p className="text-sm text-slate-400">
                    부정확한 개인정보의 정정을 요구할 수 있습니다.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    삭제권
                  </h4>
                  <p className="text-sm text-slate-400">
                    개인정보의 삭제를 요구할 수 있습니다(법적 보관 의무 제외).
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    처리정지권
                  </h4>
                  <p className="text-sm text-slate-400">
                    개인정보 처리의 정지를 요구할 수 있습니다.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-400" />
                    이동권
                  </h4>
                  <p className="text-sm text-slate-400">
                    본인의 개인정보를 다른 서비스로 이전할 수 있도록 요청할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-blue-300 text-sm">
                  💡 권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 가능하며,
                  법정대리인을 통해서도 행사할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Security */}
          <section id="security" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">07</span>
              보안 조치
            </h2>
            <div className="space-y-4 pl-11">
              <p>회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다:</p>

              <h3 className="font-semibold text-white mt-4">기술적 조치</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS 암호화 통신</li>
                <li>비밀번호 bcrypt 해시 암호화</li>
                <li>접근 권한 관리 및 인증 시스템</li>
                <li>보안 취약점 정기 점검</li>
                <li>이상 징후 모니터링</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">관리적 조치</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>개인정보 취급자 최소화</li>
                <li>정기적인 보안 교육</li>
                <li>개인정보보호 내부관리계획 수립</li>
                <li>개인정보 처리 시스템 접근 기록 관리</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">물리적 조치</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>클라우드 서비스의 물리적 보안 시설 이용</li>
                <li>데이터센터 접근 통제</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Cookies */}
          <section id="cookies" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">08</span>
              쿠키 정책
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                회사는 이용자의 편의와 서비스 개선을 위해 쿠키를 사용합니다.
              </p>

              <h3 className="font-semibold text-white mt-4">쿠키의 종류</h3>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">종류</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">목적</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">만료</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">필수 쿠키</td>
                      <td className="py-3 px-4">로그인 상태 유지, 보안</td>
                      <td className="py-3 px-4">세션/7일</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">기능 쿠키</td>
                      <td className="py-3 px-4">사용자 설정 저장</td>
                      <td className="py-3 px-4">1년</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4">분석 쿠키</td>
                      <td className="py-3 px-4">서비스 이용 통계</td>
                      <td className="py-3 px-4">2년</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-white mt-6">쿠키 관리</h3>
              <p>
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                단, 필수 쿠키를 거부할 경우 일부 서비스 이용이 제한될 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 9: Children */}
          <section id="children" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">09</span>
              아동 개인정보
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                FingerScore 서비스는 만 14세 이상의 이용자를 대상으로 합니다.
              </p>
              <p>
                만 14세 미만 아동의 개인정보가 수집된 것을 알게 된 경우, 해당 정보를 즉시 삭제하며
                부모 또는 법정대리인에게 통지합니다.
              </p>
              <p>
                부모 또는 법정대리인께서 아동의 개인정보 처리에 대해 문의가 있으시면
                고객센터로 연락해 주시기 바랍니다.
              </p>
            </div>
          </section>

          {/* Section 10: Changes */}
          <section id="changes" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">10</span>
              정책 변경
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                본 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 수정될 수 있습니다.
              </p>
              <p>
                변경 사항은 서비스 내 공지사항 또는 이메일을 통해 최소 7일 전에 안내됩니다.
                중요한 변경(수집 항목 추가, 제3자 제공 등)의 경우 30일 전에 고지합니다.
              </p>
              <p>
                변경된 방침에 동의하지 않는 경우, 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">11</span>
              문의처
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                개인정보와 관련된 문의, 불만 처리, 피해 구제에 관한 사항은 아래로 연락해 주세요.
              </p>

              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <h4 className="font-semibold text-white mb-3">개인정보 보호책임자</h4>
                <ul className="space-y-2 text-sm">
                  <li>👤 성명: 김영주</li>
                  <li>📧 이메일: privacy@fingerscore.app</li>
                  <li>📞 전화: 02-1234-5678</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 mt-4">
                <h4 className="font-semibold text-white mb-3">개인정보 관련 신고 및 상담</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 개인정보침해신고센터: <a href="https://privacy.kisa.or.kr" className="text-emerald-400 hover:underline">privacy.kisa.or.kr</a> (국번없이 118)</li>
                  <li>• 대검찰청 사이버범죄수사단: <a href="https://www.spo.go.kr" className="text-emerald-400 hover:underline">www.spo.go.kr</a> (02-3480-3571)</li>
                  <li>• 경찰청 사이버안전국: <a href="https://cyberbureau.police.go.kr" className="text-emerald-400 hover:underline">cyberbureau.police.go.kr</a> (국번없이 182)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/legal/terms"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            이용약관 보기
          </Link>
          <Link
            href="/support/faq"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            자주 묻는 질문
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}
