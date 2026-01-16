import { Card, CardContent } from "@/components/ui/card";
import { LIVE_DASHBOARD } from "@/lib/constants";

export function LiveDashboard() {
  const maxCount = Math.max(...LIVE_DASHBOARD.cityDistribution.map((c) => c.count));

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              🌐 실시간 대시보드
            </h2>
            <p className="text-lg text-muted-foreground">
              🧑‍💼 지금 이 순간 {LIVE_DASHBOARD.totalNomads}명의 노마드가
              한국에서 활동 중입니다
            </p>
          </div>

          {/* Distribution */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {LIVE_DASHBOARD.cityDistribution.map((item) => (
                <div key={item.cityId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.cityName}:</span>
                    <span className="font-semibold">{item.count}명</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
