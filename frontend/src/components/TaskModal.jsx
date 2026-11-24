import { useEffect, useState } from "react";
import { Calendar, Flag, FileText, Type, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskModal({ open, task, onClose, onSubmit, loading = false }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title || "",
              description: task.description || "",
              status: task.status || "TODO",
              priority: task.priority || "MEDIUM",
              dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
            }
          : {
              title: "",
              description: "",
              status: "TODO",
              priority: "MEDIUM",
              dueDate: "",
            }
      );
    }
  }, [task, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Task title is required.");
      return;
    }

    onSubmit({
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">{task ? "Edit Task" : "Create Task"}</h2>
              <p className="mt-1 text-sm text-slate-500">Organize your work efficiently.</p>
            </div>

            <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
              <X />
            </button>
          </div>

          <label className="mb-2 block font-semibold">
            <Type className="mr-2 inline" size={16} />
            Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Finish React Dashboard"
            className="mb-5 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <label className="mb-2 block font-semibold">
            <FileText className="mr-2 inline" size={16} />
            Description
          </label>

          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add task details..."
            className="mb-5 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-semibold">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                <Flag className="mr-1 inline" size={16} />
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                <Calendar className="mr-1 inline" size={16} />
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl border px-6 py-3 font-semibold">
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}