import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Zap,
} from "lucide-react";

export default function Sidebar({ activePage, setActivePage, logout }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare size={18} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays size={18} /> },
    { id: "team", label: "Team", icon: <Users size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-slate-200 bg-white/90 p-5 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
          <Zap />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight">TaskFlow</h1>
          <p className="text-xs text-slate-500">Modern Task OS</p>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
              activePage === item.id
                ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-4 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-xl">
          <p className="text-sm font-bold">Upgrade your workflow</p>
          <p className="mt-2 text-xs leading-5 text-blue-100">
            Use priorities, due dates and Kanban stages to keep your work moving.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}