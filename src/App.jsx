import { useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  ClipboardList,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Map,
  MessageCircle,
  PenLine,
  Plus,
  Search,
  Send,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import {
  buddy,
  cohortInfo,
  companyDnaCards,
  contacts,
  joinerMilestones,
  joinerProgress,
  journeyPhases,
  journeyTemplates,
  managerJoiners,
  pulseSurveys,
  surveyResults,
  teamJourneyMilestones,
  users,
} from "./data/mockData";

/* ─── constants ─────────────────────────────────────────────────────────── */

const roleRoutes = {
  newJoiner: "/joiner",
  manager: "/manager",
  hrAdmin: "/hr",
};

const statusDot = {
  done: "bg-emerald-500",
  inProgress: "bg-amber-400",
  upcoming: "bg-slate-300",
};

const healthStyles = {
  "On Track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
  "Needs Attention": "bg-red-50 text-red-700 border-red-200",
};

const healthIcon = {
  "On Track": <CheckCircle2 className="h-3.5 w-3.5" />,
  "At Risk": <Clock className="h-3.5 w-3.5" />,
  "Needs Attention": <AlertTriangle className="h-3.5 w-3.5" />,
};

const domainIcons = {
  IT: Shield,
  Finance: BarChart2,
  Design: Layers,
  People: Users,
  Legal: FileText,
};

const initialChecklistDoneCount = joinerMilestones.filter(
  (m) => m.status === "done",
).length;

/* ─── helpers ────────────────────────────────────────────────────────────── */

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── App ────────────────────────────────────────────────────────────────── */

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = window.localStorage.getItem("onloop-user");
    return stored ? JSON.parse(stored) : null;
  });

  function handleLogin(user) {
    setCurrentUser(user);
    window.localStorage.setItem("onloop-user", JSON.stringify(user));
  }

  function handleLogout() {
    setCurrentUser(null);
    window.localStorage.removeItem("onloop-user");
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={currentUser ? currentUser.route : "/login"} replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} currentUser={currentUser} />} />
      <Route
        path="/joiner"
        element={
          <ProtectedRoute user={currentUser} role="newJoiner">
            <JoinerDashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute user={currentUser} role="manager">
            <ManagerDashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr"
        element={
          <ProtectedRoute user={currentUser} role="hrAdmin">
            <HrDashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoute({ children, role, user }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== role) return <Navigate to={roleRoutes[user.role]} replace />;
  return children;
}

/* ─── Login ──────────────────────────────────────────────────────────────── */

const roleLabels = {
  newJoiner: "New Joiner",
  manager: "Manager",
  hrAdmin: "HR Admin",
};

function LoginPage({ currentUser, onLogin }) {
  const [email, setEmail] = useState("newjoiner@onloop.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (currentUser) return <Navigate to={currentUser.route} replace />;

  function submitLogin(event) {
    event.preventDefault();
    const user = users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user || password.trim().length === 0) {
      setError("Use one of the demo emails with any password.");
      return;
    }
    setError("");
    onLogin(user);
    navigate(user.route);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#f6f7f9] to-[#eaf4f8] px-5 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">

        {/* ── left panel ── */}
        <aside className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft lg:block">
          {/* hero strip */}
          <div className="bg-gradient-to-r from-navy to-teal px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white">
                OL
              </div>
              <div>
                <p className="font-bold text-white">On Loop</p>
                <p className="text-sm text-white/70">Employee onboarding platform</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/80">
              Structured journeys, smart check-ins, and real-time visibility for
              new joiners, managers, and HR teams.
            </p>
          </div>

          {/* metrics */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            <LoginMetric label="Active cohort" value="May 2026" />
            <LoginMetric label="Avg. completion" value="61%" />
            <LoginMetric label="Pulse flags" value="1" />
          </div>

          {/* demo roles */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Three demo roles available
            </p>
            <div className="mt-3 space-y-2">
              {[
                { icon: Map, label: "New Joiner", sub: "Personal 30-60-90 journey" },
                { icon: Users, label: "Manager", sub: "Team health & milestone tracking" },
                { icon: LayoutDashboard, label: "HR Admin", sub: "Cohort overview & pulse results" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{label}</p>
                    <p className="text-xs text-slate-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── right panel (form) ── */}
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-7">
            <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              Demo workspace
            </span>
            <h1 className="mt-3 text-2xl font-bold text-navy">Welcome back</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in with a demo account to explore the platform.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitLogin}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                placeholder="newjoiner@onloop.com"
                type="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                placeholder="Any password"
                type="password"
              />
            </label>

            {error ? (
              <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </p>
            ) : null}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c] focus:outline-none focus:ring-2 focus:ring-navy/30"
              type="submit"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Quick access — demo accounts
            </p>
            <div className="mt-3 grid gap-2">
              {users.map((user) => (
                <button
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-left transition hover:border-teal/50 hover:bg-slate-50"
                  key={user.id}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword("demo");
                  }}
                  type="button"
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {roleLabels[user.role]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Joiner Dashboard ───────────────────────────────────────────────────── */

const joinerTabs = [
  { id: "Journey", label: "Journey", icon: Map },
  { id: "Company DNA", label: "Culture", icon: BookOpen },
  { id: "Who to Ask", label: "People", icon: Users },
  { id: "Progress", label: "Progress", icon: BarChart2 },
];

function JoinerDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Journey");
  const [milestones, setMilestones] = useState(joinerMilestones);
  const completedCount = milestones.filter((m) => m.status === "done").length;
  const overallCompletedCount =
    joinerProgress.completedMilestones +
    Math.max(0, completedCount - initialChecklistDoneCount);

  function markComplete(id) {
    setMilestones((items) =>
      items.map((item) => (item.id === id ? { ...item, status: "done" } : item)),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-3 pb-24 pt-3 text-slate-900">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4">
        <AppHeader title="On Loop" user={user} onLogout={onLogout} compact />

        {activeTab === "Journey" ? (
          <JourneyHome
            completedCount={overallCompletedCount}
            milestones={milestones}
            onMarkComplete={markComplete}
            user={user}
          />
        ) : null}
        {activeTab === "Company DNA" ? <CompanyDna /> : null}
        {activeTab === "Who to Ask" ? <WhoToAsk /> : null}
        {activeTab === "Progress" ? (
          <ProgressPage
            completedCount={overallCompletedCount}
            totalMilestones={joinerProgress.totalMilestones}
          />
        ) : null}
      </div>

      {/* bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white px-2 pb-safe">
        <div className="mx-auto flex max-w-[430px] gap-1 py-2">
          {joinerTabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold transition ${
                  active ? "bg-navy text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }`}
                key={id}
                onClick={() => setActiveTab(id)}
                type="button"
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function JourneyHome({ completedCount, milestones, onMarkComplete, user }) {
  return (
    <div className="space-y-4">
      {/* welcome hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-[#1e5a7e]">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                Day {user.dayCount}
              </p>
              <h1 className="mt-1 text-xl font-bold text-white">
                Welcome back,<br />{user.name.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {user.title} · {user.team}
              </p>
            </div>
            <Avatar name={user.name} size="lg" light />
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold text-white/70">Overall progress</p>
              <p className="text-xs font-bold text-white">
                {completedCount}/{joinerProgress.totalMilestones}
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-500"
                style={{ width: `${(completedCount / joinerProgress.totalMilestones) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* buddy card */}
      <section className="card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Your buddy
        </p>
        <div className="flex items-center gap-3">
          <Avatar name={buddy.name} size="md" />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-navy">{buddy.name}</h2>
            <p className="truncate text-sm text-slate-500">
              {buddy.role} · {buddy.team}
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal hover:text-teal">
            <MessageCircle className="h-4 w-4" />
            Chat
          </button>
        </div>
      </section>

      {/* journey phases */}
      <section className="card p-4">
        <SectionHeader
          title="30-60-90 journey"
          detail={`${completedCount} of ${joinerProgress.totalMilestones} done`}
        />
        <div className="mt-4 space-y-4">
          {journeyPhases.map((phase) => (
            <ProgressBar item={phase} key={phase.id} />
          ))}
        </div>
      </section>

      {/* milestone checklist */}
      <section className="card p-4">
        <SectionHeader title="Milestone checklist" detail="Keep each step moving" />
        <div className="mt-4 space-y-2.5">
          {milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              onMarkComplete={onMarkComplete}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Company DNA ────────────────────────────────────────────────────────── */

const dnaIcons = {
  communication: MessageCircle,
  decisions: Zap,
  rules: ClipboardList,
  cultures: Users,
};

function CompanyDna() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(companyDnaCards[0].id);
  const filteredCards = companyDnaCards.filter((card) =>
    card.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-navy">Company DNA</h2>
        <p className="mt-0.5 text-sm text-slate-500">How we work, decide, and grow together.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search company DNA" />
      <div className="space-y-2.5">
        {filteredCards.map((card) => {
          const isExpanded = expandedId === card.id;
          const Icon = dnaIcons[card.id] ?? BookOpen;

          return (
            <button
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isExpanded
                  ? "border-teal/30 bg-teal/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-teal/30 hover:bg-slate-50"
              }`}
              key={card.id}
              onClick={() => setExpandedId(isExpanded ? "" : card.id)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isExpanded ? "bg-teal/15 text-teal" : "bg-slate-100 text-slate-500"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="flex-1 font-semibold text-navy">{card.title}</h3>
                {isExpanded
                  ? <ChevronUp className="h-4 w-4 shrink-0 text-teal" />
                  : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
              </div>
              {isExpanded ? (
                <p className="mt-3 pl-12 text-sm leading-relaxed text-slate-600">
                  {card.detail}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Who to Ask ─────────────────────────────────────────────────────────── */

function WhoToAsk() {
  const domains = ["IT", "Finance", "Design", "People", "Legal"];
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("IT");
  const filteredContacts = contacts.filter((contact) => {
    const matchesDomain = contact.domain === activeDomain;
    const haystack =
      `${contact.name} ${contact.role} ${contact.owns} ${contact.slack}`.toLowerCase();
    return matchesDomain && haystack.includes(query.toLowerCase());
  });

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-navy">Who to Ask</h2>
        <p className="mt-0.5 text-sm text-slate-500">Find the right person for any question.</p>
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search people and domains" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((domain) => {
          const Icon = domainIcons[domain];
          const active = activeDomain === domain;
          return (
            <button
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-teal bg-teal text-white"
                  : "border-gray-200 bg-white text-slate-600 hover:border-teal/50"
              }`}
              key={domain}
              onClick={() => setActiveDomain(domain)}
              type="button"
            >
              <Icon className="h-3.5 w-3.5" />
              {domain}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <article className="card p-4" key={contact.id}>
            <div className="flex gap-3">
              <Avatar name={contact.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-navy">{contact.name}</h3>
                    <p className="text-sm text-slate-500">{contact.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {contact.domain}
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-slate-600">{contact.owns}</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-teal">
                  <Send className="h-3.5 w-3.5" />
                  {contact.slack}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Progress page ──────────────────────────────────────────────────────── */

function ProgressPage({ completedCount, totalMilestones }) {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(pulseSurveys[0]);
  const pct = Math.round((completedCount / totalMilestones) * 100);

  return (
    <section className="space-y-4">
      {/* ring summary */}
      <div className="card p-5">
        <div className="flex items-center gap-5">
          {/* circular ring (SVG) */}
          <div className="relative h-20 w-20 shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#2E7D9B"
                strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-navy">
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Overall progress
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">
              {completedCount}
              <span className="text-base font-normal text-slate-400">/{totalMilestones}</span>
            </p>
            <p className="text-sm text-slate-500">milestones complete</p>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {journeyPhases.map((phase) => (
            <ProgressBar item={phase} key={phase.id} />
          ))}
        </div>
      </div>

      {/* pulse surveys */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Pulse check-ins
        </p>
        <div className="space-y-2.5">
          {pulseSurveys.map((survey) => (
            <div
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              key={survey.id}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Day {survey.day} check-in</p>
                  <p className="text-xs text-slate-500">{survey.label}</p>
                </div>
              </div>
              <button
                className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12304c]"
                onClick={() => {
                  setSelectedSurvey(survey);
                  setIsSurveyOpen(true);
                }}
                type="button"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      {isSurveyOpen ? (
        <PulseSurveyModal onClose={() => setIsSurveyOpen(false)} survey={selectedSurvey} />
      ) : null}
    </section>
  );
}

function PulseSurveyModal({ onClose, survey }) {
  const questions = [
    "I know what success looks like for my role.",
    "I feel connected to my team.",
    "I can make meaningful progress this week.",
  ];
  const [ratings, setRatings] = useState([3, 3, 3]);

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/50 px-4 py-4 sm:items-center">
      <div className="w-full max-w-[430px] rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold text-teal">
              Pulse survey
            </span>
            <h2 className="mt-2 text-xl font-bold text-navy">
              Day {survey.day} check-in
            </h2>
          </div>
          <button
            className="rounded-xl border border-gray-200 p-2 text-slate-400 transition hover:border-gray-300 hover:text-slate-600"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {questions.map((question, index) => (
            <label className="block" key={question}>
              <span className="text-sm font-medium text-slate-700">{question}</span>
              <div className="mt-3 flex items-center gap-3">
                <input
                  className="w-full accent-teal"
                  max="5"
                  min="1"
                  onChange={(event) => {
                    const nextRatings = [...ratings];
                    nextRatings[index] = Number(event.target.value);
                    setRatings(nextRatings);
                  }}
                  type="range"
                  value={ratings[index]}
                />
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-sm font-bold text-teal">
                  {ratings[index]}
                </span>
              </div>
            </label>
          ))}
        </div>

        <button
          className="mt-7 w-full rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c]"
          onClick={onClose}
          type="button"
        >
          Submit responses
        </button>
      </div>
    </div>
  );
}

/* ─── Manager Dashboard ──────────────────────────────────────────────────── */

function ManagerDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Team health");
  const [selectedJoinerId, setSelectedJoinerId] = useState(managerJoiners[0].id);
  const selectedJoiner = managerJoiners.find((j) => j.id === selectedJoinerId);

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-5">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <AppHeader title="Manager dashboard" user={user} onLogout={onLogout} />
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={["Team health", "Edit team journey"]}
        />

        {activeTab === "Team health" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* joiner list */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-5 py-4">
                <SectionHeader
                  title="New joiners"
                  detail={`${managerJoiners.length} active`}
                  icon={<Users className="h-4 w-4 text-teal" />}
                />
              </div>
              <div className="hidden grid-cols-[1.4fr_1fr_160px_130px] gap-3 border-b border-gray-100 bg-slate-50/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid">
                <span>Name</span>
                <span>Role</span>
                <span>Health</span>
                <span>Completion</span>
              </div>
              <div className="divide-y divide-gray-100">
                {managerJoiners.map((joiner) => (
                  <button
                    className={`grid w-full gap-2 px-5 py-3.5 text-left transition md:grid-cols-[1.4fr_1fr_160px_130px] md:items-center md:gap-3 ${
                      selectedJoinerId === joiner.id
                        ? "bg-teal/5"
                        : "bg-white hover:bg-slate-50/80"
                    }`}
                    key={joiner.id}
                    onClick={() => setSelectedJoinerId(joiner.id)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={joiner.name} size="sm" />
                      <div>
                        <p className="font-semibold text-navy">{joiner.name}</p>
                        <p className="text-xs text-slate-500 md:hidden">{joiner.role}</p>
                      </div>
                    </div>
                    <p className="hidden text-sm text-slate-600 md:block">{joiner.role}</p>
                    <HealthBadge status={joiner.health} />
                    <div className="flex items-center gap-3">
                      <ProgressMeter percent={joiner.completion} className="flex-1" />
                      <span className="w-9 text-right text-sm font-bold text-navy">
                        {joiner.completion}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <JoinerDetailPanel joiner={selectedJoiner} />
          </div>
        ) : (
          <EditTeamJourney />
        )}
      </div>
    </main>
  );
}

function JoinerDetailPanel({ joiner }) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={joiner.name} size="md" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Selected joiner
            </p>
            <h2 className="font-bold text-navy">{joiner.name}</h2>
          </div>
        </div>
        <HealthBadge status={joiner.health} />
      </div>

      {/* completion */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Journey completion</p>
          <p className="text-sm font-bold text-navy">{joiner.completion}%</p>
        </div>
        <ProgressMeter percent={joiner.completion} />
      </div>

      {/* incomplete milestones */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-700">Incomplete milestones</p>
        <ul className="mt-3 space-y-2">
          {joiner.incompleteMilestones.map((ms) => (
            <li
              className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-600"
              key={ms}
            >
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
              {ms}
            </li>
          ))}
        </ul>
      </div>

      {/* buddy contact */}
      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
        <p className="text-xs font-semibold text-amber-600">Last buddy contact</p>
        <p className="mt-0.5 font-semibold text-amber-800">{joiner.lastBuddyContact}</p>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c]">
        <Send className="h-4 w-4" />
        Send nudge
      </button>
    </aside>
  );
}

function EditTeamJourney() {
  const [milestones, setMilestones] = useState(teamJourneyMilestones);
  const [drafts, setDrafts] = useState({});

  function addTask(milestoneId) {
    const task = drafts[milestoneId]?.trim();
    if (!task) return;
    setMilestones((items) =>
      items.map((item) =>
        item.id === milestoneId
          ? { ...item, customTasks: [...item.customTasks, task] }
          : item,
      ),
    );
    setDrafts((items) => ({ ...items, [milestoneId]: "" }));
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {milestones.map((milestone) => (
        <article className="rounded-2xl border border-gray-200 bg-white p-5" key={milestone.id}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <ClipboardList className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-navy">{milestone.title}</h2>
          </div>
          <div className="mt-4 space-y-2">
            {milestone.customTasks.map((task) => (
              <div
                className="flex items-start gap-2 rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
                key={task}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {task}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
              onChange={(e) =>
                setDrafts((items) => ({ ...items, [milestone.id]: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addTask(milestone.id)}
              placeholder="Add custom task…"
              value={drafts[milestone.id] || ""}
            />
            <button
              className="flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#246b84]"
              onClick={() => addTask(milestone.id)}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

/* ─── HR Dashboard ───────────────────────────────────────────────────────── */

function HrDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-5">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <AppHeader title="HR Admin dashboard" user={user} onLogout={onLogout} />
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={["Overview", "Templates", "Pulse results"]}
        />
        {activeTab === "Overview" ? <CohortOverview /> : null}
        {activeTab === "Templates" ? <JourneyTemplates /> : null}
        {activeTab === "Pulse results" ? <PulseResults /> : null}
      </div>
    </main>
  );
}

function CohortOverview() {
  const total = cohortInfo.statusCounts.onTrack + cohortInfo.statusCounts.atRisk + cohortInfo.statusCounts.needsAttention;
  const segments = [
    { label: "On track", value: cohortInfo.statusCounts.onTrack, color: "bg-emerald-500", pct: (cohortInfo.statusCounts.onTrack / total) * 100 },
    { label: "At risk", value: cohortInfo.statusCounts.atRisk, color: "bg-amber-400", pct: (cohortInfo.statusCounts.atRisk / total) * 100 },
    { label: "Needs attention", value: cohortInfo.statusCounts.needsAttention, color: "bg-red-500", pct: (cohortInfo.statusCounts.needsAttention / total) * 100 },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      {/* cohort card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="bg-gradient-to-r from-navy to-[#1e5a7e] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Current cohort
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">{cohortInfo.name}</h1>
        </div>
        <div className="grid divide-x divide-gray-100 sm:grid-cols-2">
          <MetricCard label="Total joiners" value={cohortInfo.totalJoiners} icon={<Users className="h-5 w-5" />} />
          <MetricCard label="Avg. completion" value={`${cohortInfo.averageCompletion}%`} icon={<BarChart2 className="h-5 w-5" />} />
        </div>
        {/* stacked bar */}
        <div className="px-5 pb-5">
          <p className="mb-2 text-xs font-semibold text-slate-500">Health distribution</p>
          <div className="flex h-3 overflow-hidden rounded-full">
            {segments.map((s) => (
              <div
                key={s.label}
                className={`${s.color} first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${s.pct}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-4">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* status count */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <SectionHeader title="Status breakdown" detail="Active joiners" />
        </div>
        <div className="divide-y divide-gray-100">
          {segments.map((s) => (
            <StatusCount key={s.label} label={s.label} value={s.value} color={s.color} total={total} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyTemplates() {
  const templateIcons = {
    designer: Layers,
    engineer: Zap,
    pm: Map,
  };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {journeyTemplates.map((template) => {
        const Icon = templateIcons[template.id] ?? FileText;
        return (
          <article className="rounded-2xl border border-gray-200 bg-white p-5" key={template.id}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy/10 text-navy">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role template
            </p>
            <h2 className="mt-1 text-xl font-bold text-navy">{template.role}</h2>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <ClipboardList className="h-4 w-4" />
              {template.milestoneCount} milestones
            </div>
            <button className="mt-5 flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal hover:text-teal">
              <PenLine className="h-4 w-4" />
              Edit template
            </button>
          </article>
        );
      })}
    </section>
  );
}

function PulseResults() {
  const flaggedScores = useMemo(
    () => surveyResults.filter((r) => r.score < 3.5),
    [],
  );

  const scoreColor = (score) => {
    if (score >= 4) return "bg-emerald-500";
    if (score >= 3.5) return "bg-teal";
    return "bg-amber-400";
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <SectionHeader
            title="Pulse survey results"
            detail="Average score out of 5"
            icon={<BarChart2 className="h-4 w-4 text-teal" />}
          />
        </div>
        <div className="space-y-6 px-5 py-6">
          {surveyResults.map((result) => (
            <div key={result.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">{result.label}</span>
                <span className="text-sm font-bold text-navy">{result.score.toFixed(1)}/5</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${scoreColor(result.score)} transition-all duration-500`}
                  style={{ width: `${(result.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Auto-generated flags</p>
        </div>
        {flaggedScores.length ? (
          <div className="mt-4 space-y-3">
            {flaggedScores.map((score) => (
              <div
                className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-relaxed text-amber-800"
                key={score.id}
              >
                <p className="font-semibold">{score.label}</p>
                <p className="mt-0.5 text-amber-700">
                  Score {score.score.toFixed(1)} is below 3.5 — review manager notes and buddy touchpoints.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mb-1.5 h-5 w-5" />
            No scores below the flag threshold.
          </div>
        )}
      </aside>
    </section>
  );
}

/* ─── Shared components ──────────────────────────────────────────────────── */

function Avatar({ light = false, name, size = "md" }) {
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-sm",
  }[size];

  const colors = light
    ? "bg-white/25 text-white"
    : "bg-gradient-to-br from-navy/10 to-teal/20 text-navy";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${sizeClass} ${colors}`}
    >
      {initials(name)}
    </div>
  );
}

function AppHeader({ compact = false, onLogout, title, user }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-teal text-xs font-bold text-white">
          OL
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">{title}</p>
          <p className={`${compact ? "text-sm" : "text-base"} truncate font-bold text-navy`}>
            {user.name}
          </p>
        </div>
      </div>
      <button
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={onLogout}
        type="button"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </header>
  );
}

function DashboardTabs({ activeTab, onChange, tabs }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          className={`shrink-0 rounded-xl px-5 py-2 text-sm font-semibold transition ${
            activeTab === tab
              ? "bg-navy text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
          key={tab}
          onClick={() => onChange(tab)}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ detail, icon, title }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon ?? null}
        <h2 className="font-semibold text-navy">{title}</h2>
      </div>
      {detail ? <p className="text-sm text-slate-500">{detail}</p> : null}
    </div>
  );
}

function ProgressBar({ item }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">{item.label}</p>
          <p className="text-xs text-slate-500">{item.period}</p>
        </div>
        <span className="text-sm font-bold text-navy">{item.percent}%</span>
      </div>
      <ProgressMeter percent={item.percent} />
    </div>
  );
}

function ProgressMeter({ className = "", percent }) {
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className="h-full rounded-full bg-teal transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function MilestoneItem({ milestone, onMarkComplete }) {
  const isDone = milestone.status === "done";
  const isInProgress = milestone.status === "inProgress";

  const statusConfig = {
    done: { label: "Done", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
    inProgress: { label: "In progress", dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700" },
    upcoming: { label: "Upcoming", dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500" },
  }[milestone.status];

  return (
    <article
      className={`rounded-2xl border p-3.5 transition ${
        isDone ? "border-emerald-100 bg-emerald-50/50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {isDone ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        ) : isInProgress ? (
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-semibold ${isDone ? "text-emerald-800" : "text-slate-800"}`}>
                {milestone.title}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
                <span className="text-xs text-slate-400">{milestone.phase}</span>
              </div>
            </div>
            {!isDone ? (
              <button
                className="shrink-0 rounded-xl bg-teal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#246b84]"
                onClick={() => onMarkComplete(milestone.id)}
                type="button"
              >
                Mark done
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function SearchBox({ onChange, placeholder, value }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm transition focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="sr-only">{placeholder}</span>
      <input
        className="w-full text-sm outline-none placeholder:text-slate-400"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

function HealthBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${healthStyles[status]}`}
    >
      {healthIcon[status]}
      {status}
    </span>
  );
}

function LoginMetric({ label, value }) {
  return (
    <div className="flex flex-col items-center py-4">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="mt-0.5 text-xs text-white/60">{label}</span>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-navy">{value}</p>
      </div>
    </div>
  );
}

function StatusCount({ color, label, total, value }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
        <span className="text-sm font-semibold text-slate-700 capitalize">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden w-24 sm:block">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="w-6 text-right text-lg font-bold text-navy">{value}</span>
      </div>
    </div>
  );
}

export default App;
