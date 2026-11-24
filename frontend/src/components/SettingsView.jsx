import { Bell, ShieldCheck, User } from "lucide-react";

export default function SettingsView({ user }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <User />
          </div>

          <div>
            <h2 className="text-2xl font-black">Profile Settings</h2>
            <p className="text-sm text-slate-500">Demo settings page</p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-bold">Name</label>
        <input
          value={user?.name || ""}
          readOnly
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        />

        <label className="mb-2 block text-sm font-bold">Email</label>
        <input
          value={user?.email || ""}
          readOnly
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        />
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-black">Preferences</h2>

        <Setting icon={<Bell />} title="Notifications" description="Receive task reminders." />
        <Setting icon={<ShieldCheck />} title="Security" description="JWT protected workspace." />
      </div>
    </div>
  );
}

function Setting({ icon, title, description }) {
  return (
    <div className="mb-4 flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div>
        <h3 className="font-black">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}