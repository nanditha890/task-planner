import { useState } from "react";
import { CheckCircle2, Circle, Clock3, AlertCircle, Pencil, Trash2 } from "lucide-react";

import TaskModal from "../components/TaskModal";
import { useTasks } from "../context/TaskContext";

function TasksPage() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    updateTask,
  } = useTasks();

  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed && task.status !== "due";
    }

    if (filter === "due") {
      return task.status === "due" && !task.completed;
    }

    return true;
  });

  // Delete task
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // Save edited task
  const handleUpdate = (updatedTask) => {
    updateTask(editingTask.id, updatedTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="mt-1 text-gray-500">
          Manage all your scheduled work in one place.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("due")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "due"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Due
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Completed
        </button>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {tasks.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {
              tasks.filter(
                (task) =>
                  !task.completed &&
                  task.status !== "due"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Due
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-500">
            {
              tasks.filter(
                (task) =>
                  task.status === "due" &&
                  !task.completed
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              tasks.filter(
                (task) => task.completed
              ).length
            }
          </p>
        </div>

      </div>

      {/* TASK LIST */}
      <div className="space-y-4">

        {filteredTasks.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

            <CheckCircle2
              size={42}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              No tasks found
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              There are no tasks in this category.
            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              key={task.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                task.completed
                  ? "border-green-200 bg-green-50/30"
                  : task.status === "due"
                  ? "border-orange-200"
                  : "border-gray-200"
              }`}
            >

              <div className="flex items-start justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-start gap-4">

                  {/* CHECKBOX */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1 shrink-0"
                  >
                    {task.completed ? (

                      <CheckCircle2
                        size={28}
                        className="text-green-500"
                      />

                    ) : (

                      <Circle
                        size={28}
                        className="text-gray-300 hover:text-blue-500"
                      />

                    )}
                  </button>

                  {/* INFORMATION */}
                  <div>

                    <h3
                      className={`text-lg font-semibold ${
                        task.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                      <span className="flex items-center gap-1">
                        <Clock3 size={14} />
                        {task.time}
                      </span>

                      <span>
                        {task.date}
                      </span>

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">

                  {/* STATUS */}
                  {task.status === "due" &&
                    !task.completed && (

                    <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">

                      <AlertCircle size={14} />

                      DUE

                    </span>
                  )}

                  {task.completed && (

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      COMPLETED
                    </span>

                  )}

                  {/* EDIT */}
                  <button
                    onClick={() => handleEdit(task)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit"
                  >
                    <Pencil size={17} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

      {/* EDIT MODAL */}

      {editingTask && (
        <TaskModal
          task={editingTask}
          isEditing={true}
          onClose={() => setEditingTask(null)}
          onAddTask={handleUpdate}
        />
      )}

    </div>
  );
}

export default TasksPage;