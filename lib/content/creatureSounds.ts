// Pre-generated with ElevenLabs (scripts/generate-sounds.mts). Nothing is generated at runtime.
// "call": the creature's own sound. "home": quiet creatures — we play where they live, and say so.
export type CreatureSound = { kind: "call" | "home"; label: string; prompt: string };

export const creatureSounds: Record<string, CreatureSound> = {
  honeybee: { kind: "call", label: "Buzzing", prompt: "A single honeybee buzzing close by around flowers, clear and natural, no music" },
  sparrow: { kind: "call", label: "Chirping", prompt: "House sparrows chirping cheerfully, close up, natural, no other birds, no music" },
  pigeon: { kind: "call", label: "Cooing", prompt: "A pigeon cooing softly, close up, calm, natural, no music" },
  crow: { kind: "call", label: "Cawing", prompt: "A crow cawing a few times from a tree, natural, outdoor, no music" },
  frog: { kind: "call", label: "Croaking", prompt: "A frog croaking by a pond at night, clear ribbit sounds, natural, no music" },
  grasshopper: { kind: "call", label: "Chirping song", prompt: "A grasshopper stridulating in a sunny grass meadow, rhythmic chirping, natural, no music" },
  squirrel: { kind: "call", label: "Chattering", prompt: "A squirrel chattering and squeaking in a tree, natural, outdoor, no music" },
  dragonfly: { kind: "call", label: "Wing hum", prompt: "A dragonfly's wings whirring as it hovers near a pond, soft, natural, no music" },
  butterfly: { kind: "home", label: "Its flower garden", prompt: "Quiet sunny flower garden, soft breeze, distant bees, gentle and calm, no music" },
  ladybug: { kind: "home", label: "Its leafy garden", prompt: "Close up gentle rustling of leaves in a calm garden, soft breeze, no music" },
  ant: { kind: "home", label: "Its busy path", prompt: "Very quiet outdoor garden path, light breeze, distant birds, calm, no music" },
  snail: { kind: "home", label: "Its rainy garden", prompt: "Gentle drizzle on leaves in a garden after rain, soft drips, calm, no music" },
  earthworm: { kind: "home", label: "Rain on its soil", prompt: "Soft rain falling on garden soil, gentle drips, calm, no thunder, no music" },
  caterpillar: { kind: "home", label: "Its leafy branch", prompt: "Leaves gently rustling on a branch in a soft breeze, calm, no music" },
  sunflower: { kind: "home", label: "Its sunny field", prompt: "Warm sunny field with a few bees buzzing between big flowers, light breeze, no music" },
  dandelion: { kind: "home", label: "The wind that carries its seeds", prompt: "Light gentle wind blowing across a grassy meadow, soft and airy, no music" },
  rose: { kind: "home", label: "Its garden visitors", prompt: "Quiet rose garden with one bee buzzing around flowers, soft birdsong far away, no music" },
  tree: { kind: "home", label: "Its rustling leaves", prompt: "A big leafy tree rustling in the wind, birds chirping in its branches, natural, no music" },
  mushroom: { kind: "home", label: "Its damp forest floor", prompt: "Damp quiet forest floor after rain, slow water drips, very calm, no music" },
  moss: { kind: "home", label: "Its shady wall", prompt: "Very quiet shady garden corner, slow water drips on stone, soft breeze, no music" },
};

/** Sound Safari rounds: only creatures with a real call. Reveal lines are curated and narrated in advance. */
export const safariRounds: { slug: string; reveal: string }[] = [
  { slug: "honeybee", reveal: "That was the honeybee! Bees buzz because their wings beat very, very fast." },
  { slug: "sparrow", reveal: "That was the sparrow! Sparrows chirp to stay in touch with their group." },
  { slug: "pigeon", reveal: "That was the pigeon! Listen for soft cooing in parks and on rooftops." },
  { slug: "crow", reveal: "That was the crow! Crows have many different calls to talk to their family." },
  { slug: "frog", reveal: "That was the frog! Many frogs sing at night, especially after rain." },
  { slug: "grasshopper", reveal: "That was the grasshopper! Many grasshoppers sing by rubbing their legs against their wings." },
  { slug: "squirrel", reveal: "That was the squirrel! Squirrels chatter and squeak, often from high up in a tree." },
];

export const safariIntro = "Welcome to Sound Safari! Listen carefully. Who is making this sound?";

// ElevenLabs reads <break> tags as real pauses (max 3s each).
export const quietMinuteScript = `Welcome to your quiet minute. Find a safe spot outside, with a trusted adult nearby. Sit or stand very still. <break time="2s" />
Close your eyes, or look softly at the ground. <break time="3s" />
Take a slow breath in. <break time="2s" /> And out. <break time="3s" />
Now, listen. What is the farthest sound you can hear? <break time="3s" /> <break time="3s" />
What is the closest sound? <break time="3s" /> <break time="3s" />
Can you hear a bird? The wind? Leaves moving? <break time="3s" /> <break time="3s" />
Count the different sounds on your fingers. <break time="3s" /> <break time="3s" /> <break time="3s" />
Slowly open your eyes. You just gave nature your full attention. That's what good friends do. Now, put the phone away, and go explore.`;
