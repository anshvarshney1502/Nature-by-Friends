import { Creature } from "./Creature";

// Layered storybook garden: sky, hills, grass, and a few characters placed by hand.
export function GardenScene({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[4/3] w-full ${className}`} aria-hidden>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe8f3" />
            <stop offset="1" stopColor="#fbf5e6" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" rx="28" fill="url(#gs-sky)" />
        <circle cx="330" cy="58" r="26" fill="#f6d77a" />
        <circle cx="330" cy="58" r="38" fill="#f6d77a" opacity="0.25" />
        <path d="M40 60 q 14 -14 30 0 q 14 -10 24 4 h -54 z" fill="#fffdf7" opacity="0.9" />
        <path d="M200 40 q 10 -10 22 0 q 10 -8 18 3 h -40 z" fill="#fffdf7" opacity="0.9" />
        <path d="M0 190 C 70 140, 150 150, 220 180 C 290 150, 350 150, 400 170 L 400 300 L 0 300 Z" fill="#b7d79a" />
        <path d="M0 230 C 90 196, 190 210, 260 226 C 320 210, 370 206, 400 214 L 400 300 L 0 300 Z" fill="#8fbf6a" />
        <path d="M0 262 C 120 246, 280 250, 400 258 L 400 300 L 0 300 Z" fill="#6ea64b" />
        {Array.from({ length: 26 }, (_, i) => (
          <path key={i} d={`M${8 + i * 15} 270 q 2 -12 ${i % 2 ? 6 : -4} -18`} stroke="#3f6e2c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ))}
        <ellipse cx="300" cy="276" rx="20" ry="9" fill="#d6cdb8" stroke="#2d2a22" strokeWidth="2" />
        <ellipse cx="322" cy="282" rx="12" ry="6" fill="#c8bea6" stroke="#2d2a22" strokeWidth="2" />
      </svg>
      <Creature slug="tree" className="absolute left-[2%] bottom-[22%] w-[34%]" />
      <Creature slug="sunflower" className="absolute right-[6%] bottom-[18%] w-[24%]" />
      <Creature slug="dandelion" className="absolute left-[38%] bottom-[16%] w-[16%]" />
      <div className="anim-drift absolute left-[44%] top-[10%] w-[18%]"><Creature slug="butterfly" /></div>
      <div className="anim-bob absolute right-[26%] top-[26%] w-[13%]" style={{ animationDelay: "1s" }}><Creature slug="honeybee" /></div>
      <Creature slug="snail" className="absolute left-[30%] bottom-[2%] w-[16%]" />
      <Creature slug="ladybug" className="absolute right-[34%] bottom-[4%] w-[11%]" />
    </div>
  );
}
