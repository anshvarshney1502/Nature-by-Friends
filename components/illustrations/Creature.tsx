import type { ReactNode } from "react";

// One hand-drawn style for every character: 2.5px ink outline, round caps,
// big friendly eyes (Eye) and a small smile (Smile). viewBox is always 120x120.
const INK = "#2d2a22";
const S = { stroke: INK, strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Eye({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return (
    <g className="anim-blink">
      <circle cx={x} cy={y} r={r} fill="#fff" {...S} strokeWidth={2} />
      <circle cx={x + r * 0.15} cy={y + r * 0.1} r={r * 0.55} fill={INK} />
      <circle cx={x + r * 0.35} cy={y - r * 0.25} r={r * 0.2} fill="#fff" />
    </g>
  );
}
const Smile = ({ x, y, w = 6 }: { x: number; y: number; w?: number }) => (
  <path d={`M${x - w / 2} ${y} q ${w / 2} ${w * 0.6} ${w} 0`} fill="none" {...S} strokeWidth={2} />
);
const Cheek = ({ x, y }: { x: number; y: number }) => <ellipse cx={x} cy={y} rx={3.5} ry={2.2} fill="#e98f78" opacity={0.55} />;

const art: Record<string, ReactNode> = {
  butterfly: (
    <>
      <g className="anim-flutter">
        <path d="M58 52 C 40 22, 10 26, 16 50 C 20 62, 40 64, 58 60 Z" fill="#e0785f" {...S} />
        <path d="M62 52 C 80 22, 110 26, 104 50 C 100 62, 80 64, 62 60 Z" fill="#e0785f" {...S} />
        <path d="M58 62 C 40 66, 26 84, 40 92 C 50 96, 56 80, 58 70 Z" fill="#f6d77a" {...S} />
        <path d="M62 62 C 80 66, 94 84, 80 92 C 70 96, 64 80, 62 70 Z" fill="#f6d77a" {...S} />
        <circle cx="32" cy="45" r="5" fill="#fbf5e6" /><circle cx="88" cy="45" r="5" fill="#fbf5e6" />
        <circle cx="44" cy="84" r="3" fill="#e0785f" /><circle cx="76" cy="84" r="3" fill="#e0785f" />
      </g>
      <ellipse cx="60" cy="68" rx="5" ry="20" fill="#5c4632" {...S} />
      <path d="M56 40 q -6 -14 -14 -14 M64 40 q 6 -14 14 -14" fill="none" {...S} />
      <circle cx="42" cy="26" r="2.5" fill={INK} /><circle cx="78" cy="26" r="2.5" fill={INK} />
      <circle cx="60" cy="44" r="9" fill="#5c4632" {...S} />
      <Eye x={56.5} y={43} r={3.2} /><Eye x={63.5} y={43} r={3.2} />
    </>
  ),
  honeybee: (
    <>
      <g className="anim-flutter" opacity="0.85">
        <ellipse cx="52" cy="40" rx="14" ry="20" transform="rotate(-25 52 40)" fill="#e2f1f7" {...S} />
        <ellipse cx="72" cy="40" rx="14" ry="20" transform="rotate(25 72 40)" fill="#e2f1f7" {...S} />
      </g>
      <ellipse cx="66" cy="70" rx="32" ry="24" fill="#f6d77a" {...S} />
      <path d="M58 47 q -6 23 0 46 M74 47 q 6 23 0 46" fill="none" stroke={INK} strokeWidth="7" />
      <path d="M98 70 l 8 0" {...S} strokeWidth={3} />
      <circle cx="34" cy="68" r="16" fill="#5c4632" {...S} />
      <path d="M28 54 q -4 -10 -12 -12 M38 53 q 2 -10 8 -14" fill="none" {...S} />
      <Eye x={28} y={66} r={4.5} /><Eye x={40} y={66} r={4.5} />
      <Smile x={34} y={75} />
    </>
  ),
  ladybug: (
    <>
      <path d="M30 90 l -10 8 M60 96 l 0 10 M90 90 l 10 8 M28 70 l -12 0 M92 70 l 12 0" {...S} />
      <path d="M26 72 a 34 32 0 0 1 68 0 a 34 26 0 0 1 -68 0 Z" fill="#e0785f" {...S} />
      <path d="M60 42 L 60 98" {...S} />
      <circle cx="44" cy="62" r="6" fill={INK} /><circle cx="76" cy="62" r="6" fill={INK} />
      <circle cx="40" cy="82" r="5" fill={INK} /><circle cx="80" cy="82" r="5" fill={INK} />
      <circle cx="60" cy="88" r="3.5" fill={INK} />
      <path d="M40 44 a 20 16 0 0 1 40 0 Z" fill={INK} {...S} />
      <path d="M50 30 q -4 -8 -10 -10 M70 30 q 4 -8 10 -10" fill="none" {...S} />
      <Eye x={52} y={37} r={4.5} /><Eye x={68} y={37} r={4.5} />
    </>
  ),
  ant: (
    <>
      <path d="M50 74 l -12 18 l -6 2 M58 76 l -2 22 M66 74 l 12 18 l 6 2 M50 72 l -16 -4 M68 72 l 16 -6" fill="none" {...S} />
      <ellipse cx="88" cy="68" rx="20" ry="16" fill="#7a4a30" {...S} />
      <ellipse cx="60" cy="70" rx="11" ry="9" fill="#7a4a30" {...S} />
      <circle cx="32" cy="58" r="16" fill="#7a4a30" {...S} />
      <path d="M24 44 q -6 -14 -16 -14 M36 43 q 2 -14 12 -18" fill="none" {...S} />
      <Eye x={26} y={56} r={4.5} /><Eye x={38} y={56} r={4.5} />
      <Smile x={32} y={66} />
    </>
  ),
  snail: (
    <>
      <path d="M14 96 C 14 84, 30 78, 44 80 L 98 80 C 108 80, 110 96, 98 96 Z" fill="#c9cfa2" {...S} />
      <path d="M26 82 L 22 54 M36 81 L 38 52" {...S} />
      <Eye x={22} y={50} r={5} /><Eye x={38} y={48} r={5} />
      <Smile x={24} y={88} />
      <circle cx="74" cy="60" r="27" fill="#d8a46a" {...S} />
      <path d="M74 60 m -3 0 a 3 3 0 1 1 6 0 a 8 8 0 1 1 -14 -2 a 14 14 0 1 1 26 6 a 20 20 0 1 1 -38 -8" fill="none" {...S} stroke="#8a5a3b" />
    </>
  ),
  earthworm: (
    <>
      <path d="M8 104 Q 60 86 112 104 L 112 116 L 8 116 Z" fill="#8a5a3b" {...S} />
      <path d="M22 96 C 22 70, 50 82, 56 66 C 62 50, 82 46, 88 36" fill="none" stroke={INK} strokeWidth="19" strokeLinecap="round" />
      <path d="M22 96 C 22 70, 50 82, 56 66 C 62 50, 82 46, 88 36" fill="none" stroke="#e7a593" strokeWidth="14" strokeLinecap="round" />
      <path d="M30 78 l 6 4 M44 76 l 4 6 M54 70 l 6 2 M62 58 l 6 4 M72 48 l 4 6" {...S} strokeWidth={1.6} stroke="#b56d5a" />
      <path d="M40 74 l 10 -2" stroke="#d07a66" strokeWidth="6" strokeLinecap="round" />
      <Eye x={84} y={33} r={4} /><Eye x={94} y={38} r={4} />
      <Smile x={88} y={45} w={5} />
    </>
  ),
  caterpillar: (
    <>
      <path d="M6 100 C 30 76, 90 76, 114 100 C 90 110, 30 110, 6 100 Z" fill="#7cb35a" {...S} />
      <path d="M10 100 C 40 94, 80 94, 112 100" fill="none" {...S} stroke="#3f6e2c" />
      {[22, 38, 54, 70].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${86 - (i % 2) * 2} l 0 8`} {...S} />
          <circle cx={x} cy={76 - (i % 2) * 3} r="11" fill={i % 2 ? "#cfe5b4" : "#9cc87a"} {...S} />
        </g>
      ))}
      <circle cx="88" cy="64" r="16" fill="#9cc87a" {...S} />
      <path d="M82 50 l -4 -10 M94 50 l 4 -10" {...S} />
      <circle cx="78" cy="39" r="3" fill="#f6d77a" {...S} strokeWidth={1.5} /><circle cx="98" cy="39" r="3" fill="#f6d77a" {...S} strokeWidth={1.5} />
      <Eye x={83} y={62} r={4.5} /><Eye x={95} y={62} r={4.5} />
      <Cheek x={80} y={71} /><Smile x={90} y={71} />
    </>
  ),
  sparrow: (
    <>
      <path d="M22 70 L 6 58 L 10 76 Z" fill="#8a5a3b" {...S} />
      <ellipse cx="54" cy="70" rx="36" ry="28" fill="#b98455" {...S} />
      <path d="M40 76 C 50 98, 80 96, 86 74 C 74 82, 54 84, 40 76 Z" fill="#efe2c8" />
      <path d="M30 62 C 40 52, 62 56, 66 70 C 56 76, 38 74, 30 62 Z" fill="#8a5a3b" {...S} />
      <path d="M36 66 l 10 2 M42 62 l 10 3" stroke="#efe2c8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="82" cy="50" r="18" fill="#b98455" {...S} />
      <path d="M70 40 C 76 30, 92 30, 98 42 C 90 38, 78 38, 70 40 Z" fill="#8a5a3b" />
      <path d="M98 50 l 12 4 l -12 4 Z" fill="#f6d77a" {...S} />
      <Eye x={86} y={48} r={5} />
      <Cheek x={86} y={58} />
      <path d="M48 96 l -2 12 l -4 2 M48 108 l 4 2 M62 96 l 0 12 l -4 2 M62 108 l 4 2" fill="none" {...S} stroke="#c47a4b" />
    </>
  ),
  pigeon: (
    <>
      <path d="M18 74 L 4 70 L 14 84 Z" fill="#8f97a3" {...S} />
      <ellipse cx="52" cy="76" rx="38" ry="24" fill="#b7bec8" {...S} />
      <path d="M26 70 C 40 60, 64 62, 70 76 C 58 82, 38 82, 26 70 Z" fill="#9aa2ae" {...S} />
      <path d="M36 72 l 20 0 M38 77 l 18 0" stroke="#5f6773" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 70 C 70 52, 76 40, 84 38 C 92 40, 94 56, 88 74 Z" fill="#6aa58f" {...S} />
      <path d="M74 64 C 78 56, 86 56, 90 62" fill="none" stroke="#9b7bb0" strokeWidth="4" strokeLinecap="round" />
      <circle cx="86" cy="36" r="14" fill="#9aa2ae" {...S} />
      <path d="M99 36 l 10 4 l -10 3 Z" fill="#5c5646" {...S} />
      <circle cx="98" cy="33" r="2.5" fill="#fbf5e6" />
      <Eye x={89} y={34} r={4.5} />
      <path d="M46 98 l 0 10 M44 108 l 6 0 M62 98 l 0 10 M60 108 l 6 0" {...S} stroke="#d0654c" />
    </>
  ),
  sunflower: (
    <>
      <path d="M60 64 C 58 84, 62 98, 60 118" fill="none" {...S} stroke="#3f6e2c" strokeWidth={4} />
      <path d="M60 96 C 46 82, 30 86, 26 96 C 36 102, 50 102, 60 96 Z" fill="#7cb35a" {...S} />
      <path d="M61 104 C 74 90, 92 94, 96 102 C 86 110, 70 110, 61 104 Z" fill="#7cb35a" {...S} />
      <g className="anim-sway">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx="60" cy="18" rx="7" ry="15" fill={i % 2 ? "#f6d77a" : "#efc24f"} {...S} strokeWidth={2} transform={`rotate(${(i * 360) / 14} 60 44)`} />
        ))}
        <circle cx="60" cy="44" r="19" fill="#7a4a30" {...S} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={60 + Math.cos(i * 2.4) * (4 + i * 1.6)} cy={44 + Math.sin(i * 2.4) * (4 + i * 1.6)} r="1.4" fill="#c99868" />
        ))}
        <Eye x={53} y={42} r={4.5} /><Eye x={67} y={42} r={4.5} />
        <Smile x={60} y={52} />
      </g>
    </>
  ),
  dandelion: (
    <>
      <path d="M60 60 C 56 80, 64 100, 60 118" fill="none" {...S} stroke="#3f6e2c" strokeWidth={3.5} />
      <path d="M58 112 C 44 104, 36 92, 30 96 C 34 108, 46 114, 58 114 Z" fill="#7cb35a" {...S} />
      <g className="anim-sway">
        <circle cx="60" cy="42" r="28" fill="#fffdf7" stroke="#d6d2c2" strokeWidth="2" strokeDasharray="2 4" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <path key={i} d={`M60 42 L ${60 + Math.cos(a) * 26} ${42 + Math.sin(a) * 26}`} stroke="#d6d2c2" strokeWidth="1.5" />;
        })}
        <circle cx="60" cy="42" r="9" fill="#d9c79a" {...S} strokeWidth={2} />
        <Eye x={56} y={41} r={3} /><Eye x={64} y={41} r={3} />
      </g>
      <g className="anim-drift">
        <path d="M98 22 l -6 10 M98 22 l -4 -4 M98 22 l 2 -5 M98 22 l 5 -2" stroke="#b4ae9a" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="92" cy="32" r="1.6" fill="#8a5a3b" />
      </g>
    </>
  ),
  tree: (
    <>
      <path d="M48 118 C 52 100, 50 82, 46 70 L 74 70 C 70 82, 68 100, 72 118 Z" fill="#a46e48" {...S} />
      <path d="M56 100 q 4 -6 0 -12 M64 88 q -3 -4 0 -8" fill="none" {...S} stroke="#7a4a30" />
      <g className="anim-sway" style={{ animationDuration: "7s" }}>
        <path d="M60 8 C 84 6, 104 22, 104 42 C 112 56, 100 76, 80 74 C 70 82, 50 82, 40 74 C 20 76, 8 58, 16 44 C 14 24, 36 8, 60 8 Z" fill="#7cb35a" {...S} />
        <path d="M34 34 q 8 -8 18 -4 M70 22 q 10 -2 16 6 M76 52 q 10 0 14 -8" fill="none" stroke="#3f6e2c" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="56" r="3" fill="#e0785f" /><circle cx="84" cy="30" r="3" fill="#e0785f" />
      </g>
      <Eye x={54} y={92} r={4} /><Eye x={66} y={92} r={4} />
      <Smile x={60} y={101} />
    </>
  ),
  dragonfly: (
    <>
      <g className="anim-flutter" opacity="0.9">
        <ellipse cx="38" cy="40" rx="26" ry="9" transform="rotate(-12 38 40)" fill="#e2f1f7" {...S} strokeWidth={2} />
        <ellipse cx="82" cy="40" rx="26" ry="9" transform="rotate(12 82 40)" fill="#e2f1f7" {...S} strokeWidth={2} />
        <ellipse cx="40" cy="56" rx="22" ry="8" transform="rotate(10 40 56)" fill="#cfe8f3" {...S} strokeWidth={2} />
        <ellipse cx="80" cy="56" rx="22" ry="8" transform="rotate(-10 80 56)" fill="#cfe8f3" {...S} strokeWidth={2} />
      </g>
      <path d="M60 52 L 60 112" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M60 52 L 60 112" stroke="#5aa0b8" strokeWidth="5" strokeLinecap="round" />
      {[66, 76, 86, 96].map((y) => <path key={y} d={`M57 ${y} h6`} stroke="#2f6f86" strokeWidth="2" />)}
      <ellipse cx="60" cy="46" rx="9" ry="10" fill="#5aa0b8" {...S} />
      <circle cx="60" cy="28" r="12" fill="#5aa0b8" {...S} />
      <Eye x={54} y={26} r={5.5} /><Eye x={66} y={26} r={5.5} />
      <Smile x={60} y={35} w={5} />
    </>
  ),
  grasshopper: (
    <>
      <path d="M8 104 Q 60 96 112 104" fill="none" stroke="#3f6e2c" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 72 L 98 46 L 104 98" fill="none" {...S} stroke="#5f8f2f" strokeWidth={6} />
      <path d="M70 72 L 98 46 L 104 98" fill="none" {...S} />
      <path d="M44 80 l -8 22 M54 82 l 0 20" {...S} />
      <path d="M22 70 C 30 56, 80 58, 96 72 C 84 86, 34 88, 22 70 Z" fill="#8cc152" {...S} />
      <path d="M40 66 C 60 60, 82 64, 94 72" fill="none" stroke="#5f8f2f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="26" cy="62" rx="15" ry="14" fill="#8cc152" {...S} />
      <path d="M22 50 q -6 -16 -2 -30 M30 50 q 6 -16 16 -26" fill="none" {...S} />
      <Eye x={21} y={60} r={5} /><Eye x={32} y={59} r={4.5} />
      <Smile x={25} y={70} w={5} />
    </>
  ),
  squirrel: (
    <>
      <path className="anim-sway" d="M66 98 C 100 104, 116 74, 104 46 C 96 26, 76 24, 74 40 C 90 40, 96 60, 86 76 C 80 86, 70 90, 66 98 Z" fill="#c9824b" {...S} />
      <path d="M86 50 C 92 58, 92 68, 86 76" fill="none" stroke="#e7b07c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="54" cy="84" rx="22" ry="24" fill="#c9824b" {...S} />
      <ellipse cx="50" cy="90" rx="12" ry="15" fill="#f1d9b5" />
      <path d="M44 106 q -6 4 -12 2 M62 106 q 6 4 12 2" {...S} />
      <circle cx="46" cy="50" r="18" fill="#c9824b" {...S} />
      <path d="M32 38 l -4 -12 l 10 6 M56 34 l 6 -10 l 2 12" fill="#c9824b" {...S} />
      <circle cx="36" cy="80" r="7" fill="#8a5a3b" {...S} />
      <path d="M33 74 q 3 -3 6 0" stroke="#5c4632" strokeWidth="2" fill="none" />
      <Eye x={40} y={48} r={4.5} /><Eye x={53} y={48} r={4.5} />
      <circle cx="46" cy="57" r="2.5" fill={INK} />
      <Cheek x={36} y={57} /><Cheek x={57} y={57} />
    </>
  ),
  crow: (
    <>
      <path d="M20 66 L 4 84 L 24 80 Z" fill="#2f3440" {...S} />
      <ellipse cx="54" cy="72" rx="36" ry="26" fill="#3a4050" {...S} />
      <path d="M28 66 C 40 56, 66 58, 72 74 C 60 82, 38 80, 28 66 Z" fill="#2f3440" {...S} />
      <path d="M36 70 l 22 0 M38 75 l 20 1" stroke="#5b6478" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="84" cy="46" r="20" fill="#3a4050" {...S} />
      <path d="M100 44 L 118 50 L 100 56 Z" fill="#5c5646" {...S} />
      <Eye x={88} y={42} r={5.5} />
      <path d="M72 30 q 6 -6 14 -4" stroke="#6c7690" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M46 96 l -2 12 l -5 2 M44 108 l 5 2 M62 96 l 0 12 l -5 2 M62 108 l 5 2" fill="none" {...S} />
    </>
  ),
  frog: (
    <>
      <ellipse cx="60" cy="104" rx="50" ry="10" fill="#a9d3e8" />
      <path d="M22 96 C 10 96, 14 82, 28 84 M98 96 C 110 96, 106 82, 92 84" fill="#7cb35a" {...S} />
      <ellipse cx="60" cy="78" rx="38" ry="26" fill="#7cb35a" {...S} />
      <ellipse cx="60" cy="86" rx="24" ry="14" fill="#e4f0c8" />
      <circle cx="40" cy="50" r="14" fill="#7cb35a" {...S} />
      <circle cx="80" cy="50" r="14" fill="#7cb35a" {...S} />
      <Eye x={40} y={49} r={8} /><Eye x={80} y={49} r={8} />
      <path d="M44 72 q 16 12 32 0" fill="none" {...S} />
      <Cheek x={34} y={72} /><Cheek x={86} y={72} />
      <path d="M40 100 l -6 6 M44 101 l 0 7 M76 101 l 0 7 M80 100 l 6 6" {...S} />
    </>
  ),
  rose: (
    <>
      <path d="M60 64 C 58 84, 62 100, 60 118" fill="none" stroke="#3f6e2c" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 82 l -5 -3 M61 96 l 5 -3 M59 108 l -5 -2" stroke="#3f6e2c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 90 C 46 78, 30 84, 28 94 C 40 100, 52 98, 60 90 Z" fill="#7cb35a" {...S} />
      <path d="M61 102 C 74 92, 90 96, 92 104 C 82 110, 68 110, 61 102 Z" fill="#7cb35a" {...S} />
      <g className="anim-sway">
        <path d="M30 40 C 26 18, 52 8, 60 20 C 68 8, 94 18, 90 40 C 92 60, 74 70, 60 68 C 46 70, 28 60, 30 40 Z" fill="#e0785f" {...S} />
        <path d="M42 38 C 40 26, 58 20, 62 30 C 70 24, 82 32, 76 44 C 70 56, 50 56, 42 38 Z" fill="#ec9a86" {...S} strokeWidth={2} />
        <path d="M54 36 q 6 -8 12 0" fill="none" stroke="#c45a43" strokeWidth="2.5" strokeLinecap="round" />
        <Eye x={52} y={46} r={4} /><Eye x={68} y={46} r={4} />
        <Smile x={60} y={55} w={5} />
      </g>
    </>
  ),
  mushroom: (
    <>
      <path d="M10 108 Q 60 98 110 108 L 110 118 L 10 118 Z" fill="#8a5a3b" {...S} />
      <path d="M44 70 C 42 88, 44 100, 42 108 L 78 108 C 76 100, 78 88, 76 70 Z" fill="#f4ead2" {...S} />
      <path d="M14 66 C 14 30, 106 30, 106 66 C 90 74, 30 74, 14 66 Z" fill="#e0785f" {...S} />
      <circle cx="40" cy="48" r="6" fill="#fbf5e6" /><circle cx="64" cy="40" r="7" fill="#fbf5e6" /><circle cx="86" cy="54" r="5" fill="#fbf5e6" />
      <Eye x={53} y={86} r={4.5} /><Eye x={67} y={86} r={4.5} />
      <Smile x={60} y={96} w={5} />
      <Cheek x={47} y={95} /><Cheek x={73} y={95} />
    </>
  ),
  moss: (
    <>
      <ellipse cx="60" cy="96" rx="52" ry="20" fill="#b8b0a0" {...S} />
      <path d="M12 92 C 14 66, 40 62, 50 70 C 56 54, 82 54, 88 68 C 100 62, 112 76, 108 92 C 80 100, 40 100, 12 92 Z" fill="#6ea64b" {...S} />
      {[22, 34, 46, 58, 70, 82, 94].map((x, i) => (
        <path key={x} d={`M${x} ${84 - (i % 3) * 3} q ${i % 2 ? 2 : -2} -6 0 -10`} stroke="#3f6e2c" strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
      <path d="M70 66 C 70 50, 74 40, 78 34 M44 70 C 42 54, 40 46, 38 40" fill="none" stroke="#8a5a3b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="78" cy="32" r="3" fill="#c99868" {...S} strokeWidth={1.5} /><circle cx="38" cy="38" r="3" fill="#c99868" {...S} strokeWidth={1.5} />
      <Eye x={52} y={80} r={4.5} /><Eye x={66} y={80} r={4.5} />
      <Smile x={59} y={89} w={5} />
    </>
  ),
};

export const creatureSlugs = Object.keys(art);

export function Creature({ slug, className, label }: { slug: string; className?: string; label?: string }) {
  const body = art[slug] ?? art.tree; // safe fallback, never a broken image
  return (
    <svg viewBox="0 0 120 120" className={className} role={label ? "img" : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
      {body}
    </svg>
  );
}
