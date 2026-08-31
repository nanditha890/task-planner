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
     CONTEXT
  ===================================================== */

  const {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
    todayTasks,
    dueTasks,
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
     COMPLETION HANDLER
  ===================================================== */

  const [completingTaskIds, setCompletingTaskIds] =
    useState([]);

  const handleComplete = (taskId) => {
    if (completingTaskIds.includes(taskId)) {
      return;
    }

    setCompletingTaskIds((previous) => [
      ...previous,
      taskId,
    ]);

    setTimeout(() => {
      completeTask(taskId);

      setCompletingTaskIds((previous) =>
        previous.filter(
          (id) => id !== taskId
        )
      );
    }, 1000);
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
    <div className="space-y-6 text-slate-900 dark:text-slate-100 sm:space-y-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-blue-100
          bg-gradient-to-br
          from-blue-50
          via-white
          to-indigo-50
          p-5
          shadow-sm
          transition-colors
          duration-200
          dark:border-slate-700
          dark:from-slate-900
          dark:via-slate-900
          dark:to-blue-950/40
          dark:shadow-none
          sm:p-7
          lg:p-8
        "
      >
        {/* DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-48
            w-48
            rounded-full
            bg-blue-100/60
            blur-3xl
            dark:bg-blue-900/20
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            right-20
            h-40
            w-40
            rounded-full
            bg-indigo-100/60
            blur-3xl
            dark:bg-indigo-900/20
          "
        />

        <div
          className="
            relative
            flex
            flex-col
            justify-between
            gap-6
            sm:flex-row
            sm:items-center
          "
        >
          <div className="min-w-0">
            <p
              className="
                inline-flex
                rounded-full
                border
                border-blue-100
                bg-white/80
                px-3
                py-1.5
                text-xs
                font-medium
                text-blue-600
                shadow-sm
                dark:border-blue-900
                dark:bg-slate-800/80
                dark:text-blue-400
                dark:shadow-none
              "
            >
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

            <h1
              className="
                mt-4
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
                sm:text-3xl
                lg:text-4xl
              "
            >
              Good morning 👋
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
                sm:text-base
              "
            >
              Here's what you have planned for today.
              Stay focused and keep making progress.
            </p>
          </div>

          {/* ADD WORK */}

          <button
            type="button"
            onClick={handleAddButton}
            className="
              flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-5
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-200/70
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-xl
              active:translate-y-0
              dark:shadow-none
              sm:w-auto
            "
          >
            <Plus size={19} />

            Add Work
          </button>
        </div>
      </section>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-3
          sm:gap-4
          lg:gap-5
        "
      >
        {/* TODAY */}

        <div
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:border-blue-200
            hover:shadow-md
            dark:border-slate-700
            dark:bg-slate-900
            dark:hover:border-blue-700
            dark:shadow-none
            dark:hover:shadow-none
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Today's Tasks
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h2
                  className="
                    text-3xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {todayTasks.length}
                </h2>

                <span
                  className="
                    mb-1
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  scheduled
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-600
                transition
                group-hover:bg-blue-600
                group-hover:text-white
                dark:bg-blue-950/50
                dark:text-blue-400
                dark:group-hover:bg-blue-500
                dark:group-hover:text-white
                dark:shadow-none
              "
            >
              <Clock3 size={22} />
            </div>
          </div>
        </div>

        {/* COMPLETED */}

        <div
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:border-emerald-200
            hover:shadow-md
            dark:border-slate-700
            dark:bg-slate-900
            dark:hover:border-emerald-700
            dark:shadow-none
            dark:hover:shadow-none
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Completed
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h2
                  className="
                    text-3xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {completedCount}
                </h2>

                <span
                  className="
                    mb-1
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  finished
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
                transition
                group-hover:bg-emerald-500
                group-hover:text-white
                dark:bg-emerald-950/50
                dark:text-emerald-400
                dark:group-hover:bg-emerald-500
                dark:group-hover:text-white
              "
            >
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        {/* DUE */}

        <div
          className="
            group
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-1
            hover:border-orange-200
            hover:shadow-md
            dark:border-slate-700
            dark:bg-slate-900
            dark:hover:border-orange-700
            dark:shadow-none
            dark:hover:shadow-none
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Due Tasks
              </p>

              <div className="mt-2 flex items-end gap-2">
                <h2
                  className="
                    text-3xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {dueCount}
                </h2>

                <span
                  className="
                    mb-1
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  attention
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
                transition
                group-hover:bg-orange-500
                group-hover:text-white
                dark:bg-orange-950/50
                dark:text-orange-400
                dark:group-hover:bg-orange-500
                dark:group-hover:text-white
              "
            >
              <AlertCircle size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          TODAY'S WORK
      ================================================= */}

      <section
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          transition-colors
          duration-200
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-none
          sm:p-6
        "
      >
        <div
          className="
            mb-5
            flex
            flex-col
            gap-3
            border-b
            border-slate-100
            pb-4
            dark:border-slate-800
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              Today's Work
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Your scheduled work for today.
            </p>
          </div>

          <span
            className="
              w-fit
              rounded-full
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-semibold
              text-blue-600
              dark:bg-blue-950/50
              dark:text-blue-400
            "
          >
            {todayTasks.length}{" "}
            {todayTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {todayTasks.length > 0 ? (
          <div>
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleting={completingTaskIds.includes(
                  task.id
                )}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/70
              px-5
              py-10
              text-center
              dark:border-slate-700
              dark:bg-slate-800/50
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-blue-500
                dark:bg-blue-950/50
                dark:text-blue-400
                dark:group-hover:bg-blue-500
                dark:group-hover:text-white
                dark:shadow-none
              "
            >
              <Clock3 size={25} />
            </div>

            <h3
              className="
                mt-4
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Nothing planned yet
            </h3>

            <p
              className="
                mt-1
                max-w-sm
                text-sm
                leading-6
                text-slate-400
                dark:text-slate-500
              "
            >
              You don't have any tasks scheduled for today.
              Use the Add Work button above to create one.
            </p>
          </div>
        )}
      </section>

      {/* =================================================
          DUE WORK
      ================================================= */}

      {dueTasks.length > 0 && (
        <section
          className="
            rounded-3xl
            border
            border-orange-100
            bg-orange-50/30
            p-4
            shadow-sm
            transition-colors
            duration-200
            dark:border-orange-900/50
            dark:bg-orange-950/10
            dark:shadow-none
            sm:p-6
          "
        >
          <div
            className="
              mb-5
              flex
              flex-col
              gap-3
              border-b
              border-orange-100
              pb-4
              dark:border-orange-900/40
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    text-orange-600
                    dark:bg-orange-950/60
                    dark:text-orange-400
                  "
                >
                  <AlertCircle size={17} />
                </div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                    sm:text-xl
                  "
                >
                  Due Work
                </h2>
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Unfinished work carried forward from previous days.
              </p>
            </div>

            <span
              className="
                w-fit
                rounded-full
                bg-orange-100
                px-3
                py-1.5
                text-xs
                font-semibold
                text-orange-600
                dark:bg-orange-950/60
                dark:text-orange-400
              "
            >
              {dueTasks.length} due
            </span>
          </div>

          <div>
            {dueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleting={completingTaskIds.includes(
                  task.id
                )}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
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