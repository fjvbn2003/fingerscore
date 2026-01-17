import Link from "next/link";
import { Trophy, Users, BarChart3, Radio, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Trophy,
    title: "대회 참가",
    description: "실시간 대진표로 대회를 즐기세요. 스마트폰으로 점수를 제출하면 자동으로 업데이트됩니다.",
    href: "/tournaments",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "커뮤니티",
    description: "탁구 동호인들과 소통하고, 대회 후기와 장비 리뷰를 공유하세요.",
    href: "/community",
    color: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "랭킹 시스템",
    description: "ELO 레이팅으로 실력을 확인하고, 시즌별 랭킹에 도전하세요.",
    href: "/rankings",
    color: "text-green-500",
  },
  {
    icon: Radio,
    title: "라이브 관전",
    description: "진행 중인 경기를 실시간으로 관전하고 응원하세요.",
    href: "/live",
    color: "text-red-500",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative max-w-screen-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              스마트 링으로 더 스마트하게
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              탁구 대회의{" "}
              <span className="text-primary">새로운 기준</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              FingerScore와 함께라면 대회 운영부터 점수 기록, 실시간 대진표까지
              모든 것이 간편해집니다. 지금 바로 시작하세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/tournaments">
                  대회 찾아보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">회원가입</Link>
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
              탁구 대회를 위한 모든 것
            </h2>
            <p className="mt-4 text-muted-foreground">
              대회 참가, 커뮤니티, 랭킹, 라이브 관전까지 한 곳에서
            </p>
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
                    <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${feature.color}`}>
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
      <section className="bg-card/50 py-20">
        <div className="container max-w-screen-2xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              이렇게 진행됩니다
            </h2>
            <p className="mt-4 text-muted-foreground">
              대회 운영부터 실시간 점수 업데이트까지, 간단한 3단계
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-4xl gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "대회 참가 신청",
                description: "원하는 대회를 찾아 참가 신청을 합니다. 대회 운영진이 확정하면 알림을 받습니다.",
              },
              {
                step: "02",
                title: "경기 & 점수 제출",
                description: "경기 후 스마트폰으로 점수를 제출합니다. 운영진이 승인하면 즉시 반영됩니다.",
              },
              {
                step: "03",
                title: "실시간 대진표",
                description: "모든 참가자가 실시간으로 대진표를 확인할 수 있습니다. 다음 상대도 바로 확인!",
              },
            ].map((item) => (
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
              <h2 className="text-3xl font-bold">지금 시작하세요</h2>
              <p className="max-w-xl text-muted-foreground">
                FingerScore와 함께 탁구 대회의 새로운 경험을 시작하세요.
                무료로 가입하고 첫 대회에 참가해보세요.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    무료 회원가입
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
