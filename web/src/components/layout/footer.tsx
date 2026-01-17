"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MessageSquare } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="container max-w-screen-2xl py-12 px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
                <span className="text-base font-bold text-white">FS</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">FingerScore</span>
                <p className="text-xs text-slate-500">Smart Sports Platform</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              {t("home.hero.description")}
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:support@fingerscore.app"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@fingerscore.app
              </a>
              <a
                href="tel:02-1234-5678"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                02-1234-5678
              </a>
              <a
                href="https://pf.kakao.com/fingerscore"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                @fingerscore
              </a>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.service")}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/tournaments"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.tournaments")}
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.community")}
                </Link>
              </li>
              <li>
                <Link
                  href="/rankings"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.rankings")}
                </Link>
              </li>
              <li>
                <Link
                  href="/live"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.live")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.tools")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.support")}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/support/faq"
                  className="hover:text-white transition-colors"
                >
                  {t("faq.title")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contact.title")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.guide")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.legal")}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("legal.termsTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-white transition-colors"
                >
                  {t("legal.privacyTitle")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} FingerScore. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span>🇰🇷</span>
              <span>한국어</span>
            </div>
          </div>

          {/* Business Info */}
          <div className="mt-6 text-xs text-slate-600 space-y-1">
            <p>상호: FingerScore | 대표: 김영주 | 사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 강남구 테헤란로 123, 핑거스코어 빌딩 5층 | 통신판매업신고: 제2025-서울강남-00000호</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
