export type WebNode = { id: string; label: string; x: number; y: number; slug?: string };
export type WebLink = { from: string; to: string; title: string; explain: string };

// Positions are in a 100x100 viewBox, laid out by hand.
export const webNodes: WebNode[] = [
  { id: "sun", label: "Sunlight", x: 50, y: 8 },
  { id: "sunflower", label: "Sunflower", x: 24, y: 30, slug: "sunflower" },
  { id: "dandelion", label: "Dandelion", x: 50, y: 34, slug: "dandelion" },
  { id: "tree", label: "Tree", x: 78, y: 28, slug: "tree" },
  { id: "honeybee", label: "Honeybee", x: 12, y: 54, slug: "honeybee" },
  { id: "butterfly", label: "Butterfly", x: 36, y: 56, slug: "butterfly" },
  { id: "caterpillar", label: "Caterpillar", x: 64, y: 56, slug: "caterpillar" },
  { id: "sparrow", label: "Sparrow", x: 88, y: 54, slug: "sparrow" },
  { id: "ant", label: "Ant", x: 22, y: 78, slug: "ant" },
  { id: "leaves", label: "Fallen leaves", x: 66, y: 78 },
  { id: "earthworm", label: "Earthworm", x: 44, y: 92, slug: "earthworm" },
  { id: "soil", label: "Soil", x: 84, y: 92 },
];

export const webLinks: WebLink[] = [
  { from: "sun", to: "tree", title: "Sunlight feeds the tree", explain: "Leaves use sunlight, air and water to make food. This is called photosynthesis." },
  { from: "sun", to: "sunflower", title: "Following the sun", explain: "Young sunflowers turn their heads to follow the sun during the day." },
  { from: "honeybee", to: "sunflower", title: "Pollen carriers", explain: "Bees collect nectar and pollen from flowers. Pollen they carry helps flowers make seeds." },
  { from: "honeybee", to: "dandelion", title: "Early food", explain: "Dandelions flower early in the year and give bees food when few other flowers are open." },
  { from: "butterfly", to: "sunflower", title: "Nectar sipper", explain: "Butterflies drink nectar and move pollen between flowers as they go." },
  { from: "caterpillar", to: "butterfly", title: "Growing up", explain: "A caterpillar is a young butterfly or moth. It changes inside a pupa." },
  { from: "caterpillar", to: "tree", title: "Leaf eaters", explain: "Many caterpillars eat leaves. Each kind usually eats only certain plants." },
  { from: "sparrow", to: "caterpillar", title: "Food for chicks", explain: "Many small birds feed insects like caterpillars to their chicks." },
  { from: "sparrow", to: "tree", title: "A place to rest", explain: "Trees give birds places to perch, shelter and sometimes nest." },
  { from: "tree", to: "leaves", title: "Leaves fall", explain: "Many trees drop old leaves, which land on the ground." },
  { from: "earthworm", to: "leaves", title: "Leaf recyclers", explain: "Earthworms pull fallen leaves underground and eat them." },
  { from: "earthworm", to: "soil", title: "Soil makers", explain: "Worm tunnels let air and water in, and worm castings make soil richer." },
  { from: "soil", to: "tree", title: "Roots drink", explain: "Tree roots take up water and nutrients from the soil." },
  { from: "ant", to: "dandelion", title: "Flower snackers", explain: "Ants sometimes visit flowers to sip a little nectar, though they are not as helpful at pollinating as bees." },
  { from: "ant", to: "soil", title: "Tiny tunnels", explain: "Ant tunnels help mix the soil and let air reach underground." },
  { from: "dandelion", to: "soil", title: "Seeds find ground", explain: "Dandelion seeds float on the wind. The ones that land on soil can grow." },
];
