import { Card, CardContent } from "@/components/ui/card";
import { STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 border-b">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">🏆 믿을 수 있는 플랫폼</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  {stat.label === "평균평점" && ""}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
