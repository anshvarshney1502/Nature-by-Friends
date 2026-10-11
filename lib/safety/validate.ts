// Rejects text that tells a child to interact physically with wildlife.
// Negated forms ("don't touch", "never chase") are allowed: they are the safe advice.
const UNSAFE_VERBS =
  /\b(touch|hold|pick(?:\s+it)?\s+up|pick up|catch|capture|chase|grab|keep (?:it|them)|take (?:it|them) home|trap|feed|poke|pet(?!al)|stroke|dig(?:\s+\w+)?\s+up|dig|squash|pull|collect (?:it|them|the (?:bug|insect|animal|bird|egg)))/i;
const NEGATION = /\b(don'?t|do not|never|no|avoid|without|not)\b[^.!?]{0,30}$/i;
const DANGER_PLACES = /\b(nest|nests|eggs?|hive|hives|burrow|den)\b/i;
const APPROACH = /\b(go (?:near|close|up to)|approach|reach into|look inside|open)\b/i;

export function findUnsafe(text: string): string | null {
  for (const sentence of text.split(/(?<=[.!?])\s+|\n+/)) {
    const m = UNSAFE_VERBS.exec(sentence);
    if (m && !NEGATION.test(sentence.slice(0, m.index))) return sentence.trim();
    const a = APPROACH.exec(sentence);
    if (a && DANGER_PLACES.test(sentence) && !NEGATION.test(sentence.slice(0, a.index))) return sentence.trim();
  }
  return null;
}

export const isSafe = (text: string) => findUnsafe(text) === null;
