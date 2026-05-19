import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  User,
  Wrench,
  Building2,
  Camera,
  Mic,
  FileText,
  Search,
  ClipboardCheck,
} from "lucide-react";

/*
  DULINI MAINTENANCE OPERATIONS
  FULL SINGLE FILE VERSION
  --------------------------------
  Features:
  - Luxury lodge UI
  - Dashboard
  - Task management
  - Technician assignment
  - Contractor assignment
  - Priority tracking
  - Photo uploads
  - Voice recording
  - Local persistence
  - Offline support
  - Weekly reports
  - Search & filters
  - Mobile optimized
  - PWA-ready structure
*/

const lodges = [
  "River Lodge",
  "Leadwood Lodge",
  "Tree Lodge",
  "Safari Lodge",
];

const technicians = [
  "Moshapo",
  "Richard",
  "Simon",
  "Tebogo",
];

const contractors = [
  "AquaTech",
  "Fire Systems SA",
  "CoolTech Aircon",
  "Bushveld Electrical",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const statuses = [
  "Pending",
  "In Progress",
  "Waiting Contractor",
  "Completed",
];

export default function DuliniMaintenanceOps() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const [form, setForm] = useState({
    title: "",
    lodge: lodges[0],
    technician: technicians[0],
    contractor: "",
    priority: "Medium",
    status: "Pending",
    due: "",
    notes: "",
    images: [],
    voiceNote: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("dulini_tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const demo = [
        {
          id: 1,
          title: "Replace Pool Pump Motor",
          lodge: "River Lodge",
          technician: "Moshapo",
          contractor: "AquaTech",
          priority: "Urgent",
          status: "In Progress",
          due: "2026-05-20",
          notes: "Main pool pump seized.",
          images: [],
        },
        {
          id: 2,
          title: "Hydrant Pressure Test",
          lodge: "Leadwood Lodge",
          technician: "Richard",
          contractor: "Fire Systems SA",
          priority: "High",
          status: "Pending",
          due: "2026-05-22",
          notes: "Monthly compliance test.",
          images: [],
        },
      ];

      setTasks(demo);
      localStorage.setItem("dulini_tasks", JSON.stringify(demo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dulini_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      urgent: tasks.filter((t) => t.priority === "Urgent").length,
      progress: tasks.filter((t) => t.status === "In Progress").length,
    };
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.lodge.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "All" || task.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleAddTask = () => {
    const newTask = {
      ...form,
      id: Date.now(),
    };

    setTasks([newTask, ...tasks]);

    setForm({
      title: "",
      lodge: lodges[0],
      technician: technicians[0],
      contractor: "",
      priority: "Medium",
      status: "Pending",
      due: "",
      notes: "",
      images: [],
      voiceNote: null,
    });

    setShowForm(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "Completed",
            }
          : task
      )
    );
  };

  const uploadImages = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setForm({
      ...form,
      images: imageUrls,
    });
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, {
        type: "audio/webm",
      });

      const audioUrl = URL.createObjectURL(blob);

      setForm((prev) => ({
        ...prev,
        voiceNote: audioUrl,
      }));

      chunks.current = [];
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const generateReport = () => {
    const report = tasks
      .map(
        (t) =>
          `${t.title} | ${t.lodge} | ${t.priority} | ${t.status}`
      )
      .join("\n");

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "dulini-weekly-report.txt";

    link.click();
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              Dulini Maintenance Ops
            </h1>

            <p className="text-zinc-400 mt-1">
              Luxury Lodge Operations Platform
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-3 rounded-2xl flex items-center gap-2 font-semibold"
            >
              <Plus size={18} />
              New Task
            </button>

            <button
              onClick={generateReport}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-2xl flex items-center gap-2"
            >
              <FileText size={18} />
              Weekly Report
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatCard
            icon={<ClipboardCheck />}
            label="Total Tasks"
            value={stats.total}
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Completed"
            value={stats.completed}
          />

          <StatCard
            icon={<AlertTriangle />}
            label="Urgent"
            value={stats.urgent}
          />

          <StatCard
            icon={<Clock3 />}
            label="In Progress"
            value={stats.progress}
          />
        </div>

        {/* SEARCH */}

        <div className="bg-zinc-900 rounded-3xl p-4 mb-6 border border-zinc-800">

          <div className="flex flex-col md:flex-row gap-3">

            <div className="flex-1 relative">

              <Search
                className="absolute left-3 top-3 text-zinc-500"
                size={18}
              />

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-800 rounded-2xl py-3 pl-10 pr-4 outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-zinc-800 rounded-2xl px-4 py-3 outline-none"
            >
              <option>All</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FORM */}

        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-6">

            <h2 className="text-xl font-semibold mb-4">
              Create Maintenance Task
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Task title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              />

              <select
                value={form.lodge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lodge: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              >
                {lodges.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <select
                value={form.technician}
                onChange={(e) =>
                  setForm({
                    ...form,
                    technician: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              >
                {technicians.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <select
                value={form.contractor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contractor: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              >
                <option value="">No Contractor</option>

                {contractors.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              >
                {priorities.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <input
                type="date"
                value={form.due}
                onChange={(e) =>
                  setForm({
                    ...form,
                    due: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none"
              />

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                className="bg-zinc-800 rounded-2xl p-3 outline-none md:col-span-2 min-h-[120px]"
              />

              {/* IMAGE */}

              <div className="bg-zinc-800 rounded-2xl p-4">

                <label className="flex items-center gap-2 mb-2">
                  <Camera size={18} />
                  Upload Photos
                </label>

                <input
                  type="file"
                  multiple
                  onChange={uploadImages}
                />
              </div>

              {/* VOICE */}

              <div className="bg-zinc-800 rounded-2xl p-4">

                <label className="flex items-center gap-2 mb-3">
                  <Mic size={18} />
                  Voice Notes
                </label>

                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-500 px-4 py-2 rounded-xl"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-zinc-600 px-4 py-2 rounded-xl"
                  >
                    Stop Recording
                  </button>
                )}

                {form.voiceNote && (
                  <audio
                    controls
                    src={form.voiceNote}
                    className="mt-3 w-full"
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleAddTask}
              className="mt-5 bg-amber-500 hover:bg-amber-400 text-black px-5 py-3 rounded-2xl font-semibold"
            >
              Save Task
            </button>
          </div>
        )}

        {/* TASKS */}

        <div className="space-y-4">

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">

                <div className="flex-1">

                  <div className="flex items-center gap-3 mb-3">

                    <div
                      className={`w-3 h-3 rounded-full ${priorityColor(
                        task.priority
                      )}`}
                    />

                    <h3 className="text-xl font-semibold">
                      {task.title}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm text-zinc-300">

                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      {task.lodge}
                    </div>

                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {task.technician}
                    </div>

                    <div className="flex items-center gap-2">
                      <Wrench size={16} />
                      {task.contractor || "Internal Team"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      Due: {task.due || "Not Set"}
                    </div>
                  </div>

                  <p className="text-zinc-400 mt-4">
                    {task.notes}
                  </p>

                  {/* PHOTOS */}

                  {task.images?.length > 0 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto">

                      {task.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          className="w-24 h-24 object-cover rounded-2xl"
                        />
                      ))}
                    </div>
                  )}

                  {/* AUDIO */}

                  {task.voiceNote && (
                    <audio
                      controls
                      src={task.voiceNote}
                      className="mt-4 w-full"
                    />
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex md:flex-col gap-3">

                  <div className="bg-zinc-800 px-4 py-2 rounded-2xl text-center">
                    {task.status}
                  </div>

                  <button
                    onClick={() => completeTask(task.id)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-2xl"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-2xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center text-zinc-500 py-20">
              No maintenance tasks found.
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="mt-10 text-center text-zinc-500 text-sm">
          Dulini Luxury Lodge Maintenance Operations System
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-zinc-400">{label}</div>
        <div className="text-amber-400">{icon}</div>
      </div>

      <div className="text-3xl font-bold">
        {value}
      </div>
    </div>
  );
}
