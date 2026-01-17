import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Users,
  BarChart3,
  Radio,
  ArrowRight,
  Zap,
  Sparkles,
  Shield,
  Globe,
  TrendingUp,
  Medal,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SportsQuotesTicker } from "@/components/sports-quotes-ticker";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Trophy,
      title: t("home.features.tournaments.title"),
      description: t("home.features.tournaments.description"),
      href: "/tournaments",
      color: "from-amber-400 to-orange-500",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      icon: Users,
      title: t("home.features.community.title"),
      description: t("home.features.community.description"),
      href: "/community",
      color: "from-blue-400 to-indigo-500",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: BarChart3,
      title: t("home.features.rankings.title"),
      description: t("home.features.rankings.description"),
      href: "/rankings",
      color: "from-emerald-400 to-teal-500",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: Radio,
      title: t("home.features.live.title"),
      description: t("home.features.live.description"),
      href: "/live",
      color: "from-red-400 to-pink-500",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
  ];

  const steps = [
    {
      step: "01",
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
      icon: Target,
      color: "text-emerald-400",
    },
    {
      step: "02",
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
      icon: Trophy,
      color: "text-amber-400",
    },
    {
      step: "03",
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
      icon: TrendingUp,
      color: "text-blue-400",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Players", icon: Users },
    { value: "500+", label: "Tournaments", icon: Trophy },
    { value: "50K+", label: "Matches Played", icon: Medal },
    { value: "99.9%", label: "Uptime", icon: Shield },
  ];

  return (
    <div className="flex flex-col">
      {/* Sports Quotes Ticker */}
      <SportsQuotesTicker variant="gradient" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-transparent blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-500/10 to-transparent blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-emerald-400">{t("home.hero.title")}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-balance">
                {t("home.hero.titleHighlight").split(" ").slice(0, -2).join(" ")}
              </span>
              <span className="mt-2 block gradient-text text-balance">
                {t("home.hero.titleHighlight").split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              {t("home.hero.description")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-emerald-500/25 hover-lift"
              >
                <Link href="/tournaments">
                  <Zap className="mr-2 h-5 w-5" />
                  {t("nav.tournaments")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-base border-white/10 hover:bg-white/5 hover:border-white/20"
              >
                <Link href="/auth/signup">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("common.signup")}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="glass-card rounded-2xl p-4 text-center hover-lift"
                  >
                    <Icon className="h-5 w-5 mx-auto mb-2 text-emerald-400" />
                    <div className="text-2xl sm:text-3xl font-bold gradient-text">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium mb-4">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-muted-foreground">All-in-One Platform</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("home.features.title")}
            </h2>
          </div>

          <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group block"
                >
                  <Card className="relative overflow-hidden glass-card border-white/5 h-full transition-all duration-300 hover:border-white/10 hover-lift">
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    <CardHeader className="relative pb-0">
                      <div className="flex items-start justify-between">
                        <div
                          className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg}`}
                        >
                          <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative pt-4">
                      <CardTitle className="text-xl mb-2 group-hover:text-white transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

        <div className="container relative max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium mb-4">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">Simple Steps</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("home.howItWorks.title")}
            </h2>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="relative grid gap-8 md:grid-cols-3">
              {/* Connecting Line */}
              <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

              {steps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative text-center group">
                    {/* Step Number */}
                    <div className="relative mx-auto mb-6">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl glass-card border border-white/10 mx-auto group-hover:border-emerald-500/30 transition-colors">
                        <span className="text-2xl font-bold gradient-text">
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-purple-500/20" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative glass-card border-white/10 p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left max-w-xl">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
                    {t("home.cta.title")}
                  </h2>
                  <p className="text-muted-foreground text-balance">
                    {t("home.cta.description")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="h-14 px-8 text-base bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-emerald-500/25"
                  >
                    <Link href="/auth/signup">
                      {t("common.signup")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-14 px-8 text-base border-white/10 hover:bg-white/5 hover:border-white/20"
                  >
                    <Link href="/tournaments">{t("nav.tournaments")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
