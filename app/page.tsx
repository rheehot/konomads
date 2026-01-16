import { HeroSection } from "@/components/homepage/hero-section";
import { StatsSection } from "@/components/homepage/stats-section";
import { QuickFilters } from "@/components/homepage/quick-filters";
import { CityGrid } from "@/components/homepage/city-grid";
import { AIRecommendation } from "@/components/homepage/ai-recommendation";
import { MeetupSection } from "@/components/homepage/meetup-section";
import { ReviewSection } from "@/components/homepage/review-section";
import { TrendingSection } from "@/components/homepage/trending-section";
import { LiveDashboard } from "@/components/homepage/live-dashboard";
import { PricingSection } from "@/components/homepage/pricing-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Quick Filters */}
      <QuickFilters />

      {/* City Grid */}
      <CityGrid />

      {/* AI Recommendation */}
      <AIRecommendation />

      {/* Meetup Section */}
      <MeetupSection />

      {/* Review Section */}
      <ReviewSection />

      {/* Trending Section */}
      <TrendingSection />

      {/* Live Dashboard */}
      <LiveDashboard />

      {/* Pricing Section */}
      <PricingSection />
    </div>
  );
}
