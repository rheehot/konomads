import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/constants";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            💎 프리미엄 멤버십
          </h2>
          <p className="text-muted-foreground">
            더 많은 혜택으로 완벽한 노마드 라이프를 경험하세요
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative ${
                plan.featured
                  ? "border-blue-500 shadow-lg scale-105"
                  : ""
              }`}
            >
              {plan.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  인기
                </Badge>
              )}

              <CardHeader>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "₩0" : `₩${plan.price.toLocaleString()}`}
                    </span>
                    <span className="text-muted-foreground"> / 월</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link
                    href={
                      plan.tier === "free"
                        ? "/register"
                        : plan.tier === "premium"
                        ? "/pricing"
                        : "/contact"
                    }
                  >
                    {plan.tier === "free"
                      ? "시작하기 →"
                      : plan.tier === "premium"
                      ? "업그레이드 →"
                      : "문의하기 →"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
