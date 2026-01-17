import { CityCard } from "./city-card";
import { CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CityGrid() {
  const topCities = CITIES.slice(0, 10);

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">🌟 인기 도시 TOP 10</h2>
            <p className="text-muted-foreground mt-1">
              노마드들이 가장 많이 찾는 도시들
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/cities">전체보기 →</Link>
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <select className="px-4 py-2 border rounded-md bg-background">
            <option>인기순</option>
            <option>평점순</option>
            <option>저렴한순</option>
          </select>
          <select className="px-4 py-2 border rounded-md bg-background">
            <option>전체</option>
            <option>수도권</option>
            <option>강원</option>
            <option>제주</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/cities">더 많은 도시 보기 →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
