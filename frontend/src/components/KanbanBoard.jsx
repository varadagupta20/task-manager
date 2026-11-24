import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

const columns = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

function DraggableTask({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} dragProps={{ ...listeners, ...attributes }} />
    </div>
  );
}

function Column({ column, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[460px] rounded-[2rem] border p-4 transition ${
        isOver
          ? "border-blue-400 bg-blue-50"
          : "border-slate-200 bg-slate-100/70"
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="font-black">{column.title}</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

export default function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = useMemo(() => {
    return Object.fromEntries(
      columns.map((column) => [column.id, tasks.filter((task) => task.status === column.id)])
    );
  }, [tasks]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => setActiveTask(event.active.data.current?.task)}
      onDragEnd={(event) => {
        const newStatus = event.over?.id;

        if (newStatus && activeTask && newStatus !== activeTask.status) {
          onStatusChange(activeTask.id, newStatus);
        }

        setActiveTask(null);
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={grouped[column.id]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
}