import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold">🏠 노마드코리아</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              한국 노마드를 위한 #1 플랫폼
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Since 2025</p>
          </div>

          {/* Service */}
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.service.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">커뮤니티</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Social combined for mobile */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-3 mb-6">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mb-4">소셜미디어</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.icon} {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 노마드코리아. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              사업자등록번호: 123-45-67890
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
