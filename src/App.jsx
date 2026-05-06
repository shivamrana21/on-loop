import { useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
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

const roleRoutes = {
  newJoiner: "/joiner",
  manager: "/manager",
  hrAdmin: "/hr",
};

const statusStyles = {
  done: "bg-emerald-500",
  inProgress: "bg-amber-400",
  upcoming: "bg-slate-300",
  "On Track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
  "Needs Attention": "bg-red-50 text-red-700 border-red-200",
};

const initialChecklistDoneCount = joinerMilestones.filter(
  (milestone) => milestone.status === "done",
).length;

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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== role) {
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return children;
}

function LoginPage({ currentUser, onLogin }) {
  const [email, setEmail] = useState("newjoiner@onloop.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to={currentUser.route} replace />;
  }

  function submitLogin(event) {
    event.preventDefault();
    const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

    if (!user || password.trim().length === 0) {
      setError("Use one of the demo emails with any password.");
      return;
    }

    setError("");
    onLogin(user);
    navigate(user.route);
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-5 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <aside className="hidden rounded-xl border border-gray-200 bg-white p-6 lg:block">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
              OL
            </div>
            <div>
              <p className="font-semibold text-navy">On Loop</p>
              <p className="text-sm text-slate-500">Demo onboarding workspace</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <LoginMetric label="Active cohort" value="May 2026" />
            <LoginMetric label="Average completion" value="61%" />
            <LoginMetric label="Open pulse flags" value="1" />
          </div>
          <div className="mt-6 border-t border-gray-200 pt-5">
            <p className="text-sm font-semibold text-slate-700">Available demo roles</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>New Joiner dashboard</p>
              <p>Manager dashboard</p>
              <p>HR Admin dashboard</p>
            </div>
          </div>
        </aside>

        <div className="card w-full p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-teal">On Loop</p>
            <h1 className="mt-2 text-2xl font-bold text-navy">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">
              Use a demo account below with any password.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitLogin}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                placeholder="newjoiner@onloop.com"
                type="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
                placeholder="Enter any password"
                type="password"
              />
            </label>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <button className="w-full rounded-lg bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c] focus:outline-none focus:ring-2 focus:ring-navy/20">
              Log in
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Demo accounts
            </p>
            <div className="mt-3 grid gap-2">
              {users.map((user) => (
                <button
                  className="rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-slate-600 transition hover:border-teal hover:bg-slate-50"
                  key={user.id}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword("demo");
                  }}
                  type="button"
                >
                  <span className="font-semibold text-navy">{user.name}</span>
                  <span className="block">{user.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function JoinerDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Journey");
  const [milestones, setMilestones] = useState(joinerMilestones);
  const completedCount = milestones.filter((milestone) => milestone.status === "done").length;
  const overallCompletedCount =
    joinerProgress.completedMilestones +
    Math.max(0, completedCount - initialChecklistDoneCount);

  function markComplete(id) {
    setMilestones((items) =>
      items.map((item) => (item.id === id ? { ...item, status: "done" } : item)),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-3 py-3 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col gap-4">
        <AppHeader title="On Loop" user={user} onLogout={onLogout} compact />

        <div className="flex-1">
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

        <nav className="sticky bottom-3 grid grid-cols-4 gap-1 rounded-xl border border-gray-200 bg-white p-1">
          {["Journey", "Company DNA", "Who to Ask", "Progress"].map((tab) => (
            <button
              className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition ${
                activeTab === tab ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}

function JourneyHome({ completedCount, milestones, onMarkComplete, user }) {
  return (
    <div className="space-y-4">
      <section className="card border-l-4 border-l-teal p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Today</p>
            <h1 className="mt-1 text-xl font-bold text-navy">Welcome back, {user.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{user.title} - {user.team}</p>
          </div>
          <span className="rounded-lg border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold text-teal">
            Day {user.dayCount}
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-navy">
            {buddy.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase text-slate-500">Buddy</p>
            <h2 className="truncate font-semibold text-navy">{buddy.name}</h2>
            <p className="truncate text-sm text-slate-500">{buddy.role}, {buddy.team}</p>
          </div>
          <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal hover:text-teal">
            Send message
          </button>
        </div>
      </section>

      <section className="card p-4">
        <SectionHeader title="30-60-90 journey" detail={`${completedCount} of ${joinerProgress.totalMilestones} done`} />
        <div className="mt-4 space-y-4">
          {journeyPhases.map((phase) => (
            <ProgressBar item={phase} key={phase.id} />
          ))}
        </div>
      </section>

      <section className="card p-4">
        <SectionHeader title="Milestone checklist" detail="Keep each step moving" />
        <div className="mt-4 space-y-3">
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

function CompanyDna() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(companyDnaCards[0].id);
  const filteredCards = companyDnaCards.filter((card) =>
    card.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="space-y-4">
      <SearchBox value={query} onChange={setQuery} placeholder="Search company DNA" />
      <div className="space-y-3">
        {filteredCards.map((card) => {
          const isExpanded = expandedId === card.id;

          return (
            <button
              className="card w-full p-4 text-left transition hover:border-teal"
              key={card.id}
              onClick={() => setExpandedId(isExpanded ? "" : card.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-navy">{card.title}</h2>
                <span className="text-xl leading-none text-teal">{isExpanded ? "-" : "+"}</span>
              </div>
              {isExpanded ? <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function WhoToAsk() {
  const domains = ["IT", "Finance", "Design", "People", "Legal"];
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("IT");
  const filteredContacts = contacts.filter((contact) => {
    const matchesDomain = contact.domain === activeDomain;
    const haystack = `${contact.name} ${contact.role} ${contact.owns} ${contact.slack}`.toLowerCase();
    return matchesDomain && haystack.includes(query.toLowerCase());
  });

  return (
    <section className="space-y-4">
      <SearchBox value={query} onChange={setQuery} placeholder="Search people and domains" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((domain) => (
          <button
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeDomain === domain
                ? "border-teal bg-teal text-white"
                : "border-gray-200 bg-white text-slate-600 hover:border-teal"
            }`}
            key={domain}
            onClick={() => setActiveDomain(domain)}
            type="button"
          >
            {domain}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <article className="card p-4" key={contact.id}>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-navy">
                {contact.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-navy">{contact.name}</h2>
                    <p className="text-sm text-slate-500">{contact.role}</p>
                  </div>
                  <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                    {contact.domain}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{contact.owns}</p>
                <p className="mt-1 text-sm font-semibold text-teal">{contact.slack}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressPage({ completedCount, totalMilestones }) {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(pulseSurveys[0]);

  return (
    <section className="space-y-4">
      <div className="card p-4">
        <SectionHeader title="Progress overview" detail={`${completedCount} of ${totalMilestones} done`} />
        <div className="mt-4 space-y-4">
          {journeyPhases.map((phase) => (
            <ProgressBar item={phase} key={phase.id} />
          ))}
        </div>
      </div>

      {pulseSurveys.map((survey) => (
        <div className="card p-4" key={survey.id}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal">{survey.label}</p>
              <h2 className="mt-1 font-semibold text-navy">Share how onboarding feels</h2>
            </div>
            <button
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12304c]"
              onClick={() => {
                setSelectedSurvey(survey);
                setIsSurveyOpen(true);
              }}
              type="button"
            >
              Open
            </button>
          </div>
        </div>
      ))}

      {isSurveyOpen ? (
        <PulseSurveyModal
          onClose={() => setIsSurveyOpen(false)}
          survey={selectedSurvey}
        />
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
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/45 px-4 py-4 sm:items-center">
      <div className="w-full max-w-[430px] rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal">Pulse survey</p>
            <h2 className="mt-1 text-xl font-bold text-navy">
              Day {survey.day} check-in
            </h2>
          </div>
          <button
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal hover:text-teal"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="mt-5 space-y-5">
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
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-sm font-bold text-teal">
                  {ratings[index]}
                </span>
              </div>
            </label>
          ))}
        </div>
        <button
          className="mt-6 w-full rounded-lg bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c]"
          onClick={onClose}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function ManagerDashboard({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("Team health");
  const [selectedJoinerId, setSelectedJoinerId] = useState(managerJoiners[0].id);
  const selectedJoiner = managerJoiners.find((joiner) => joiner.id === selectedJoinerId);

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
            <section className="card overflow-hidden">
              <div className="border-b border-gray-200 px-4 py-3">
                <SectionHeader title="New joiners" detail={`${managerJoiners.length} active`} />
              </div>
              <div className="hidden grid-cols-[1.2fr_1fr_150px_120px] gap-3 border-b border-gray-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase text-slate-500 md:grid">
                <span>Name</span>
                <span>Role</span>
                <span>Health</span>
                <span>Completion</span>
              </div>
              <div className="divide-y divide-gray-200">
                {managerJoiners.map((joiner) => (
                  <button
                    className={`grid w-full gap-2 px-4 py-3 text-left transition md:grid-cols-[1.2fr_1fr_150px_120px] md:items-center md:gap-3 ${
                      selectedJoinerId === joiner.id
                        ? "bg-teal/5"
                        : "bg-white hover:bg-slate-50"
                    }`}
                    key={joiner.id}
                    onClick={() => setSelectedJoinerId(joiner.id)}
                    type="button"
                  >
                    <div>
                      <h2 className="font-semibold text-navy">{joiner.name}</h2>
                      <p className="text-sm text-slate-500 md:hidden">{joiner.role}</p>
                    </div>
                    <p className="hidden text-sm text-slate-600 md:block">{joiner.role}</p>
                    <div>
                      <HealthBadge status={joiner.health} />
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressMeter percent={joiner.completion} className="flex-1" />
                      <span className="w-9 text-right text-sm font-semibold text-navy">
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
    <aside className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Selected joiner</p>
          <h2 className="mt-1 text-xl font-bold text-navy">{joiner.name}</h2>
        </div>
        <HealthBadge status={joiner.health} />
      </div>
      <div className="mt-5">
        <SectionHeader title="Journey completion" detail={`${joiner.completion}%`} />
        <ProgressMeter percent={joiner.completion} className="mt-3" />
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-700">Incomplete milestones</h3>
        <ul className="mt-3 space-y-2">
          {joiner.incompleteMilestones.map((milestone) => (
            <li className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" key={milestone}>
              {milestone}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Last buddy contact</p>
        <p className="mt-1 font-semibold text-navy">{joiner.lastBuddyContact}</p>
      </div>
      <button className="mt-5 w-full rounded-lg bg-navy px-4 py-2.5 font-semibold text-white transition hover:bg-[#12304c]">
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
        <article className="card p-4" key={milestone.id}>
          <h2 className="font-semibold text-navy">{milestone.title}</h2>
          <div className="mt-4 space-y-2">
            {milestone.customTasks.map((task) => (
              <div className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" key={task}>
                {task}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
              onChange={(event) => setDrafts((items) => ({ ...items, [milestone.id]: event.target.value }))}
              placeholder="Add custom task"
              value={drafts[milestone.id] || ""}
            />
            <button
              className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#246b84]"
              onClick={() => addTask(milestone.id)}
              type="button"
            >
              Add
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

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
  return (
    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Current cohort</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">{cohortInfo.name}</h1>
        </div>
        <div className="grid divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <MetricCard label="Total joiners" value={cohortInfo.totalJoiners} />
          <MetricCard label="Average completion" value={`${cohortInfo.averageCompletion}%`} />
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <SectionHeader title="Status count" detail="Active joiners" />
        </div>
        <div className="divide-y divide-gray-200">
          <StatusCount label="On track" value={cohortInfo.statusCounts.onTrack} color="bg-emerald-500" />
          <StatusCount label="At risk" value={cohortInfo.statusCounts.atRisk} color="bg-amber-400" />
          <StatusCount label="Needs attention" value={cohortInfo.statusCounts.needsAttention} color="bg-red-500" />
        </div>
      </div>
    </section>
  );
}

function JourneyTemplates() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {journeyTemplates.map((template) => (
        <article className="card p-5" key={template.id}>
          <p className="text-xs font-semibold uppercase text-slate-500">Role template</p>
          <h2 className="mt-2 text-xl font-bold text-navy">{template.role}</h2>
          <p className="mt-4 text-sm text-slate-500">{template.milestoneCount} milestones</p>
          <button className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal hover:text-teal">
            Edit
          </button>
        </article>
      ))}
    </section>
  );
}

function PulseResults() {
  const flaggedScores = useMemo(
    () => surveyResults.filter((result) => result.score < 3.5),
    [],
  );

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <SectionHeader title="Pulse survey results" detail="Average score out of 5" />
        </div>
        <div className="space-y-5 px-5 py-5">
          {surveyResults.map((result) => (
            <div key={result.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">{result.label}</span>
                <span className="text-sm font-bold text-navy">{result.score.toFixed(1)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${(result.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="card p-5">
        <p className="text-xs font-semibold uppercase text-slate-500">Auto-generated flags</p>
        {flaggedScores.length ? (
          <div className="mt-4 space-y-3">
            {flaggedScores.map((score) => (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" key={score.id}>
                {score.label} is below 3.5. Review manager notes and buddy touchpoints.
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No scores are below the flag threshold.</p>
        )}
      </aside>
    </section>
  );
}

function AppHeader({ compact = false, onLogout, title, user }) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-slate-500">{title}</p>
        <h1 className={`${compact ? "text-base" : "text-xl"} truncate font-bold text-navy`}>
          {user.name}
        </h1>
      </div>
      <button
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal hover:text-teal"
        onClick={onLogout}
        type="button"
      >
        Log out
      </button>
    </header>
  );
}

function DashboardTabs({ activeTab, onChange, tabs }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
      {tabs.map((tab) => (
        <button
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === tab ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-100"
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

function SectionHeader({ detail, title }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-semibold text-navy">{title}</h2>
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
    <div className={`h-3 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className="h-full rounded-full bg-teal" style={{ width: `${percent}%` }} />
    </div>
  );
}

function MilestoneItem({ milestone, onMarkComplete }) {
  const isDone = milestone.status === "done";
  const statusLabel = {
    done: "Done",
    inProgress: "In progress",
    upcoming: "Upcoming",
  }[milestone.status];

  return (
    <article className="rounded-xl border border-gray-200 p-3">
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${statusStyles[milestone.status]}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800">{milestone.title}</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {milestone.phase} - {statusLabel}
              </p>
            </div>
            <button
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                isDone
                  ? "bg-slate-100 text-slate-400"
                  : "bg-teal text-white hover:bg-[#246b84]"
              }`}
              disabled={isDone}
              onClick={() => onMarkComplete(milestone.id)}
              type="button"
            >
              {isDone ? "Complete" : "Mark complete"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SearchBox({ onChange, placeholder, value }) {
  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/15"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

function HealthBadge({ status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function LoginMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy">{value}</p>
    </div>
  );
}

function StatusCount({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <span className="text-lg font-bold text-navy">{value}</span>
    </div>
  );
}

export default App;
