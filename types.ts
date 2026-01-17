export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  thumbnail: string;
  description: string;
  badge?: "popular" | "rising" | "new";
  monthlyCost: number;
  rentStudio: number;
  deposit: number;
  internetSpeed: number;
  cafeCount: number;
  coworkingCount: number;
  avgTemperature: number;
  currentTemperature: number;
  airQuality: number;
  rating: number;
  nomadScore: number;
  reviewCount: number;
  likeCount: number;
  nomadsNow: number;
  isLiked?: boolean;
}

export interface Review {
  id: string;
  cityId: string;
  city: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  duration: string;
  helpfulCount: number;
  commentCount: number;
  timeAgo: string;
}

export interface Meetup {
  id: string;
  cityId: string;
  city: string;
  title: string;
  icon: string;
  description: string;
  type: "cafe" | "dinner" | "sports";
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: "confirmed" | "pending";
}

export interface TrendingCity {
  id: string;
  name: string;
  popularity: number;
  growthRate: number;
  trend: "up" | "down" | "neutral";
  insights: string[];
}

export interface CityDistribution {
  cityId: string;
  cityName: string;
  count: number;
}

export interface LiveDashboard {
  totalNomads: number;
  cityDistribution: CityDistribution[];
}

export interface PricingPlan {
  tier: "free" | "premium" | "pro";
  name: string;
  price: number;
  featured?: boolean;
  features: string[];
}

export interface StatCard {
  icon: string;
  value: number | string;
  label: string;
}

export interface FilterOption {
  icon: string;
  label: string;
  filter: string;
}
