export type CategoryId = "tiny" | "birds" | "pollinators" | "plants" | "trees" | "soil";

export type Category = {
  id: CategoryId;
  name: string;
  intro: string;
  activity: string;
};

export type StoryPart = { kind: "fact" | "imagine"; text: string };

export type Friend = {
  slug: string;
  name: string; // common name
  nickname: string; // story character name
  category: CategoryId;
  tagline: string;
  description: string;
  facts: string[];
  habitat: string;
  mightBeDoing: string[];
  whyItMatters: string;
  safeWatching: string[];
  dontDo: string[];
  mission: { title: string; steps: string[]; ifNothingFound: string };
  related: string[]; // slugs
  story: { title: string; parts: StoryPart[]; question: string };
};
