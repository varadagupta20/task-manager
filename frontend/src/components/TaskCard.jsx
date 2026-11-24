import { Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

const priorityClass = {
  LOW: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-rose-50 text-rose-700",
};

const statusLabel = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskCard({ task, onEdit, onDelete, dragProps = {} }) {
  return (
    <article className="group rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black leading-snug">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        <button
          {...dragProps}
          className="cursor-grab rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
        >
          <GripVertical size={17} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={clsx("rounded-full px-2.5 py-1 font-bold", priorityClass[task.priority])}>
          {task.priority}
        </span>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-600">
          {statusLabel[task.status]}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-700">
            <Calendar size={13} />
            {format(new Date(task.dueDate), "dd MMM")}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 rounded-xl border px-3 py-2 text-sm font-bold hover:bg-slate-50"
        >
          <Pencil className="mr-1 inline" size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-xl border border-rose-100 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}