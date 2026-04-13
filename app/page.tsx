"use client";

import { useState } from "react";

type Task = {
  id: number;
  text: string;
  done: boolean;
};

export default function TaskFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Add task
  const addTask = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  // Delete task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Toggle complete
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <main className="min-h-screen bg-black text-white px-10 py-20 max-w-2xl mx-auto">

      <h1 className="text-5xl font-semibold mb-10">
        TaskFlow
      </h1>

      {/* Input */}
      <div className="flex gap-3 mb-10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-4 bg-neutral-900 border border-neutral-700 rounded-xl text-white outline-none"
        />

        <button
          onClick={addTask}
          className="px-6 bg-white text-black rounded-xl"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-neutral-500">
            No tasks yet. Add one above.
          </p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl"
          >
            <span
              onClick={() => toggleTask(task.id)}
              className={`cursor-pointer ${
                task.done
                  ? "line-through text-neutral-500"
                  : ""
              }`}
            >
              {task.text}
            </span>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}