// First-visit guided tour. `voice` is narrated in advance with ElevenLabs (scripts/generate-sounds.mts).
export type TourSlide = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  voice: string;
  creatures: [string, string, string]; // back, middle, front layer of the 3D stage
  tone: string; // stage background
  href?: string;
  cta?: string;
};

export const tourSlides: TourSlide[] = [
  {
    id: "welcome",
    kicker: "Welcome",
    title: "Become a friend, not an owner",
    body: "Nature by Friends helps you meet the little lives outside, and learn to watch them kindly, without touching or catching.",
    voice: "Hello, and welcome to Nature by Friends! This is a place to meet the little lives that share your world, and learn how to be a kind friend to them. Let me show you around.",
    creatures: ["tree", "butterfly", "ladybug"],
    tone: "from-sky-soft to-leaf-soft",
  },
  {
    id: "garden",
    kicker: "The Nature Garden",
    title: "Twenty little neighbours",
    body: "Birds, bugs, flowers, frogs and fungi. Each friend has true facts, safe ways to watch, and what not to do.",
    voice: "In the Nature Garden, you can meet twenty little neighbours, from bees and butterflies to frogs and mushrooms. Every friend has true facts, and tips for watching safely.",
    creatures: ["sunflower", "frog", "squirrel"],
    tone: "from-butter-soft to-leaf-soft",
    href: "/garden",
    cta: "Visit the garden",
  },
  {
    id: "mission",
    kicker: "Become a Friend",
    title: "A tiny mission, then phone down",
    body: "Pick a friend, learn its boundaries, then go outside with a trusted adult. Come back and tell your journal what you noticed.",
    voice: "Missions are the heart of the app. Pick a friend, learn how to give it space, then put the phone down and go outside with a trusted adult. There's no timer, and not finding anything is completely okay.",
    creatures: ["snail", "earthworm", "caterpillar"],
    tone: "from-leaf-soft to-paper-deep",
    href: "/missions",
    cta: "Start a mission",
  },
  {
    id: "photo",
    kicker: "Photo helper",
    title: "Not sure who you met?",
    body: "Share a photo and our helper, the open Gemma 4 model, makes a careful guess. It says “might be” when unsure, and safety tips always come from us.",
    voice: "Met someone and not sure who it was? A grown-up can share a photo, and our helper makes a careful guess. If it isn't sure, it says so, and it always reminds you to ask a trusted adult.",
    creatures: ["dragonfly", "honeybee", "rose"],
    tone: "from-sky-soft to-butter-soft",
    href: "/missions",
    cta: "Try the photo helper",
  },
  {
    id: "listen",
    kicker: "The Listening Corner",
    title: "Train your ears",
    body: "Play Sound Safari and guess who's singing, or try the Quiet Minute. Every voice and sound here was made with ElevenLabs.",
    voice: "In the Listening Corner, you can play Sound Safari, and guess which friend is buzzing, croaking or chirping. Or try the Quiet Minute, and really listen to the world around you.",
    creatures: ["crow", "grasshopper", "sparrow"],
    tone: "from-butter-soft to-sky-soft",
    href: "/listen",
    cta: "Play Sound Safari",
  },
  {
    id: "journal",
    kicker: "Nature Journal",
    title: "Your memories stay with you",
    body: "Every mission becomes a journal page, saved only on this device. Visit the same spot again and compare then and now.",
    voice: "Every mission becomes a page in your Nature Journal. It's saved only on this device. You can visit the same spot again a few days later, and see what changed.",
    creatures: ["moss", "dandelion", "pigeon"],
    tone: "from-paper-deep to-butter-soft",
    href: "/journal",
    cta: "Open my journal",
  },
  {
    id: "web",
    kicker: "Friendship Web",
    title: "Nobody in nature lives alone",
    body: "Tap any friend to see who it helps: worms feed the soil, fungi help tree roots, bees carry pollen.",
    voice: "In the Friendship Web, you can see how everyone helps each other. Worms make soil, fungi help tree roots, and bees carry pollen from flower to flower.",
    creatures: ["mushroom", "earthworm", "tree"],
    tone: "from-leaf-soft to-sky-soft",
    href: "/ecosystem",
    cta: "Explore the web",
  },
  {
    id: "stories",
    kicker: "Tiny Nature Stories",
    title: "Real facts, gentle imagination",
    body: "Short stories about every friend. A leaf marks the true facts; a sparkle marks the made-up parts.",
    voice: "Tiny Nature Stories tell you about each friend. Look for the leaf, which means a real fact, and the sparkle, which means a bit of imagination.",
    creatures: ["butterfly", "sunflower", "honeybee"],
    tone: "from-butter-soft to-paper-deep",
    href: "/stories",
    cta: "Read a story",
  },
  {
    id: "safe",
    kicker: "Safe by design",
    title: "Made for kids, checked by grown-ups",
    body: "No accounts, no location, no ads, no streaks. Grown-ups can read exactly how it works on the parents page.",
    voice: "Nature by Friends has no accounts, no location tracking, and no ads. Grown-ups can read exactly how it works on the parents page. Now, let's go and meet some friends!",
    creatures: ["ladybug", "frog", "sparrow"],
    tone: "from-sky-soft to-leaf-soft",
    href: "/parents",
    cta: "For grown-ups",
  },
];
