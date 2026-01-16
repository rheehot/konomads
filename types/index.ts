// 도시 타입
export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  thumbnail: string;
  description: string;
  badge?: "popular" | "rising" | "new";

  // 생활비
  monthlyCost: number;
  rentStudio: number;
  deposit: number;

  // 인프라
  internetSpeed: number;
  cafeCount: number;
  coworkingCount: number;

  // 날씨
  avgTemperature: number;
  currentTemperature: number;
  airQuality: number;

  // 점수
  rating: number;
  nomadScore: number;

  // 통계
  reviewCount: number;
  likeCount: number;
  nomadsNow: number;

  // 기타
  isLiked?: boolean;
}

// 리뷰 타입
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
  isHelpful?: boolean;
  timeAgo: string;
}

// 밋업 타입
export interface Meetup {
  id: string;
  cityId: string;
  city: string;
  title: string;
  icon: string;
  description: string;
  type: "cafe" | "dinner" | "sports" | "etc";
  date: string;
  time: string;
  location: string;
  maxAttendees?: number;
  currentAttendees: number;
  status: "proposed" | "confirmed" | "full" | "ended";
}

// 트렌딩 도시 타입
export interface TrendingCity {
  id: string;
  name: string;
  popularity: number;
  growthRate: number;
  trend: "up" | "down" | "same";
  insights: string[];
}

// 실시간 대시보드 데이터 타입
export interface LiveDashboard {
  totalNomads: number;
  cityDistribution: {
    cityId: string;
    cityName: string;
    count: number;
  }[];
}

// 프리미엄 티어 타입
export type PricingTier = "free" | "premium" | "pro";

export interface PricingPlan {
  tier: PricingTier;
  name: string;
  price: number;
  featured?: boolean;
  features: string[];
}

// 필터 타입
export interface FilterOption {
  icon: string;
  label: string;
  filter: string;
}

// AI 추천 답변 타입
export interface AIRecommendationAnswer {
  budget: string;
  priorities: string[];
  style: string;
}

// 통계 카드 타입
export interface StatCard {
  icon: string;
  value: number;
  label: string;
}
