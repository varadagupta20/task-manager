import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import KanbanBoard from "../components/KanbanBoard";
import StatCard from "../components/StatCard";
import ProductivityChart from "../components/ProductivityChart";
import ActivityTimeline from "../components/ActivityTimeline";
import CalendarView from "../components/CalendarView";
import TeamView from "../components/TeamView";
import SettingsView from "../components/SettingsView";

import {
  CheckCircle2,
  Clock,
  Flame,
  LayoutGrid,
  ListChecks,
  Plus,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [activePage, setActivePage] = useState("dashboard");
  const [view, setView] = useState("board");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await api.get("/tasks")).data,
  });

  const createOrUpdateTask = useMutation({
    mutationFn: (data) =>
      editingTask ? api.put(`/tasks/${editingTask.id}`, data) : api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(editingTask ? "Task updated" : "Task created");
      setModalOpen(false);
      setEditingTask(null);
    },
    onError: () => toast.error("Could not save task"),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Could not delete task"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/tasks/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const oldTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], oldTasks?.map((task) =>
        task.id === id ? { ...task, status } : task
      ));

      return { oldTasks };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context.oldTasks);
      toast.error("Could not move task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchable = `${task.title} ${task.description || ""}`.toLowerCase();

      return (
        searchable.includes(search.toLowerCase()) &&
        (priority === "ALL" || task.priority === priority)
      );
    });
  }, [tasks, search, priority]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "TODO").length,
    progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    done: tasks.filter((task) => task.status === "DONE").length,
    high: tasks.filter((task) => task.priority === "HIGH").length,
  };

  const completion = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  const openNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <Sidebar activePage={activePage} setActivePage={setActivePage} logout={logout} />

      <main className="lg:ml-72">
        <Topbar user={user} onNewTask={openNewTask} search={search} setSearch={setSearch} />

        <section className="p-5">
          {activePage === "dashboard" && (
            <>
              <div className="mb-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
                  <p className="mb-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
                    Project Overview
                  </p>

                  <h2 className="max-w-xl text-4xl font-black">
                    You have {stats.todo + stats.progress} active tasks to focus on.
                  </h2>

                  <p className="mt-4 max-w-xl text-blue-100">
                    Track your work visually, move tasks across stages, and keep your
                    priorities clear.
                  </p>

                  <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-blue-100">{completion}% completed</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={<ListChecks />} label="Total" value={stats.total} />
                  <StatCard icon={<Clock />} label="To Do" value={stats.todo} />
                  <StatCard icon={<Flame />} label="High Priority" value={stats.high} />
                  <StatCard icon={<CheckCircle2 />} label="Done" value={stats.done} />
                </div>
              </div>

              <div className="mb-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
                <ProductivityChart tasks={tasks} />
                <ActivityTimeline tasks={tasks} />
              </div>
            </>
          )}

          {(activePage === "dashboard" || activePage === "tasks") && (
            <>
              <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  >
                    <option value="ALL">All priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>

                  <button
                    onClick={() => setView("board")}
                    className={`rounded-2xl px-4 py-3 font-semibold ${
                      view === "board" ? "bg-slate-950 text-white" : "bg-slate-100"
                    }`}
                  >
                    <LayoutGrid className="mr-1 inline" size={18} />
                    Board
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`rounded-2xl px-4 py-3 font-semibold ${
                      view === "list" ? "bg-slate-950 text-white" : "bg-slate-100"
                    }`}
                  >
                    <ListChecks className="mr-1 inline" size={18} />
                    List
                  </button>

                  <button
                    onClick={openNewTask}
                    className="ml-auto rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white"
                  >
                    <Plus className="mr-1 inline" size={18} />
                    Add Task
                  </button>
                </div>
              </div>

              {isLoading ? (
                <EmptyState title="Loading your workspace..." />
              ) : filteredTasks.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Create your first task to make the dashboard come alive."
                  action={openNewTask}
                />
              ) : view === "board" ? (
                <KanbanBoard
                  tasks={filteredTasks}
                  onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                  onEdit={openEditTask}
                  onDelete={(id) => deleteTask.mutate(id)}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditTask}
                      onDelete={(id) => deleteTask.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activePage === "calendar" && <CalendarView tasks={tasks} />}
          {activePage === "team" && <TeamView />}
          {activePage === "analytics" && (
            <div className="grid gap-5 xl:grid-cols-2">
              <ProductivityChart tasks={tasks} />
              <ActivityTimeline tasks={tasks} />
            </div>
          )}
          {activePage === "settings" && <SettingsView user={user} />}
        </section>
      </main>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        loading={createOrUpdateTask.isPending}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={(data) => createOrUpdateTask.mutate(data)}
      />
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-blue-600">
          <Target size={36} />
        </div>

        <h3 className="text-2xl font-black">{title}</h3>

        {description && <p className="mx-auto mt-2 max-w-sm text-slate-500">{description}</p>}

        {action && (
          <button
            onClick={action}
            className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white"
          >
            Create first task
          </button>
        )}
      </div>
    </div>
  );
}