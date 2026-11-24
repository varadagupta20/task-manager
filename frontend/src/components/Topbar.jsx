import { Bell, Menu, Plus, Search } from "lucide-react";

export default function Topbar({ user, onNewTask, search, setSearch }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h2 className="text-2xl font-black tracking-tight">{user?.name || "User"} 👋</h2>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, notes, priorities..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>

          <button className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
            <Bell size={20} />
          </button>

          <button
            onClick={onNewTask}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            <Plus className="mr-1 inline" size={18} />
            New Task
          </button>

          <button className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
}