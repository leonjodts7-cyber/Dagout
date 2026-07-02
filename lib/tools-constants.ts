export const BUDGET_EXTRAS = [
  { id: "catering", label: "Catering/lunch", pricePerPerson: 15 },
  { id: "transport", label: "Vervoer", pricePerPerson: 10 },
  { id: "photographer", label: "Fotograaf", pricePerPerson: 5 },
  { id: "guide", label: "Begeleider", pricePerPerson: 8 },
] as const;

export const NAV_TOOLS_LINKS = [
  { href: "/calculator", title: "Budgetcalculator" },
  { href: "/stemmen/nieuw", title: "Team stemmen" },
  { href: "/dagassistent", title: "AI Dagassistent" },
] as const;

export const TOOLS_LINKS = [
  {
    href: "/calculator",
    title: "Budgetcalculator",
    description: "Bereken de totale kost voor jullie groep.",
    icon: "calculator",
  },
  {
    href: "/stemmen/nieuw",
    title: "Team stemmen",
    description:
      "Maak een stemlink en laat je hele team meebeslissen over de teambuilding.",
    icon: "vote",
  },
  {
    href: "/dagassistent",
    title: "AI Dagassistent",
    description: "Plan een volledige dag met AI hulp.",
    icon: "assistant",
  },
] as const;

export const DAGASSISTENT_EXAMPLES = [
  "Plan een dag voor 20 mensen in Gent, budget €500",
  "Wat kunnen 15 mensen doen in Antwerpen op een vrijdag?",
  "Stel een volledige dag samen met lunch voor 30 personen",
] as const;
