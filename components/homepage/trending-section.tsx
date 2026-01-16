import { TRENDING_CITIES } from "@/lib/constants";

export function TrendingSection() {
  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}위`;
    }
  };

  const maxPopularity = Math.max(...TRENDING_CITIES.map((c) => c.popularity));

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              📊 이달의 인기 도시
            </h2>
            <p className="text-muted-foreground">
              2025년 1월 기준 · 노마드들이 가장 많이 방문한 도시
            </p>
          </div>

          {/* List */}
          <div className="space-y-4">
            {TRENDING_CITIES.map((city, index) => (
              <div
                key={city.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                {/* Rank */}
                <div className="text-2xl font-bold w-16 text-center shrink-0">
                  {getMedal(index)}
                </div>

                {/* City Name & Insights */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1">{city.name}</div>
                  <div className="text-sm text-muted-foreground">
                    💡 {city.insights.join(" / ")}
                  </div>
                </div>

                {/* Progress Bar & Growth */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{
                          width: `${(city.popularity / maxPopularity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`text-sm font-medium shrink-0 ${
                      city.trend === "up" ? "text-green-600" : ""
                    }`}
                  >
                    {city.trend === "up" ? "+" : ""}
                    {city.growthRate}%
                    {city.trend === "up" ? " ↑" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
