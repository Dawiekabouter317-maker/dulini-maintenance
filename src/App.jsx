import { useState } from "react";

export default function App() {

  const [tasks, setTasks] = useState([
    {
      lodge: "River Lodge",
      title: "Generator Fuel Leak",
      status: "In Progress",
      contractor: "Japie",
    },
    {
      lodge: "Leadwood Lodge",
      title: "Cold Room Fault",
      status: "Waiting on Parts",
      contractor: "Len Nel",
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [newLodge, setNewLodge] = useState("River Lodge");

  function addTask() {

    if (!newTask) return;

    const task = {
      lodge: newLodge,
      title: newTask,
      status: "Reported",
      contractor: "Unassigned",
    };

    setTasks([task, ...tasks]);

    setNewTask("");
  }

  function completeTask(index) {

    const updatedTasks = [...tasks];

    updatedTasks[index].status = "Completed";

    setTasks(updatedTasks);
  }

  function deleteTask(index) {

    const updatedTasks = tasks.filter((_, i) => i !== index);

    setTasks(updatedTasks);
  }

  return (
    <div className="min-h-screen bg-[#0f1720] text-white">

      <div className="flex">

        {/* SIDEBAR */}

        <aside className="hidden lg:flex flex-col w-72 bg-[#111827] min-h-screen border-r border-slate-800 p-6">

          <div className="mb-10">

            <h1 className="text-3xl font-bold text-amber-400">
              DULINI
            </h1>

            <p className="text-slate-400 mt-1 text-sm">
              Maintenance Operations Center
            </p>

          </div>

          <nav className="space-y-3">

            <button className="w-full text-left bg-amber-500 text-black font-semibold px-4 py-3 rounded-2xl">
              Dashboard
            </button>

            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-2xl">
              Urgent Issues
            </button>

            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-2xl">
              Contractors
            </button>

            <button className="w-full text-left bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-2xl">
              Reports
            </button>

          </nav>

          <div className="mt-auto bg-slate-900 rounded-3xl p-5 border border-slate-700">

            <p className="text-slate-400 text-sm mb-2">
              Operations Health
            </p>

            <h2 className="text-5xl font-bold text-green-400">
              84%
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Lodge systems operational
            </p>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <main className="flex-1 p-4 md:p-8">

          {/* HEADER */}

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Maintenance Operations Center
              </h1>

              <p className="text-slate-400 text-lg">
                River Lodge • Leadwood Lodge • Moya Lodge
              </p>

            </div>

            <div className="flex gap-3 flex-wrap">

              <button className="bg-red-600 hover:bg-red-700 px-5 py-4 rounded-2xl font-semibold text-lg">
                + Report Issue
              </button>

              <button className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-4 rounded-2xl font-semibold text-lg">
                Generate Handover
              </button>

            </div>

          </div>

          {/* ADD TASK */}

          <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-2xl mb-8">

            <h2 className="text-2xl font-bold mb-6">
              Report Maintenance Issue
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

              <select
                value={newLodge}
                onChange={(e) => setNewLodge(e.target.value)}
                className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4"
              >
                <option>River Lodge</option>
                <option>Leadwood Lodge</option>
                <option>Moya Lodge</option>
              </select>

              <input
                type="text"
                placeholder="Enter maintenance issue..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 lg:col-span-2"
              />

              <button
                onClick={addTask}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl p-4"
              >
                Add Task
              </button>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700">

              <p className="text-slate-400 mb-2">
                Total Tasks
              </p>

              <h2 className="text-5xl font-bold text-white">
                {tasks.length}
              </h2>

            </div>

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700">

              <p className="text-slate-400 mb-2">
                Completed
              </p>

              <h2 className="text-5xl font-bold text-green-400">
                {tasks.filter(task => task.status === "Completed").length}
              </h2>

            </div>

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700">

              <p className="text-slate-400 mb-2">
                Active Issues
              </p>

              <h2 className="text-5xl font-bold text-red-400">
                {tasks.filter(task => task.status !== "Completed").length}
              </h2>

            </div>

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700">

              <p className="text-slate-400 mb-2">
                Contractors
              </p>

              <h2 className="text-5xl font-bold text-amber-400">
                4
              </h2>

            </div>

          </div>

          {/* TASK BOARD */}

          <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Operations Task Board
              </h2>

              <div className="bg-red-600 px-4 py-2 rounded-xl font-semibold">
                Live Maintenance Issues
              </div>

            </div>

            <div className="space-y-5">

              {tasks.map((task, index) => (

                <div
                  key={index}
                  className={`rounded-3xl p-6 border ${
                    task.status === "Completed"
                      ? "bg-green-900/20 border-green-500/20"
                      : "bg-[#1e293b] border-red-500/20"
                  }`}
                >

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3 mb-4">

                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold ${
                            task.status === "Completed"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {task.status}
                        </span>

                        <span className="text-slate-400 text-sm">
                          {task.lodge}
                        </span>

                      </div>

                      <h3 className="text-2xl font-bold mb-2">
                        {task.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

                        <div>

                          <p className="text-slate-500 text-sm">
                            Contractor
                          </p>

                          <p className="font-semibold">
                            {task.contractor}
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500 text-sm">
                            Status
                          </p>

                          <p className="font-semibold">
                            {task.status}
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-500 text-sm">
                            Lodge
                          </p>

                          <p className="font-semibold">
                            {task.lodge}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-col gap-3 min-w-[220px]">

                      {task.status !== "Completed" && (

                        <button
                          onClick={() => completeTask(index)}
                          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl font-semibold"
                        >
                          Mark Completed
                        </button>

                      )}

                      <button
                        onClick={() => deleteTask(index)}
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-semibold"
                      >
                        Delete Task
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}