"use client";


import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
  isEditing?: boolean;
  editText?: string;
};

type Filter = "all" | "active" | "completed";

export default function TaskFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

const toggleTask = (id: number) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    )
  );
};

  // 🔥 FILTER LOGIC
const filteredTasks = tasks
  .filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  })
  .sort((a, b) => {
    // Active first, completed last
    return Number(a.done) - Number(b.done);
  });

  // 🔥 COUNTER LOGIC
  const total = tasks.length;
const completed = tasks.filter((t) => t.done).length;
const active = tasks.filter((t) => !t.done).length;

const startEdit = (id: number) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id
        ? { ...t, isEditing: true, editText: t.text }
        : t
    )
  );
};

const cancelEdit = (id: number) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id ? { ...t, isEditing: false } : t
    )
  );
};

const saveEdit = (id: number) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === id
        ? {
            ...t,
            text: t.editText || t.text,
            isEditing: false,
          }
        : t
    )
  );
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-neutral-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-2xl bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <h1 className="text-4xl font-semibold text-center mb-2">
          TaskFlow
        </h1>

        <p className="text-neutral-400 text-center mb-3">
          Simple tasks. Clean focus.
        </p>

        {/* 🔥 COUNTER */}
<p className="text-center text-sm mb-6 text-neutral-400">
  <span className="text-white">{total} tasks</span>
  {" • "}
  <span className="text-green-400">{completed} completed</span>
  {" • "}
  <span className="text-blue-400">{active} active</span>
</p>

        {/* FILTERS */}
        <div className="flex justify-center gap-3 mb-6">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm transition border ${
                filter === f
                  ? "bg-white text-black border-white"
                  : "bg-black/30 border-neutral-700 text-neutral-300 hover:border-neutral-500"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* INPUT */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    addTask();
  }}
  className="flex gap-3 mb-8"
>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Add a new task..."
    className="flex-1 p-4 rounded-xl bg-black/40 border border-neutral-700 text-white outline-none focus:border-white transition"
  />

  <button
    type="submit"
    className="px-6 rounded-xl bg-white text-black font-medium hover:scale-105 transition"
  >
    Add
  </button>
</form>

        {/* TASKS */}
        <div className="space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-center text-neutral-500">
              No tasks in this view.
            </p>
          )}

          {filteredTasks.map((task) => (
  <div
    key={task.id}
    className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-neutral-800"
  >
    {/* TEXT OR EDIT INPUT */}
    {task.isEditing ? (
      <input
        value={task.editText}
        onChange={(e) =>
          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? { ...t, editText: e.target.value }
                : t
            )
          )
        }
        className="flex-1 p-2 rounded bg-black border border-neutral-700 text-white"
      />
    ) : (
      <span
        className={`transition ${
          task.done
            ? "line-through text-neutral-500"
            : "text-white"
        }`}
      >
        {task.text}
      </span>
    )}

    {/* ACTIONS */}
    <div className="flex gap-2 ml-4">

      {/* EDIT */}
      {!task.done && !task.isEditing && (
        <button
          onClick={() => startEdit(task.id)}
          className="text-blue-400 text-sm"
        >
          Edit
        </button>
      )}

      {/* SAVE */}
      {task.isEditing && (
        <button
          onClick={() => saveEdit(task.id)}
          className="text-green-400 text-sm"
        >
          Save
        </button>
      )}

      {/* CANCEL */}
      {task.isEditing && (
        <button
          onClick={() => cancelEdit(task.id)}
          className="text-gray-400 text-sm"
        >
          Cancel
        </button>
      )}

      {/* COMPLETE */}
      {!task.done && !task.isEditing && (
        <button
          onClick={() => toggleTask(task.id)}
          className="text-green-400 text-sm"
        >
          Complete
        </button>
      )}

      {/* DELETE */}
      {!task.isEditing && (
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-400 text-sm"
        >
          Delete
        </button>
      )}
    </div>
  </div>
))}
        </div>

      </div>
    </main>
  );
}