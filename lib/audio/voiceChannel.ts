// One voice at a time across the whole app: tour narration, read-aloud, Sound Safari, "Hear me",
// Quiet Minute. Whoever starts speaking stops whoever was speaking before.
type Stop = () => void;
let current: Stop | null = null;

export function claimVoice(stop: Stop) {
  if (current && current !== stop) current();
  current = stop;
}

export function releaseVoice(stop: Stop) {
  if (current === stop) current = null;
}
