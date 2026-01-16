import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative container px-4 md:px-6 py-12 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              🌏 한국에서 노마드로 살기 좋은 곳은?
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              지금 바로 당신에게 딱 맞는 도시를 찾아보세요
            </p>
          </div>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="이메일을 입력하세요..."
              className="flex-1 bg-white/90 backdrop-blur text-foreground"
            />
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              시작하기 →
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-200">
            <span>✓ 15개 주요 도시</span>
            <span>✓ 실시간 리뷰</span>
            <span>✓ 밋업 참여</span>
          </div>
        </div>
      </div>
    </section>
  );
}
