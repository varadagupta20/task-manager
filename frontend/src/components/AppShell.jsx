import { LogOut, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function AppShell({ user, onLogout, onSearchFocus, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Task Manager</p>
            <h1 className="text-xl font-bold">Hello, {user?.name || 'there'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSearchFocus}
              className="hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 md:flex dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <Search size={16} /> Quick search
            </button>

            <ThemeToggle />

            <button
              onClick={onLogout}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <LogOut size={16} className="inline" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}