import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fredoka, Nunito } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { OnboardingTour, TourButton } from "@/components/tour/OnboardingTour";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Nature by Friends", template: "%s · Nature by Friends" },
  description: "Meet the little lives that share your world. Become a friend, not an owner.",
};
export const viewport: Viewport = { themeColor: "#fbf5e6" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:pb-16">
          {children}
        </main>
        <footer className="border-t-2 border-leaf/15 px-4 pb-24 pt-6 text-sm text-ink-soft md:pb-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <p>Step outside. Look closer. Discover a little wonder.</p>
            <div className="flex flex-wrap items-center gap-4">
              <TourButton className="btn-ghost inline-flex items-center gap-1.5 font-bold" />
              <Link href="/parents" className="btn-ghost font-bold">For parents &amp; educators</Link>
            </div>
          </div>
        </footer>
        <OnboardingTour />
      </body>
    </html>
  );
}
