// Rules shared by every mission. Shown in step 3 of the journey and on the parents page.
export const friendRules = [
  "Look with your eyes, not your hands.",
  "Never chase, catch or keep a wild animal.",
  "Leave nests, eggs and hiding places alone.",
  "Don't feed wild animals.",
  "If an animal looks scared or hurt, step away and tell a trusted adult.",
  "If you see something that might sting or bite, stop and tell a trusted adult.",
];

/** Used when no friend is chosen, or when a photo can't be matched to a curated friend. */
export const listeningMission = {
  title: "The Quiet Listener",
  steps: [
    "Find a safe spot outside with a trusted adult nearby.",
    "Stand or sit very still and close your eyes.",
    "Count how many different sounds you hear: birds, wind, leaves, insects.",
  ],
  ifNothingFound: "Even quiet is something to notice. Was it windy, warm, or still?",
};
