import { CheckCircle2, CircleDot, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityTimeline({ tasks }) {
  const latest = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black">Recent Activity</h3>
        <p className="text-sm text-slate-500">Latest task changes in your workspace</p>
      </div>

      <div className="space-y-4">
        {latest.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet.</p>
        ) : (
          latest.map((task) => (
            <div key={task.id} className="flex gap-3">
              <div className="mt-1">
                {task.status === "DONE" ? (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                ) : task.status === "IN_PROGRESS" ? (
                  <Clock className="text-amber-500" size={18} />
                ) : (
                  <CircleDot className="text-blue-500" size={18} />
                )}
              </div>

              <div>
                <p className="text-sm font-bold">{task.title}</p>
                <p className="text-xs text-slate-500">
                  {task.status.replace("_", " ")} ·{" "}
                  {formatDistanceToNow(new Date(task.updatedAt || task.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}