import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Trophy,
  Users,
  BarChart3,
  Radio,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Trophy,
      title: t("home.features.tournaments.title"),
      description: t("home.features.tournaments.description"),
      href: "/tournaments",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Users,
      title: t("home.features.community.title"),
      description: t("home.features.community.description"),
      href: "/community",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: BarChart3,
      title: t("home.features.rankings.title"),
      description: t("home.features.rankings.description"),
      href: "/rankings",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Radio,
      title: t("home.features.live.title"),
      description: t("home.features.live.description"),
      href: "/live",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const steps = [
    {
      step: "01",
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
    },
    {
      step: "02",
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
    },
    {
      step: "03",
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative max-w-screen-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              {t("home.hero.title")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("home.hero.titleHighlight")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("home.hero.description")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/tournaments">
                  {t("nav.tournaments")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">{t("common.signup")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-screen-2xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("home.features.title")}
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <Link href={feature.href} className="absolute inset-0 z-10" />
                  <CardHeader>
                    <div
                      className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} ${feature.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-20">
        <div className="container max-w-screen-2xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("home.howItWorks.title")}
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-screen-2xl">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
              <h2 className="text-3xl font-bold">{t("home.cta.title")}</h2>
              <p className="max-w-xl text-muted-foreground">
                {t("home.cta.description")}
              </p>
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  {t("common.signup")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
