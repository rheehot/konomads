import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Home } from 'lucide-react'

interface CityPageProps {
  params: {
    slug: string
  }
}

export default function CityPage({ params }: CityPageProps) {
  const city = CITIES.find((c) => c.slug === params.slug)

  if (!city) {
    notFound()
  }

  // Find related cities in the same region (max 4)
  const relatedCities = CITIES
    .filter((c) => c.region === city.region && c.id !== city.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로가기
            </Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-blue-100 to-blue-200">
        <div className="container flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">🏙️ {city.name}</h1>
            <p className="text-xl text-muted-foreground">📍 {city.region}</p>
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-8">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>도시 개요</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="text-2xl font-bold">{city.rating}</span>
                <span className="text-sm text-muted-foreground">/5.0</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{city.description}</p>
            <div className="flex flex-wrap gap-2">
              {city.badge && (
                <Badge variant="default">
                  {city.badge === 'popular' && '인기'}
                  {city.badge === 'rising' && '상승'}
                  {city.badge === 'new' && '신규'}
                </Badge>
              )}
              <Badge variant="outline">리뷰 {city.reviewCount}개</Badge>
              <Badge variant="outline">좋아요 {city.likeCount}%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Living Cost Info */}
        <Card>
          <CardHeader>
            <CardTitle>💰 생활 비용</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">월 생활비</p>
                <p className="text-2xl font-bold">
                  ₩{(city.monthlyCost / 10000).toFixed(0)}만
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">원룸 월세</p>
                <p className="text-2xl font-bold">
                  ₩{(city.rentStudio / 10000).toFixed(0)}만
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">보증금</p>
                <p className="text-2xl font-bold">
                  ₩{(city.deposit / 10000).toFixed(0)}만
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Info */}
        <Card>
          <CardHeader>
            <CardTitle>📡 인프라</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">인터넷 속도</p>
                <p className="text-2xl font-bold">
                  {city.internetSpeed}Mbps
                  {city.internetSpeed >= 1000 && <span className="ml-2">🚀</span>}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">카페 수</p>
                <p className="text-2xl font-bold">{city.cafeCount}개</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">코워킹 스페이스</p>
                <p className="text-2xl font-bold">{city.coworkingCount}개</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather/Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>🌤️ 날씨 & 환경</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">현재 온도</p>
                <p className="text-2xl font-bold">{city.currentTemperature}°C</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">평균 온도</p>
                <p className="text-2xl font-bold">{city.avgTemperature}°C</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">공기 질</p>
                <p className="text-2xl font-bold">{city.airQuality}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {city.airQuality <= 50 ? '좋음' : city.airQuality <= 100 ? '보통' : '나쁨'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Cities */}
        {relatedCities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📍 같은 지역 다른 도시</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedCities.map((related) => (
                  <Link
                    key={related.id}
                    href={`/cities/${related.slug}`}
                    className="group"
                  >
                    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-all">
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        🏙️ {related.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{related.rating}</span>
                        <span className="text-muted-foreground">/5.0</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ₩{(related.monthlyCost / 10000).toFixed(0)}만/월
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
