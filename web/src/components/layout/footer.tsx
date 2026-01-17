import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container max-w-screen-2xl py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-bold text-primary-foreground">FS</span>
              </div>
              <span className="font-bold">FingerScore</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              스마트 링으로 탁구 점수를 기록하고, 대회에 참가하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tournaments" className="hover:text-primary transition-colors">
                  대회
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-primary transition-colors">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-primary transition-colors">
                  랭킹
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-primary transition-colors">
                  라이브
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guide" className="hover:text-primary transition-colors">
                  이용 가이드
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">법적 고지</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FingerScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
