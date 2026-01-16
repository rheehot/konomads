"use client";

import { Button } from "@/components/ui/button";
import { QUICK_FILTERS } from "@/lib/constants";

export function QuickFilters() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <section className="py-12 md:py-16 border-b bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">🎯 빠른 필터로 도시 찾기</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {QUICK_FILTERS.map((filter) => (
            <Button
              key={filter.filter}
              variant={selectedFilters.includes(filter.filter) ? "default" : "outline"}
              size="lg"
              onClick={() => toggleFilter(filter.filter)}
              className="min-w-[120px] md:min-w-[140px]"
            >
              <span className="text-xl mr-2">{filter.icon}</span>
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Add useState import
import { useState } from "react";
