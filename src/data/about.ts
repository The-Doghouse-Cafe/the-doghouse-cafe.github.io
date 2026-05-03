export const aboutPage = {
  title: "About | Dog House Cafe",
  description: "About Dog House Cafe and the people building it.",
  backLink: {
    href: "/",
    label: "\u2190 Back to Dog House Cafe",
  },
  hero: {
    title: "About Dog House Cafe",
    paragraphs: [
      "Dog House Cafe is a community for real-world engineering: production failures, weird edge cases, debugging paths, partial answers, and the gap between \u201cit should work\u201d and what actually happens.",
      "This is not polished thought leadership. It is a place for builders, operators, and contributors to share what they have actually seen, tried, broken, fixed, or still do not fully understand.",
    ],
  },
  sections: [
    {
      title: "Guiding idea",
      paragraphs: ["If it should work... but doesn\u2019t - it belongs here."],
    },
  ],
  people: {
    title: "Who\u2019s building it?",
  },
} as const;
