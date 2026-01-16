import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEETUPS } from "@/lib/constants";
import Link from "next/link";

export function MeetupSection() {
  return (
    <section className="py-16 md:py-24 border-b">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">🥥 다가오는 밋업</h2>
            <p className="text-muted-foreground mt-1">
              노마드들과 함께 오프라인으로 만나요
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/meetups">전체 보기 →</Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEETUPS.map((meetup) => (
            <Card key={meetup.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                {/* Icon & Title */}
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{meetup.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{meetup.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {meetup.description}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {meetup.date} {meetup.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{meetup.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>
                      {meetup.currentAttendees}명 참가
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/meetups/${meetup.id}`}>참가하기 →</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          연간 308개 밋업 · 월 26개 · 100+ 도시
        </div>
      </div>
    </section>
  );
}
