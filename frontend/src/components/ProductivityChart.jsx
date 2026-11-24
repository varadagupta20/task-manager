import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProductivityChart({ tasks }) {
  const data = [
    { name: "To Do", tasks: tasks.filter((task) => task.status === "TODO").length },
    { name: "Progress", tasks: tasks.filter((task) => task.status === "IN_PROGRESS").length },
    { name: "Done", tasks: tasks.filter((task) => task.status === "DONE").length },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black">Productivity Overview</h3>
        <p className="text-sm text-slate-500">Tasks by current workflow stage</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="tasks" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}