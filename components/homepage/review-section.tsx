import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { REVIEWS } from "@/lib/constants";
import Link from "next/link";

export function ReviewSection() {
  const renderStars = (rating: number) => {
    return "⭐".repeat(Math.floor(rating));
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">💬 최근 리뷰</h2>
            <p className="text-muted-foreground mt-1">
              실제 노마드들의 솔직한 후기
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/reviews">전체 보기 →</Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.slice(0, 2).map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                    <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">👤 {review.user.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">{renderStars(review.rating)}</span>
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      📍 {review.city} · {review.duration}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Content */}
                <p className="text-sm leading-relaxed">&ldquo;{review.content}&rdquo;</p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <span>👍</span>
                      <span>{review.helpfulCount}명 도움됨</span>
                    </button>
                    <Link
                      href={`/reviews/${review.id}`}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      <span>💬</span>
                      <span>{review.commentCount}개 댓글</span>
                    </Link>
                  </div>
                  <span>⏰ {review.timeAgo}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Add Button import
import { Button } from "@/components/ui/button";
