import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

export default function CalendarView({ tasks }) {
  const datedTasks = tasks.filter((task) => task.dueDate);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <CalendarDays />
        </div>

        <div>
          <h2 className="text-2xl font-black">Calendar</h2>
          <p className="text-sm text-slate-500">Upcoming tasks by due date</p>
        </div>
      </div>

      {datedTasks.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-6 text-slate-500">
          No tasks with due dates yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {datedTasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-bold text-blue-600">
                {format(new Date(task.dueDate), "dd MMM yyyy")}
              </p>
              <h3 className="mt-2 font-black">{task.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{task.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}