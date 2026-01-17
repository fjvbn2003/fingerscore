"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Tools Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          {t("common.error")}
        </h1>

        <p className="text-slate-400 mb-2">
          {t("errors.somethingWentWrong")}
        </p>

        {error.digest && (
          <p className="text-xs text-slate-600 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {t("common.tryAgain")}
          </button>

          <Link
            href="/tools"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("nav.tools")}
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            {t("common.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
