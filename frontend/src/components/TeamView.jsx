import { Mail, UserPlus, Users } from "lucide-react";

const members = [
  { name: "Demo User", role: "Project Owner", email: "demo@test.com" },
  { name: "Frontend Lead", role: "UI Designer", email: "frontend@example.com" },
  { name: "Backend Lead", role: "API Engineer", email: "backend@example.com" },
];

export default function TeamView() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <Users />
          </div>

          <div>
            <h2 className="text-2xl font-black">Team</h2>
            <p className="text-sm text-slate-500">Demo collaboration page</p>
          </div>
        </div>

        <button className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white">
          <UserPlus className="mr-1 inline" size={18} />
          Invite
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {members.map((member) => (
          <div key={member.email} className="rounded-2xl border border-slate-200 p-5">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-xl font-black">
              {member.name[0]}
            </div>

            <h3 className="font-black">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.role}</p>

            <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Mail size={15} />
              {member.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}