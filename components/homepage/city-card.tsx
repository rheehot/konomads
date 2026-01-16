"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { City } from "@/types";
import Link from "next/link";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const [isLiked, setIsLiked] = useState(city.isLiked || false);

  const getBadgeVariant = (badge?: string) => {
    switch (badge) {
      case "popular":
        return "default";
      case "rising":
        return "secondary";
      case "new":
        return "outline";
      default:
        return undefined;
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case "popular":
        return "인기";
      case "rising":
        return "상승";
      case "new":
        return "신규";
      default:
        return null;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/cities/${city.slug}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {/* Placeholder for city image */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-6xl">🏙️</span>
          </div>

          {/* Badge */}
          {city.badge && (
            <Badge
              variant={getBadgeVariant(city.badge)}
              className="absolute top-3 right-3"
            >
              {getBadgeLabel(city.badge)}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link href={`/cities/${city.slug}`} className="flex-1">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              🏙️ {city.name}
            </h3>
            <p className="text-sm text-muted-foreground">📍 {city.region}</p>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-semibold">{city.rating}</span>
          <span className="text-sm text-muted-foreground">/5.0</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span>💰</span>
            <span className="font-medium">
              ₩{(city.monthlyCost / 10000).toFixed(0)}만/
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>📡</span>
            <span className="font-medium">{city.internetSpeed}Mbps</span>
            {city.internetSpeed >= 1000 && <span>🚀</span>}
          </div>
          <div className="flex items-center gap-1">
            <span>☕</span>
            <span>{city.cafeCount}+</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌤️</span>
            <span>{city.currentTemperature}°C</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div className="flex items-center gap-1">
            <span>👍</span>
            <span className="font-medium">{city.likeCount}%</span>
            <span className="text-muted-foreground">({city.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🧑‍💼</span>
            <span className="font-medium">{city.nomadsNow}명</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/cities/${city.slug}`}>자세히 →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add useState import at the top
import { useState } from "react";
