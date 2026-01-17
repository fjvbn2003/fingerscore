"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, Ban, RefreshCw, Mail } from "lucide-react";

export default function TermsOfServicePage() {
  const t = useTranslations();

  const sections = [
    { id: "acceptance", title: "약관의 동의", icon: FileText },
    { id: "definitions", title: "용어의 정의", icon: FileText },
    { id: "service", title: "서비스 이용", icon: Users },
    { id: "account", title: "계정 관리", icon: Shield },
    { id: "content", title: "콘텐츠 정책", icon: FileText },
    { id: "intellectual", title: "지적재산권", icon: Scale },
    { id: "prohibited", title: "금지 행위", icon: Ban },
    { id: "liability", title: "책임의 제한", icon: AlertTriangle },
    { id: "termination", title: "서비스 종료", icon: RefreshCw },
    { id: "changes", title: "약관 변경", icon: RefreshCw },
    { id: "contact", title: "문의", icon: Mail },
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
              <h1 className="text-xl font-bold text-white">{t("legal.termsTitle")}</h1>
              <p className="text-sm text-slate-400">FingerScore 서비스 이용약관</p>
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

        {/* Terms Content */}
        <div className="space-y-12 text-slate-300">
          {/* Section 1: Acceptance */}
          <section id="acceptance" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">01</span>
              약관의 동의
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                본 이용약관(이하 &quot;약관&quot;)은 FingerScore(이하 &quot;서비스&quot;)를 이용하는 모든 사용자(이하 &quot;회원&quot;)에게 적용됩니다.
              </p>
              <p>
                회원가입 시 본 약관에 동의한 것으로 간주되며, 서비스를 이용하는 것은 본 약관의 모든 조항을 읽고 이해하며 동의한 것을 의미합니다.
              </p>
              <p>
                본 약관에 동의하지 않는 경우, 서비스 이용이 제한될 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 2: Definitions */}
          <section id="definitions" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">02</span>
              용어의 정의
            </h2>
            <div className="space-y-4 pl-11">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-white">&quot;서비스&quot;</span>: FingerScore가 제공하는 탁구 점수 기록, 대회 관리, 커뮤니티 등 모든 기능을 포함합니다.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-white">&quot;회원&quot;</span>: 본 약관에 동의하고 회원가입을 완료한 개인 또는 단체를 의미합니다.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-white">&quot;콘텐츠&quot;</span>: 회원이 서비스 내에서 생성, 업로드, 공유하는 모든 텍스트, 이미지, 데이터를 의미합니다.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-white">&quot;대회&quot;</span>: 서비스를 통해 개최되는 탁구, 테니스, 배드민턴 등의 스포츠 경기 이벤트를 의미합니다.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-white">&quot;레이팅&quot;</span>: ELO 시스템에 기반한 회원의 실력 지표를 의미합니다.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Service Usage */}
          <section id="service" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">03</span>
              서비스 이용
            </h2>
            <div className="space-y-4 pl-11">
              <h3 className="font-semibold text-white">3.1 서비스 제공</h3>
              <p>FingerScore는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>BLE 링 디바이스를 통한 점수 기록</li>
                <li>웹/모바일 애플리케이션을 통한 경기 관리</li>
                <li>대회 개최 및 관리 도구</li>
                <li>실시간 점수판 및 라이브 스코어</li>
                <li>랭킹 및 통계 시스템</li>
                <li>커뮤니티 게시판</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">3.2 서비스 이용 자격</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>만 14세 이상의 개인</li>
                <li>법적 능력이 있는 단체 또는 기업</li>
                <li>본 약관에 동의하고 회원가입을 완료한 자</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">3.3 서비스 변경</h3>
              <p>
                FingerScore는 서비스의 내용, 기능, 운영 방식을 사전 고지 후 변경할 수 있으며,
                중요한 변경 사항은 서비스 내 공지 또는 이메일을 통해 안내됩니다.
              </p>
            </div>
          </section>

          {/* Section 4: Account Management */}
          <section id="account" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">04</span>
              계정 관리
            </h2>
            <div className="space-y-4 pl-11">
              <h3 className="font-semibold text-white">4.1 계정 생성</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회원가입 시 정확하고 최신의 정보를 제공해야 합니다.</li>
                <li>허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.</li>
                <li>하나의 개인당 하나의 계정만 생성할 수 있습니다.</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">4.2 계정 보안</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회원은 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.</li>
                <li>계정 정보가 유출된 경우 즉시 FingerScore에 알려야 합니다.</li>
                <li>타인의 계정을 무단으로 사용하는 것은 금지됩니다.</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">4.3 계정 탈퇴</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회원은 언제든지 계정을 탈퇴할 수 있습니다.</li>
                <li>탈퇴 시 개인정보는 개인정보처리방침에 따라 처리됩니다.</li>
                <li>대회 기록 등 일부 데이터는 서비스 무결성을 위해 익명화되어 보존될 수 있습니다.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Content Policy */}
          <section id="content" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">05</span>
              콘텐츠 정책
            </h2>
            <div className="space-y-4 pl-11">
              <h3 className="font-semibold text-white">5.1 회원 콘텐츠</h3>
              <p>
                회원이 생성한 콘텐츠(게시글, 댓글, 경기 기록, 사진 등)에 대한 저작권은 회원에게 있습니다.
                단, 회원은 FingerScore에 서비스 운영에 필요한 범위 내에서 해당 콘텐츠를 사용할 수 있는 라이선스를 부여합니다.
              </p>

              <h3 className="font-semibold text-white mt-6">5.2 콘텐츠 가이드라인</h3>
              <p>다음과 같은 콘텐츠는 금지됩니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>타인의 권리를 침해하는 콘텐츠</li>
                <li>허위 또는 오해를 유발하는 정보</li>
                <li>음란, 폭력, 혐오 표현이 포함된 콘텐츠</li>
                <li>광고, 스팸, 악성코드를 포함한 콘텐츠</li>
                <li>개인정보를 무단으로 공개하는 콘텐츠</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">5.3 콘텐츠 관리</h3>
              <p>
                FingerScore는 위 가이드라인을 위반하는 콘텐츠를 사전 통보 없이 삭제하거나
                접근을 제한할 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 6: Intellectual Property */}
          <section id="intellectual" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">06</span>
              지적재산권
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                FingerScore 서비스의 모든 요소(소프트웨어, 디자인, 로고, 브랜드, 문서 등)에 대한
                지적재산권은 FingerScore에 귀속됩니다.
              </p>
              <p>
                회원은 FingerScore의 사전 서면 동의 없이 서비스의 일부 또는 전부를 복제, 수정,
                배포, 판매하거나 상업적 목적으로 사용할 수 없습니다.
              </p>
              <p>
                오픈소스 라이브러리 및 서드파티 소프트웨어는 해당 라이선스 조건에 따릅니다.
              </p>
            </div>
          </section>

          {/* Section 7: Prohibited Actions */}
          <section id="prohibited" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">07</span>
              금지 행위
            </h2>
            <div className="space-y-4 pl-11">
              <p>회원은 다음 행위를 해서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>시스템 해킹, 리버스 엔지니어링, 무단 접근 시도</li>
                <li>봇, 스크립트 등을 이용한 자동화된 접근</li>
                <li>경기 결과 조작 또는 허위 점수 입력</li>
                <li>타인의 계정 도용 또는 사칭</li>
                <li>스팸, 광고성 메시지 발송</li>
                <li>다른 회원에 대한 괴롭힘, 비방, 협박</li>
                <li>법령 또는 본 약관을 위반하는 모든 행위</li>
              </ul>
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-red-300 text-sm">
                  <strong>⚠️ 경고:</strong> 위 금지 행위 적발 시, 경고 없이 계정이 정지되거나
                  영구 차단될 수 있으며, 필요시 법적 조치가 취해질 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Liability Limitation */}
          <section id="liability" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">08</span>
              책임의 제한
            </h2>
            <div className="space-y-4 pl-11">
              <h3 className="font-semibold text-white">8.1 서비스 제공</h3>
              <p>
                FingerScore는 서비스를 &quot;있는 그대로&quot; 제공하며, 서비스의 무중단, 무결점,
                특정 목적에의 적합성을 보장하지 않습니다.
              </p>

              <h3 className="font-semibold text-white mt-6">8.2 면책 사항</h3>
              <p>FingerScore는 다음에 대해 책임을 지지 않습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단</li>
                <li>회원의 귀책사유로 인한 손해</li>
                <li>회원 간 분쟁 또는 제3자와의 분쟁</li>
                <li>회원이 게시한 콘텐츠로 인한 법적 문제</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">8.3 손해배상</h3>
              <p>
                FingerScore의 고의 또는 중대한 과실로 인한 손해에 대해서는 관련 법령에 따라 배상합니다.
                단, 간접적, 우발적 손해에 대해서는 책임이 제한됩니다.
              </p>
            </div>
          </section>

          {/* Section 9: Termination */}
          <section id="termination" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">09</span>
              서비스 종료
            </h2>
            <div className="space-y-4 pl-11">
              <h3 className="font-semibold text-white">9.1 회원에 의한 종료</h3>
              <p>
                회원은 언제든지 서비스 이용을 중단하고 계정을 탈퇴할 수 있습니다.
              </p>

              <h3 className="font-semibold text-white mt-6">9.2 FingerScore에 의한 종료</h3>
              <p>FingerScore는 다음의 경우 회원의 서비스 이용을 제한하거나 종료할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>본 약관의 중대한 위반</li>
                <li>금지 행위 적발</li>
                <li>법원 명령 또는 법적 요구</li>
                <li>장기간(12개월 이상) 미사용</li>
              </ul>

              <h3 className="font-semibold text-white mt-6">9.3 서비스 종료 시 처리</h3>
              <p>
                서비스 종료 시, 회원의 개인정보는 개인정보처리방침에 따라 처리되며,
                대회 기록 등 공익적 데이터는 익명화되어 보존될 수 있습니다.
              </p>
            </div>
          </section>

          {/* Section 10: Changes */}
          <section id="changes" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">10</span>
              약관 변경
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                FingerScore는 필요한 경우 본 약관을 변경할 수 있으며, 변경 사항은
                서비스 내 공지 또는 이메일을 통해 최소 7일 전에 안내됩니다.
              </p>
              <p>
                중요한 변경(회원의 권리 제한, 의무 추가 등)의 경우 30일 전에 고지합니다.
              </p>
              <p>
                변경된 약관에 동의하지 않는 회원은 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                고지된 기간 내에 별도의 의사표시가 없으면 변경된 약관에 동의한 것으로 간주됩니다.
              </p>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section id="contact" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-mono">11</span>
              문의
            </h2>
            <div className="space-y-4 pl-11">
              <p>
                본 약관에 대한 문의사항이 있으시면 아래 연락처로 문의해 주세요.
              </p>
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <p className="font-semibold text-white mb-2">FingerScore 고객센터</p>
                <ul className="space-y-2 text-sm">
                  <li>📧 이메일: support@fingerscore.app</li>
                  <li>📞 전화: 02-1234-5678 (평일 10:00-18:00)</li>
                  <li>💬 카카오톡: @fingerscore</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mt-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">준거법 및 관할법원</h2>
            <p className="text-slate-300">
              본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련하여 발생하는 분쟁에 대해서는
              서울중앙지방법원을 제1심 전속관할법원으로 합니다.
            </p>
          </section>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
          <Link
            href="/legal/privacy"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            개인정보처리방침 보기
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}
