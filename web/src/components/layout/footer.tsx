"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container max-w-screen-2xl py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  FS
                </span>
              </div>
              <span className="font-bold">FingerScore</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("home.hero.description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">{t("footer.service")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/tournaments"
                  className="hover:text-primary transition-colors"
                >
                  {t("nav.tournaments")}
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-primary transition-colors"
                >
                  {t("nav.community")}
                </Link>
              </li>
              <li>
                <Link
                  href="/rankings"
                  className="hover:text-primary transition-colors"
                >
                  {t("nav.rankings")}
                </Link>
              </li>
              <li>
                <Link
                  href="/live"
                  className="hover:text-primary transition-colors"
                >
                  {t("nav.live")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{t("footer.support")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/guide"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.guide")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FingerScore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
