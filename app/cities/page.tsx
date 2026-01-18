"use client";

import { useState, useMemo } from "react";
import { CityCard } from "@/components/homepage/city-card";
import { CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SortOption = "popular" | "rating" | "cost-low" | "cost-high";
type RegionFilter = "all" | "수도권" | "강원도" | "제주특별자치도" | "부산광역시" | "서울특별시" | "경기도" | "대전광역시" | "광주광역시" | "전라북도" | "전라남도" | "경상북도" | "경상남도";

export default function CitiesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [region, setRegion] = useState<RegionFilter>("all");

  // Get unique regions
  const regions = useMemo(() => {
    const regionSet = new Set(CITIES.map((city) => city.region));
    return Array.from(regionSet).sort();
  }, []);

  // Filter and sort cities
  const filteredCities = useMemo(() => {
    let result = [...CITIES];

    // Filter by region
    if (region !== "all") {
      result = result.filter((city) => city.region === region);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (city) =>
          city.name.toLowerCase().includes(searchLower) ||
          city.region.toLowerCase().includes(searchLower) ||
          city.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (sort) {
      case "popular":
        result.sort((a, b) => b.nomadsNow - a.nomadsNow);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "cost-low":
        result.sort((a, b) => a.monthlyCost - b.monthlyCost);
        break;
      case "cost-high":
        result.sort((a, b) => b.monthlyCost - a.monthlyCost);
        break;
    }

    return result;
  }, [search, sort, region]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              🌏 모든 도시 보기
            </h1>
            <p className="text-lg text-muted-foreground">
              노마드를 위한 완벽한 도시를 찾아보세요
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="도시, 지역, 설명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-2 border rounded-md bg-background min-w-[150px]"
            >
              <option value="popular">인기순</option>
              <option value="rating">평점순</option>
              <option value="cost-low">저렴한순</option>
              <option value="cost-high">비싼순</option>
            </select>

            {/* Region Filter */}
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionFilter)}
              className="px-4 py-2 border rounded-md bg-background min-w-[150px]"
            >
              <option value="all">전체 지역</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          {/* Result count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              총 <span className="font-bold text-foreground">{filteredCities.length}</span>개의 도시
            </p>
          </div>

          {/* Empty state */}
          {filteredCities.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-lg font-medium mb-1">검색 결과가 없습니다</p>
              <p className="text-muted-foreground">
                다른 검색어나 필터를 시도해보세요
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setRegion("all");
                  setSort("popular");
                }}
              >
                필터 초기화
              </Button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
