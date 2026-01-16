"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AIRecommendation() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              🤖 AI 추천 받기
            </h2>
            <p className="text-muted-foreground">
              3가지 질문으로 당신에게 딱 맞는 도시를 추천해드립니다
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Q1 */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Q1. 선호하는 월 생활비는?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["150만원 이하", "150-200만원", "200-250만원", "250만원+"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={option}
                          className="sr-only"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Q2 */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Q2. 가장 중요한 요소는? (3개 선택)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "빠른 인터넷",
                    "많은 카페",
                    "조용한 환경",
                    "자연 접근성",
                    "저렴한 물가",
                    "따뜻한 날씨",
                    "활발한 커뮤니티",
                    "서울 근처",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="priorities"
                        value={option}
                        className="sr-only"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Q3. 선호하는 스타일은?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["혼자 조용히", "친구들과", "가족과 함께"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                      >
                        <input
                          type="radio"
                          name="style"
                          value={option}
                          className="sr-only"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button size="lg" className="w-full">
                🎯 맞춤 도시 추천받기 →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
