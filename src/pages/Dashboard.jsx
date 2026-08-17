import { useState } from "react";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  Plus,
} from "lucide-react";

import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

import { useTasks } from "../context/TaskContext";

function Dashboard() {
  /* =====================================================
     MODAL
  ===================================================== */

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  /* =====================================================
     COMPLETION ANIMATION

     Keeps the completed task visible temporarily.
  ===================================================== */

  const [completingTaskIds, setCompletingTaskIds] = useState([]);

  /* =====================================================
     CONTEXT
  ===================================================== */

  const {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
    todayTasks: contextTodayTasks,
    dueTasks: contextDueTasks,
    completedCount,
    dueCount,
  } = useTasks();

  /* =====================================================
     TODAY
  ===================================================== */

  const todayDate = new Date();

  const today =
    todayDate.getFullYear() +
    "-" +
    String(todayDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(todayDate.getDate()).padStart(2, "0");

  /* =====================================================
     TODAY'S WORK

     Normally completed tasks are removed.

     But while animation is running, keep them visible.
  ===================================================== */

  const todayTasks = tasks.filter((task) => {
    // Must be today's task
    if (task.date !== today) {
      return false;
    }

    // Due tasks belong in Due Work
    if (task.status === "due") {
      return false;
    }

    // Completed task stays visible during animation
    if (task.completed) {
      return completingTaskIds.includes(task.id);
    }

    return true;
  });

  /* =====================================================
     DUE WORK

     Normally completed due tasks disappear.

     But while animation is running, keep them visible.
  ===================================================== */

  const dueTasks = tasks.filter((task) => {
    // Due task must be from previous day
    if (task.date >= today) {
      return false;
    }

    // Only unfinished OR currently animating
    if (
      task.completed &&
      !completingTaskIds.includes(task.id)
    ) {
      return false;
    }

    // Make sure it is actually due
    if (
      task.status !== "due" &&
      !completingTaskIds.includes(task.id)
    ) {
      return false;
    }

    return true;
  });

  /* =====================================================
     COMPLETION HANDLER
  ===================================================== */

  const handleComplete = (taskId) => {
    // Add task to temporary animation list
    setCompletingTaskIds((previous) => {
      if (previous.includes(taskId)) {
        return previous;
      }

      return [...previous, taskId];
    });

    // Mark completed immediately
    completeTask(taskId);

    // Keep visible for 1.5 seconds
    setTimeout(() => {
      setCompletingTaskIds((previous) =>
        previous.filter(
          (id) => id !== taskId
        )
      );
    }, 1500);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }
  };

  /* =====================================================
     ADD
  ===================================================== */

  const handleAddTask = (newTask) => {
    addTask(newTask);

    setShowModal(false);
    setEditingTask(null);
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdateTask = (
    id,
    updatedData
  ) => {
    updateTask(id, updatedData);

    setShowModal(false);
    setEditingTask(null);
  };

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const handleAddButton = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Good morning 👋
          </h1>

          <p className="mt-1 text-gray-500">
            Here's what you have planned for today.
          </p>

        </div>

        <button
          type="button"
          onClick={handleAddButton}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            shadow-sm
            hover:bg-blue-700
          "
        >
          <Plus size={20} />
          Add Work
        </button>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* TODAY */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Today's Tasks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {todayTasks.filter(
                  (task) => !task.completed
                ).length}
              </h2>

            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Clock3 size={24} />
            </div>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {completedCount}
              </h2>

            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>

          </div>

        </div>


        {/* DUE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Due Tasks
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {dueCount}
              </h2>

            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <AlertCircle size={24} />
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          TODAY'S WORK
      ================================================= */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Today's Work
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your scheduled work for today.
            </p>

          </div>

          <span className="text-sm text-gray-500">
            {
              todayTasks.filter(
                (task) => !task.completed
              ).length
            } tasks
          </span>

        </div>


        {todayTasks.length > 0 ? (

          <div className="space-y-4">

            {todayTasks.map((task) => (

              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            ))}

          </div>

        ) : (

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">

            <p className="text-gray-500">
              No tasks planned for today.
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Click "Add Work" to schedule something.
            </p>

          </div>

        )}

      </div>


      {/* =================================================
          DUE WORK
      ================================================= */}

      {dueTasks.length > 0 && (

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Due Work
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Unfinished work carried forward from previous days.
              </p>

            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
              {
                dueTasks.filter(
                  (task) => !task.completed
                ).length
              } due
            </span>

          </div>


          <div className="space-y-4">

            {dueTasks.map((task) => (

              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            ))}

          </div>

        </div>

      )}


      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && (

        <TaskModal
          onClose={handleCloseModal}
          editingTask={editingTask}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
        />

      )}

    </div>
  );
}

export default Dashboard;