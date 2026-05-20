import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════════════════

const initialTasks = [
  { id: 1, title: "Generator fuel & service check", lodge: "Dulini River Lodge", priority: "urgent", status: "open", category: "mechanical", assignee: "David", due: "2026-05-19", notes: "Monthly service overdue — David to inspect and log hours" },
  { id: 2, title: "Pool pump filter replacement", lodge: "Leadwood Lodge", priority: "high", status: "in-progress", category: "plumbing", assignee: "Mandla", due: "2026-05-20", notes: "Filter clogged — visibility poor in lap pool" },
  { id: 3, title: "Guest suite main DB board fault", lodge: "Dulini River Lodge", priority: "urgent", status: "open", category: "electrical", assignee: "David", due: "2026-05-19", notes: "Suite 4 — guest checking in tonight. David to attend immediately." },
  { id: 4, title: "Boma fire pit stone reset", lodge: "Dulini River Lodge", priority: "medium", status: "open", category: "structural", assignee: "Mica", due: "2026-05-22", notes: "Loose stones on south side — safety hazard for evening dinners" },
  { id: 5, title: "Solar panel array cleaning", lodge: "Moya Lodge", priority: "low", status: "completed", category: "electrical", assignee: "Mica", due: "2026-05-18", notes: "All 12 panels cleaned and output tested — 100% efficiency restored" },
  { id: 6, title: "Water tank pressure valve", lodge: "Leadwood Lodge", priority: "high", status: "in-progress", category: "plumbing", assignee: "Mandla", due: "2026-05-21", notes: "Replacement valve sourced from Hazyview — fitting in progress" },
  { id: 7, title: "Bush vehicle brake inspection", lodge: "Dulini River Lodge", priority: "high", status: "open", category: "mechanical", assignee: "Mica", due: "2026-05-20", notes: "VH-04 and VH-07 overdue — Moshapo to supervise signoff" },
  { id: 8, title: "Deck board replacement — Sunset Deck", lodge: "Moya Lodge", priority: "medium", status: "completed", category: "structural", assignee: "Mica", due: "2026-05-17", notes: "3 weathered boards replaced and sealed" },
  { id: 9, title: "Geyser thermostat — Suite 2", lodge: "Leadwood Lodge", priority: "high", status: "open", category: "plumbing", assignee: "Mandla", due: "2026-05-20", notes: "Guest complaint — no hot water this morning" },
  { id: 10, title: "Exterior lighting fault — main walkway", lodge: "Dulini River Lodge", priority: "medium", status: "open", category: "electrical", assignee: "David", due: "2026-05-21", notes: "3 path lights out between reception and suites" },
];

const techniciansData = [
  { name: "Moshapo", role: "Supervisor", lodge: "Dulini River Lodge", status: "On Duty", jobs: 18, completion: "97%", phone: "+27 72 111 2222", specialty: "Operations Supervisor", bio: "Oversees all maintenance operations at River Lodge. First point of escalation for all property issues.", initials: "MO", color: "from-orange-500 to-amber-600" },
  { name: "Mandla", role: "Plumber", lodge: "Leadwood Lodge", status: "On Duty", jobs: 12, completion: "93%", phone: "+27 73 333 4444", specialty: "Plumbing & Water Systems", bio: "Specialist in lodge plumbing, borehole systems, geyser maintenance and pool circulation.", initials: "MA", color: "from-blue-500 to-cyan-600" },
  { name: "Mica", role: "General All-Rounder", lodge: "Moya Lodge", status: "On Duty", jobs: 15, completion: "100%", phone: "+27 71 555 6666", specialty: "Multi-Trade · General Works", bio: "Skilled all-rounder — handles structural, mechanical, grounds, and general lodge maintenance across all properties.", initials: "MI", color: "from-green-500 to-emerald-600" },
  { name: "David", role: "Anchor Electrician", lodge: "All Properties", status: "On Duty", jobs: 21, completion: "99%", phone: "+27 74 777 8888", specialty: "Electrical · DB Boards · Solar", bio: "Senior electrician and anchor technician. Handles all high-priority electrical faults, DB boards, generator systems and solar across the estate.", initials: "DA", color: "from-yellow-400 to-orange-500" },
];

const contractorsData = [
  { name: "Hazyview Electrics", contact: "André du Plessis", phone: "+27 13 737 8800", speciality: "HV Electrical", rate: "R850/hr", status: "preferred" },
  { name: "Lowveld Plumbing Co.", contact: "Johan Pretorius", phone: "+27 13 590 1234", speciality: "Industrial Plumbing", rate: "R720/hr", status: "preferred" },
  { name: "Bush Mechanics Sabie", contact: "Themba Nkosi", phone: "+27 82 345 6789", speciality: "Diesel Engines", rate: "R950/hr", status: "active" },
  { name: "KNP Solar Solutions", contact: "Sarah Joubert", phone: "+27 13 735 5500", speciality: "Solar & Battery", rate: "R1100/hr", status: "active" },
];

const inventoryData = [
  { name: "Pool Pump Motor (3HP)", qty: 2, unit: "Units", status: "In Stock", category: "Mechanical" },
  { name: "HVAC Filter Set", qty: 12, unit: "Sets", status: "In Stock", category: "HVAC" },
  { name: "Generator Oil (20L)", qty: 1, unit: "Drums", status: "Low Stock", category: "Generator" },
  { name: "Electrical Cable (16mm)", qty: 45, unit: "Meters", status: "In Stock", category: "Electrical" },
  { name: "Timber Planks (90x22mm)", qty: 0, unit: "Planks", status: "Out of Stock", category: "Structural" },
  { name: "LED Floodlight 50W", qty: 8, unit: "Units", status: "In Stock", category: "Lighting" },
  { name: "Plumbing Fittings Kit", qty: 3, unit: "Kits", status: "Low Stock", category: "Plumbing" },
];

const NAV_ITEMS = [
  { id: "dashboard", icon: "◆", label: "Dashboard" },
  { id: "tasks", icon: "⊟", label: "Tasks" },
  { id: "technicians", icon: "◉", label: "Technicians" },
  { id: "contractors", icon: "◎", label: "Contractors" },
  { id: "inventory", icon: "▦", label: "Inventory" },
  { id: "reports", icon: "△", label: "Reports" },
  { id: "settings", icon: "◌", label: "Settings" },
];

const PRIORITY_CONFIG = {
  urgent: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", dot: "bg-red-400", label: "URGENT" },
  high:   { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", dot: "bg-amber-400", label: "HIGH" },
  medium: { color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30", dot: "bg-blue-400", label: "MEDIUM" },
  low:    { color: "text-zinc-400", bg: "bg-zinc-700/40 border-zinc-700", dot: "bg-zinc-500", label: "LOW" },
};

const STATUS_CONFIG = {
  open:        { color: "text-red-300", bg: "bg-red-900/30", label: "Open" },
  "in-progress": { color: "text-amber-300", bg: "bg-amber-900/30", label: "In Progress" },
  completed:   { color: "text-green-300", bg: "bg-green-900/30", label: "Completed" },
};

const CATEGORY_ICONS = {
  electrical: "⚡", plumbing: "💧", mechanical: "⚙️", structural: "🏗️",
};

const INVENTORY_STATUS = {
  "In Stock": "bg-green-500/20 text-green-400",
  "Low Stock": "bg-yellow-500/20 text-yellow-400",
  "Out of Stock": "bg-red-500/20 text-red-400",
};

// ═══════════════════════════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════════════════════════

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease]">
      <div className="bg-orange-500 text-black font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm">
        <span>✓</span>
        {message}
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-1 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl ${accent || "bg-orange-500"}`} />
      <span className="text-xs text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className={`text-4xl font-black ${accent || "text-white"}`}>{value}</span>
      {sub && <span className="text-xs text-zinc-500">{sub}</span>}
    </div>
  );
}

function TaskCard({ task, onUpdate, onDelete, onEdit }) {
  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const [expanded, setExpanded] = useState(false);

  const cycleStatus = () => {
    const order = ["open", "in-progress", "completed"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdate({ ...task, status: next });
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${p.bg} mb-3`}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full border ${p.bg} ${p.color}`}>
                {p.label}
              </span>
              <span className="text-xs text-zinc-500">
                {CATEGORY_ICONS[task.category]} {task.category}
              </span>
            </div>
            <h3 className="font-bold text-white leading-tight">{task.title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{task.lodge}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); cycleStatus(); }}
            className={`shrink-0 px-3 py-1 rounded-xl text-xs font-bold border transition-all hover:scale-105 ${s.bg} ${s.color} border-transparent`}
          >
            {s.label}
          </button>
        </div>

        {task.assignee && task.assignee !== "unassigned" && (
          <p className="text-xs text-zinc-400 mt-2">
            👤 {task.assignee} · Due {formatDate(task.due)}
          </p>
        )}
        {(!task.assignee || task.assignee === "unassigned") && (
          <p className="text-xs text-red-400 mt-2">⚠ Unassigned · Due {formatDate(task.due)}</p>
        )}
      </div>

      {expanded && (
        <div className="border-t border-white/10 px-4 py-3 bg-black/20">
          {task.notes && <p className="text-sm text-zinc-300 mb-3">{task.notes}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-orange-500/20 text-zinc-400 hover:text-orange-400 text-xs font-bold transition-all"
            >
              ✎ Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-900/40 text-zinc-400 hover:text-red-400 text-xs font-bold transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskModal({ task, onSave, onClose, isEdit }) {
  const [form, setForm] = useState(task || {
    title: "", lodge: "Dulini River Lodge", priority: "medium",
    category: "mechanical", assignee: "", due: "", notes: "", status: "open"
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, id: isEdit ? task.id : Date.now() });
    onClose();
  };

  const field = "w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black">{isEdit ? "Edit Task" : "New Task"}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-lg">✕</button>
        </div>

        <div className="space-y-3">
          <input className={field} placeholder="Task title *" value={form.title} onChange={e => set("title", e.target.value)} />

          <select className={field} value={form.lodge} onChange={e => set("lodge", e.target.value)}>
            {["Dulini River Lodge", "Leadwood Lodge", "Moya Lodge"].map(l => <option key={l}>{l}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <select className={field} value={form.priority} onChange={e => set("priority", e.target.value)}>
              {["urgent", "high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
            </select>
            <select className={field} value={form.category} onChange={e => set("category", e.target.value)}>
              {["mechanical", "electrical", "plumbing", "structural"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <select className={field} value={form.assignee} onChange={e => set("assignee", e.target.value)}>
            <option value="">Unassigned</option>
            {techniciansData.map(t => <option key={t.name}>{t.name}</option>)}
          </select>

          <input className={field} type="date" value={form.due} onChange={e => set("due", e.target.value)} />
          <textarea className={`${field} resize-none`} rows={3} placeholder="Notes (optional)" value={form.notes} onChange={e => set("notes", e.target.value)} />
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-700 transition-colors">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 py-3 rounded-2xl bg-orange-500 text-black font-black text-sm hover:bg-orange-400 transition-colors">
            {isEdit ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

function Dashboard({ tasks }) {
  const open = tasks.filter(t => t.status === "open").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const done = tasks.filter(t => t.status === "completed").length;
  const urgent = tasks.filter(t => t.priority === "urgent" && t.status !== "completed");
  const unassigned = tasks.filter(t => !t.assignee || t.assignee === "unassigned");
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black text-white leading-none">Operations</h2>
        <p className="text-zinc-500 text-sm mt-1">Dulini Sabie Sands · {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Open" value={open} sub="tasks pending" accent="text-red-400" />
        <StatCard label="In Progress" value={inProgress} sub="being worked on" accent="text-amber-400" />
        <StatCard label="Completed" value={done} sub="this period" accent="text-green-400" />
        <StatCard label="Completion" value={`${rate}%`} sub="overall rate" accent="text-orange-400" />
      </div>

      {urgent.length > 0 && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">🔴 Urgent Attention Required</h3>
          <div className="space-y-2">
            {urgent.map(t => (
              <div key={t.id} className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white">{t.title}</p>
                    <p className="text-xs text-red-300 mt-0.5">{t.lodge} · {CATEGORY_ICONS[t.category]} {t.category}</p>
                  </div>
                  {!t.assignee || t.assignee === "unassigned" ? (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">Unassigned</span>
                  ) : (
                    <span className="text-xs text-zinc-400">{t.assignee}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unassigned.length > 0 && (
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">⚠ Unassigned Tasks</h3>
          <div className="space-y-2">
            {unassigned.map(t => (
              <div key={t.id} className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-4">
                <p className="font-bold text-white text-sm">{t.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t.lodge} · Due {formatDate(t.due)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Task Distribution</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          {[
            { label: "Mechanical", count: tasks.filter(t => t.category === "mechanical").length, color: "bg-blue-500" },
            { label: "Electrical", count: tasks.filter(t => t.category === "electrical").length, color: "bg-amber-500" },
            { label: "Plumbing",   count: tasks.filter(t => t.category === "plumbing").length,   color: "bg-cyan-500" },
            { label: "Structural", count: tasks.filter(t => t.category === "structural").length, color: "bg-orange-500" },
          ].map(cat => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-20">{cat.label}</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${cat.color} transition-all duration-700`} style={{ width: tasks.length ? `${(cat.count / tasks.length) * 100}%` : "0%" }} />
              </div>
              <span className="text-xs text-zinc-400 w-4 text-right">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">By Lodge</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          {["Dulini River Lodge", "Leadwood Lodge", "Moya Lodge"].map(l => {
            const total = tasks.filter(t => t.lodge === l).length;
            const done = tasks.filter(t => t.lodge === l && t.status === "completed").length;
            return (
              <div key={l}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-300">{l}</span>
                  <span className="text-zinc-500">{done}/{total} done</span>
                </div>
                <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: total ? `${(done / total) * 100}%` : "0%" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {urgent.length === 0 && unassigned.length === 0 && (
        <div className="text-center py-8 text-zinc-500 text-sm">No urgent tasks — all clear 🦁</div>
      )}
    </div>
  );
}

function TasksView({ tasks, setTasks, showToast }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filtered = tasks
    .filter(t => filter === "all" || t.status === filter || t.priority === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.lodge.toLowerCase().includes(search.toLowerCase()));

  const updateTask = updated => {
    setTasks(ts => ts.map(t => t.id === updated.id ? updated : t));
    showToast(`Status → ${STATUS_CONFIG[updated.status].label}`);
  };

  const deleteTask = id => {
    setTasks(ts => ts.filter(t => t.id !== id));
    showToast("Task removed");
  };

  const addTask = task => {
    setTasks(ts => [task, ...ts]);
    showToast("Task added!");
  };

  const editTask = task => {
    setEditingTask(task);
    setShowModal(true);
  };

  const saveTask = task => {
    if (editingTask) {
      setTasks(ts => ts.map(t => t.id === task.id ? task : t));
      showToast("Task updated!");
      setEditingTask(null);
    } else {
      addTask(task);
    }
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Done" },
    { key: "urgent", label: "🔴 Urgent" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black">Tasks</h2>
        <button
          onClick={() => { setEditingTask(null); setShowModal(true); }}
          className="bg-orange-500 hover:bg-orange-400 text-black font-black px-4 py-2 rounded-2xl text-sm transition-colors"
        >
          + New
        </button>
      </div>

      <input
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
        placeholder="Search tasks or lodges…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f.key ? "bg-orange-500 text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">No tasks match this filter.</div>
        ) : (
          filtered.map(t => (
            <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onEdit={editTask} />
          ))
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          isEdit={!!editingTask}
          onSave={saveTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}

function TechniciansView({ tasks }) {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-black">Technicians</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {techniciansData.map(tech => {
          const activeTasks = tasks.filter(t => t.assignee === tech.name && t.status !== "completed");
          return (
            <div key={tech.name} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-xl font-black text-white shadow-lg`}>
                    {tech.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{tech.name}</h3>
                    <p className="text-zinc-500 text-sm">{tech.lodge}</p>
                    <p className="text-xs text-orange-400 mt-0.5">{tech.specialty}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tech.status === "Off Duty" ? "bg-zinc-800 text-zinc-400" : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}>
                  {tech.status}
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-4">{tech.bio}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-black/30 rounded-2xl p-3 text-center">
                  <div className="text-xl font-bold text-orange-400">{tech.jobs}</div>
                  <div className="text-zinc-500 text-[10px] mt-1">Jobs Done</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-3 text-center">
                  <div className="text-xl font-bold text-green-400">{tech.completion}</div>
                  <div className="text-zinc-500 text-[10px] mt-1">Completion</div>
                </div>
                <div className="bg-black/30 rounded-2xl p-3 text-center">
                  <div className="text-xl font-bold text-zinc-300">{activeTasks.length}</div>
                  <div className="text-zinc-500 text-[10px] mt-1">Open Tasks</div>
                </div>
              </div>

              {activeTasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Active Tasks</p>
                  {activeTasks.slice(0, 2).map(t => (
                    <div key={t.id} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-sm text-zinc-300 truncate max-w-[70%]">{t.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${PRIORITY_CONFIG[t.priority].bg} ${PRIORITY_CONFIG[t.priority].color}`}>
                        {PRIORITY_CONFIG[t.priority].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <a href={`tel:${tech.phone}`} className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-2xl text-sm font-bold text-center transition-all">
                  📞 Call
                </a>
                <a href={`https://wa.me/${tech.phone.replace(/\s+/g, "")}`} target="_blank" rel="noreferrer" className="flex-1 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 py-2.5 rounded-2xl text-sm font-bold text-center transition-all">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContractorsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-black">Contractors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contractorsData.map(c => (
          <div key={c.name} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-orange-400 text-lg font-bold">
                  {c.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{c.name}</h3>
                  <p className="text-zinc-500 text-xs">{c.contact}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                c.status === "preferred" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-zinc-800 text-zinc-400"
              }`}>
                {c.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Specialty</span>
                <span className="text-zinc-300">{c.speciality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Rate</span>
                <span className="text-green-400 font-bold">{c.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone</span>
                <a href={`tel:${c.phone}`} className="text-blue-400 hover:text-blue-300">{c.phone}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryView() {
  const [items, setItems] = useState(inventoryData);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Mechanical", qty: "", unit: "Units", status: "In Stock" });

  const addItem = () => {
    if (!form.name.trim() || !form.qty) return;
    setItems([...items, { ...form, qty: parseInt(form.qty) }]);
    setForm({ name: "", category: "Mechanical", qty: "", unit: "Units", status: "In Stock" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black">Inventory</h2>
        <button onClick={() => setShowAdd(true)} className="bg-orange-500 text-black px-5 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all">
          + Add Item
        </button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" placeholder="Item name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500" placeholder="Qty" type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {["Mechanical", "Electrical", "Plumbing", "Structural", "HVAC", "Generator", "Lighting"].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
              {["Units", "Sets", "Drums", "Meters", "Planks", "Kits"].map(u => <option key={u}>{u}</option>)}
            </select>
            <select className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {["In Stock", "Low Stock", "Out of Stock"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-sm">Cancel</button>
            <button onClick={addItem} className="flex-1 py-2 rounded-xl bg-orange-500 text-black font-bold text-sm">Add Item</button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-zinc-500 text-xs tracking-widest border-b border-zinc-800">
                <th className="text-left py-5 px-6">ITEM</th>
                <th className="text-left py-5 px-4">CATEGORY</th>
                <th className="text-left py-5 px-4">QTY</th>
                <th className="text-left py-5 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-zinc-900 hover:bg-black/20 transition-all">
                  <td className="py-4 px-6 font-medium">{item.name}</td>
                  <td className="py-4 px-4 text-zinc-400 text-sm">{item.category}</td>
                  <td className="py-4 px-4 text-orange-400 font-bold">{item.qty} <span className="text-zinc-600 font-normal text-xs">{item.unit}</span></td>
                  <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${INVENTORY_STATUS[item.status]}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsView({ tasks }) {
  const done = tasks.filter(t => t.status === "completed");
  const open = tasks.filter(t => t.status === "open");
  const inProgress = tasks.filter(t => t.status === "in-progress");
  const urgent = tasks.filter(t => t.priority === "urgent");
  const byLodge = ["Dulini River Lodge", "Leadwood Lodge", "Moya Lodge"].map(l => ({
    lodge: l,
    total: tasks.filter(t => t.lodge === l).length,
    done: tasks.filter(t => t.lodge === l && t.status === "completed").length,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-black">Reports</h2>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total" value={tasks.length} accent="text-white" />
        <StatCard label="Resolved" value={done.length} accent="text-green-400" />
        <StatCard label="Urgent" value={urgent.length} accent="text-red-400" />
        <StatCard label="Rate" value={`${tasks.length ? Math.round((done.length / tasks.length) * 100) : 0}%`} accent="text-orange-400" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Status Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/30 rounded-2xl p-4">
            <div className="text-3xl font-black text-red-400">{open.length}</div>
            <div className="text-xs text-zinc-500 mt-1">Open</div>
          </div>
          <div className="bg-black/30 rounded-2xl p-4">
            <div className="text-3xl font-black text-amber-400">{inProgress.length}</div>
            <div className="text-xs text-zinc-500 mt-1">In Progress</div>
          </div>
          <div className="bg-black/30 rounded-2xl p-4">
            <div className="text-3xl font-black text-green-400">{done.length}</div>
            <div className="text-xs text-zinc-500 mt-1">Completed</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">By Lodge</h3>
        <div className="space-y-4">
          {byLodge.map(l => (
            <div key={l.lodge}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-zinc-300">{l.lodge}</span>
                <span className="text-zinc-500">{l.done}/{l.total} done</span>
              </div>
              <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: l.total ? `${(l.done / l.total) * 100}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center">
        <p className="text-zinc-600 text-sm">PDF export coming soon</p>
        <button className="mt-3 px-5 py-2.5 rounded-2xl bg-zinc-800 text-zinc-500 text-sm font-bold cursor-not-allowed">
          Export PDF Report
        </button>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-black">Settings</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold mb-2">App Preferences</h3>
          <p className="text-zinc-500 text-sm">Manage your Dulini Ops experience</p>
        </div>
        <div className="space-y-4">
          {[
            { label: "Push Notifications", desc: "Get alerts for urgent tasks and status changes", checked: true },
            { label: "Auto-assign Tasks", desc: "Automatically suggest technicians based on specialty", checked: false },
            { label: "Dark Mode", desc: "Always use dark theme (currently enforced)", checked: true },
            { label: "Weekly Reports", desc: "Email summary every Monday morning", checked: true },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${s.checked ? "bg-orange-500" : "bg-zinc-700"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${s.checked ? "left-[22px]" : "left-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-2">Data Management</h3>
        <p className="text-zinc-500 text-sm mb-4">Clear local storage and reset to defaults</p>
        <button className="px-5 py-2.5 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-bold hover:bg-red-500/20 transition-all">
          Reset All Data
        </button>
      </div>

      <div className="text-center text-xs text-zinc-700 pt-4">
        Dulini Sabie Sands · Maintenance Ops v1.0 · © 2026
      </div>
    </div>
  );
}

function PlaceholderView({ name }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="text-5xl mb-4">🔧</div>
      <h2 className="text-3xl font-black mb-2">{name}</h2>
      <p className="text-zinc-500">This module is ready for expansion.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

function BottomNav({ activeTab, setActiveTab }) {
  const mobile = NAV_ITEMS.slice(0, 5);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex lg:hidden z-40">
      {mobile.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${
            activeTab === item.id ? "text-orange-400" : "text-zinc-600"
          }`}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function DuliniMaintenanceApp() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("dulini_tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch { return initialTasks; }
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("dulini_tasks", JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":   return <Dashboard tasks={tasks} />;
      case "tasks":       return <TasksView tasks={tasks} setTasks={setTasks} showToast={showToast} />;
      case "technicians": return <TechniciansView tasks={tasks} />;
      case "contractors": return <ContractorsView />;
      case "inventory":   return <InventoryView />;
      case "reports":     return <ReportsView tasks={tasks} />;
      case "settings":    return <SettingsView />;
      default:            return <PlaceholderView name={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />;
    }
  };

  const openTasks = tasks.filter(t => t.status !== "completed").length;
  const urgentTasks = tasks.filter(t => t.priority === "urgent" && t.status !== "completed").length;

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar — desktop + mobile slide-out */}
      <aside className={`fixed lg:relative top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col shrink-0 z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🦁</span>
            <h1 className="text-2xl font-black text-orange-400">Dulini Ops</h1>
          </div>
          <p className="text-zinc-500 text-xs">Maintenance Command Center</p>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold ${
                activeTab === item.id
                  ? "bg-orange-500 text-black"
                  : "hover:bg-zinc-900 text-zinc-400"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-xs tracking-widest mb-3">LIVE STATUS</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Open Tasks</span>
              <span className="bg-orange-500 text-black px-2.5 py-0.5 rounded-full text-xs font-bold">{openTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Urgent Issues</span>
              <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{urgentTasks}</span>
            </div>
          </div>
          <p className="text-xs text-zinc-700 mt-4 text-center">Dulini Sabie Sands © 2026</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 bg-black/90 backdrop-blur-sm border-b border-zinc-900 px-5 py-4 flex items-center justify-between z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 text-2xl">☰</button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🦁</span>
            <span className="text-lg font-black text-orange-400">Dulini Ops</span>
          </div>
          <div className="w-8" />
        </div>

        <div className="p-5 lg:p-10">
          {renderContent()}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
