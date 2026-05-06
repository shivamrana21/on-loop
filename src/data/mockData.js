export const users = [
  {
    id: "user-joiner",
    email: "newjoiner@onloop.com",
    name: "Maya Patel",
    role: "newJoiner",
    title: "Product Designer",
    team: "Growth Design",
    dayCount: 14,
    route: "/joiner",
  },
  {
    id: "user-manager",
    email: "manager@onloop.com",
    name: "Jordan Lee",
    role: "manager",
    title: "Design Manager",
    team: "Growth Design",
    route: "/manager",
  },
  {
    id: "user-hr",
    email: "hradmin@onloop.com",
    name: "Rina Okafor",
    role: "hrAdmin",
    title: "HR Programs Lead",
    team: "People Ops",
    route: "/hr",
  },
];

export const buddy = {
  name: "Ava Chen",
  team: "Growth Design",
  role: "Senior Product Designer",
  initials: "AC",
};

export const journeyPhases = [
  { id: "phase-1", label: "Phase 1", period: "30 days", percent: 72 },
  { id: "phase-2", label: "Phase 2", period: "60 days", percent: 38 },
  { id: "phase-3", label: "Phase 3", period: "90 days", percent: 12 },
];

export const joinerProgress = {
  completedMilestones: 12,
  totalMilestones: 18,
};

export const pulseSurveys = [
  { id: "day-30", label: "Day 30 pulse", day: 30 },
  { id: "day-60", label: "Day 60 pulse", day: 60 },
  { id: "day-90", label: "Day 90 pulse", day: 90 },
];

export const joinerMilestones = [
  {
    id: "m1",
    title: "Complete employee profile",
    status: "done",
    phase: "Phase 1",
  },
  {
    id: "m2",
    title: "Meet onboarding buddy",
    status: "done",
    phase: "Phase 1",
  },
  {
    id: "m3",
    title: "Review team rituals",
    status: "inProgress",
    phase: "Phase 1",
  },
  {
    id: "m4",
    title: "Shadow a customer interview",
    status: "inProgress",
    phase: "Phase 2",
  },
  {
    id: "m5",
    title: "Ship first workflow improvement",
    status: "upcoming",
    phase: "Phase 2",
  },
  {
    id: "m6",
    title: "Present 90-day impact review",
    status: "upcoming",
    phase: "Phase 3",
  },
];

export const companyDnaCards = [
  {
    id: "communication",
    title: "How we communicate",
    detail:
      "We default to written context before meetings, keep decisions in shared channels, and use async updates when urgency is low.",
  },
  {
    id: "decisions",
    title: "How decisions get made",
    detail:
      "Decision owners gather input, name the tradeoffs, and post a short rationale so teams can move without relitigating the same choice.",
  },
  {
    id: "rules",
    title: "Unwritten rules",
    detail:
      "Bring a point of view, ask early when something is fuzzy, and use demos to make progress visible before work feels final.",
  },
  {
    id: "cultures",
    title: "Team cultures",
    detail:
      "Each team has its own rituals, but most share weekly planning, open critique, and a habit of documenting what changed after launches.",
  },
];

export const contacts = [
  {
    id: "c1",
    initials: "NS",
    name: "Noah Singh",
    role: "IT Support Lead",
    domain: "IT",
    owns: "Devices, access, security keys",
    slack: "@noah",
  },
  {
    id: "c2",
    initials: "EV",
    name: "Elena Vega",
    role: "Finance Partner",
    domain: "Finance",
    owns: "Expenses, payroll, budgets",
    slack: "@elena",
  },
  {
    id: "c3",
    initials: "TB",
    name: "Theo Brooks",
    role: "Design Ops",
    domain: "Design",
    owns: "Figma, critique, research ops",
    slack: "@theo",
  },
  {
    id: "c4",
    initials: "AK",
    name: "Amara Khan",
    role: "People Partner",
    domain: "People",
    owns: "Benefits, policies, growth",
    slack: "@amara",
  },
  {
    id: "c5",
    initials: "MR",
    name: "Miles Reed",
    role: "Legal Counsel",
    domain: "Legal",
    owns: "Contracts, compliance, approvals",
    slack: "@miles",
  },
];

export const managerJoiners = [
  {
    id: "j1",
    name: "Maya Patel",
    role: "Product Designer",
    team: "Growth Design",
    health: "On Track",
    completion: 68,
    incompleteMilestones: [
      "Review team rituals",
      "Shadow a customer interview",
      "Ship first workflow improvement",
    ],
    lastBuddyContact: "May 3, 2026",
  },
  {
    id: "j2",
    name: "Sam Rivera",
    role: "UX Researcher",
    team: "Growth Design",
    health: "At Risk",
    completion: 44,
    incompleteMilestones: [
      "Schedule buddy retro",
      "Complete research repository tour",
      "Draft first insight memo",
    ],
    lastBuddyContact: "April 29, 2026",
  },
  {
    id: "j3",
    name: "Priya Shah",
    role: "Content Designer",
    team: "Growth Design",
    health: "Needs Attention",
    completion: 27,
    incompleteMilestones: [
      "Finish equipment setup",
      "Meet onboarding buddy",
      "Read voice and tone guide",
    ],
    lastBuddyContact: "April 21, 2026",
  },
];

export const teamJourneyMilestones = [
  {
    id: "tm1",
    title: "Meet cross-functional squad",
    customTasks: ["Attend weekly growth sync"],
  },
  {
    id: "tm2",
    title: "Learn design review norms",
    customTasks: ["Observe two critique sessions"],
  },
  {
    id: "tm3",
    title: "Map product area",
    customTasks: ["Create onboarding notes in team space"],
  },
];

export const cohortInfo = {
  name: "May 2026 Product Cohort",
  totalJoiners: 24,
  averageCompletion: 61,
  statusCounts: {
    onTrack: 15,
    atRisk: 6,
    needsAttention: 3,
  },
};

export const journeyTemplates = [
  { id: "designer", role: "Designer", milestoneCount: 18 },
  { id: "engineer", role: "Engineer", milestoneCount: 22 },
  { id: "pm", role: "PM", milestoneCount: 20 },
];

export const surveyResults = [
  { id: "clarity", label: "Clarity score", score: 4.1 },
  { id: "belonging", label: "Belonging score", score: 3.3 },
  { id: "confidence", label: "Productivity confidence", score: 3.8 },
];
