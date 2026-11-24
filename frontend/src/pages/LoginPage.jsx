import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KanbanSquare,
  Lock,
  Mail,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Logged in successfully");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Account created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b1a] text-white">
      <div className="absolute left-[-10rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-600/30 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-12 px-6 py-10 lg:grid-cols-2 lg:items-center">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl">
            <Sparkles size={16} className="text-yellow-300" />
            Portfolio-ready productivity app
          </div>

          <h1 className="max-w-2xl text-6xl font-black leading-tight tracking-tight">
            Manage work like a modern SaaS product.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            A polished full-stack task manager with authentication, Kanban workflow,
            analytics, activity feed and a professional dashboard.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            <Feature icon={<KanbanSquare />} title="Kanban" />
            <Feature icon={<Zap />} title="Fast UI" />
            <Feature icon={<Lock />} title="JWT Auth" />
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Workspace preview</p>
                <h3 className="text-xl font-bold">Today’s Sprint</h3>
              </div>

              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300">
                72% done
              </span>
            </div>

            <div className="space-y-3">
              <MiniTask title="Design dashboard analytics" status="In Progress" />
              <MiniTask title="Build Kanban drag & drop" status="Review" />
              <MiniTask title="Prepare portfolio screenshots" status="Done" />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-md"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/30">
                <KanbanSquare size={30} />
              </div>

              <h2 className="text-3xl font-black">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {mode === "login"
                  ? "Login to open your workspace."
                  : "Create your productivity workspace."}
              </p>
            </div>

            {mode === "register" && (
              <Input
                icon={<User size={18} />}
                label="Name"
                placeholder="Your name"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
              />
            )}

            <Input
              icon={<Mail size={18} />}
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-12 outline-none transition focus:border-blue-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={busy}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-blue-700/30 transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>

            <p className="mt-6 text-center text-sm text-slate-300">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="font-bold text-blue-300 hover:text-blue-200"
              >
                {mode === "login" ? "Register" : "Login"}
              </button>
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Demo login after seeding:
              <div className="mt-2 rounded-xl bg-black/20 p-3 font-mono text-xs">
                demo@test.com / password123
              </div>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            App created by{" "}
            <span className="font-semibold text-white">Varada Gupta</span>
          </p>
        </motion.section>
      </div>
    </div>
  );
}

function Input({ icon, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-3.5 text-slate-400">{icon}</div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 outline-none transition focus:border-blue-400"
        />
      </div>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <div className="mb-4 text-blue-300">{icon}</div>
      <p className="font-bold">{title}</p>
    </div>
  );
}

function MiniTask({ title, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={18} className="text-emerald-300" />
        <span className="text-sm font-medium">{title}</span>
      </div>

      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
        {status}
      </span>
    </div>
  );
}