import { useState } from "react";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

import TaskModal from "../components/TaskModal";

import {
  useTasks,
  getToday,
} from "../context/TaskContext";


function TasksPage() {
  // =====================================================
  // TASK CONTEXT
  // =====================================================

  const {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
  } = useTasks();
  // =====================================================
  // STATE
  // =====================================================

  const [filter, setFilter] = useState("all");

  const [completingTaskIds, setCompletingTaskIds] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

 const filteredTasks = tasks.filter((task) => {
  // ================= SEARCH =================

  const searchText = search.trim().toLowerCase();

  const taskTitle = String(
    task.title || ""
  ).toLowerCase();

  const taskDescription = String(
    task.description || ""
  ).toLowerCase();

  const matchesSearch =
    searchText === "" ||
    taskTitle.includes(searchText) ||
    taskDescription.includes(searchText);

  if (!matchesSearch) {
    return false;
  }

  // ================= FILTER =================

  if (filter === "all") {
    return true;
  }

  if (filter === "pending") {
    return (
      !task.completed &&
      task.date >= getToday()
    );
  }

  if (filter === "due") {
    return (
      (task.date < getToday() &&
        !task.completed) ||
      completingTaskIds.includes(task.id)
    );
  }

  if (filter === "completed") {
    return task.completed === true;
  }

  return true;
});

  // =====================================================
  // COUNTS
  // =====================================================

  const totalCount = tasks.length;

  const today = getToday();

const pendingCount = tasks.filter(
  (task) =>
    !task.completed &&
    task.date >= today
).length;

const dueCount = tasks.filter(
  (task) =>
    !task.completed &&
    task.date < today
).length;
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  // =====================================================
  // COMPLETE TASK
  // =====================================================

  const handleComplete = (id) => {
  // First show the completed animation
  setCompletingTaskIds((previous) => [
    ...previous,
    id,
  ]);

  // Mark task as completed
  completeTask(id);

  // Remove the animation state after the animation finishes
  setTimeout(() => {
    setCompletingTaskIds((previous) =>
      previous.filter(
        (taskId) => taskId !== id
      )
    );
  }, 500);
};

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }
  };

  // =====================================================
  // ADD TASK
  // =====================================================

  const handleAddTask = (newTask) => {
    addTask(newTask);

    setShowModal(false);
    setEditingTask(null);
  };

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleUpdateTask = (
    id,
    updatedData
  ) => {
    updateTask(id, updatedData);

    setShowModal(false);
    setEditingTask(null);
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddButton = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
  <div className="space-y-6 sm:space-y-8">

    {/* HEADER */}

    <div
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div>
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
dark:text-white
            sm:text-3xl
          "
        >
          Tasks
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Manage all your scheduled work in one place.
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddButton}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-700
          sm:w-auto
        "
      >
        <Plus size={19} />
        Add Work
      </button>
    </div>


    {/* SEARCH + FILTERS */}

    <section
      className="
        rounded-2xl
        border
        border-slate-200
bg-white
dark:border-slate-700
dark:bg-slate-900
        p-4
        shadow-sm
        sm:p-5
      "
    >
      {/* SEARCH */}

      <div className="relative">
        <Search
          size={19}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search tasks..."
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-4
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-400
            focus:bg-white
            focus:ring-4
            focus:ring-blue-50
            dark:border-slate-700
dark:bg-slate-800
dark:text-white
dark:placeholder:text-slate-500
dark:focus:border-blue-500
dark:focus:bg-slate-800
dark:focus:ring-blue-950
          "
        />
      </div>


      {/* FILTER BUTTONS */}

      <div
        className="
          mt-4
          flex
          gap-2
          overflow-x-auto
          pb-1
        "
      >
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }
          `}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "pending"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }
          `}
        >
          Pending
        </button>

        <button
          type="button"
          onClick={() => setFilter("due")}
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "due"
                ? "bg-orange-500 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }
          `}
        >
          Due
        </button>

        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "completed"
                ? "bg-green-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }
          `}
        >
          Completed
        </button>
      </div>
    </section>


    {/* SUMMARY CARDS */}

    <section
      className="
        grid
        grid-cols-2
        gap-3
        lg:grid-cols-4
        lg:gap-5
      "
    >
      {/* TOTAL */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
          dark:border-slate-700
dark:bg-slate-900
        "
      >
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
          Total
        </p>

        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {totalCount}
        </p>
      </div>

      {/* PENDING */}

      <div
        className="
          rounded-2xl
          border
          border-blue-100
          bg-blue-50/40
          p-4
          shadow-sm
          sm:p-5
          dark:border-blue-900/50
dark:bg-blue-950/20
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600 sm:text-3xl">
              {pendingCount}
            </p>
          </div>

          <Clock3
            size={20}
            className="text-blue-500"
          />
        </div>
      </div>

      {/* DUE */}

      <div
        className="
          rounded-2xl
          border
          border-orange-100
          bg-orange-50/40
          p-4
          shadow-sm
          sm:p-5
          dark:border-orange-900/50
dark:bg-orange-950/20
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              Due
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-500 sm:text-3xl">
              {dueCount}
            </p>
          </div>

          <AlertCircle
            size={20}
            className="text-orange-500"
          />
        </div>
      </div>

      {/* COMPLETED */}

      <div
        className="
          rounded-2xl
          border
          border-green-100
          bg-green-50/40
          p-4
          shadow-sm
          sm:p-5
          dark:border-green-900/50
dark:bg-green-950/20
        "
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
              Completed
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">
              {completedCount}
            </p>
          </div>

          <CheckCircle2
            size={20}
            className="text-green-500"
          />
        </div>
      </div>
    </section>


    {/* RESULT COUNT */}

    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {filteredTasks.length}
        </span>{" "}
        {filteredTasks.length === 1
          ? "task"
          : "tasks"}
      </p>
    </div>


    {/* TASK LIST */}

    <section className="space-y-3">

      {filteredTasks.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            dark:border-slate-700
            dark:bg-slate-900
            px-5
            py-10
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-50
              dark:bg-slate-800
            "
          >
            <CheckCircle2
              size={26}
              className="text-slate-300"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
            No tasks found
          </h2>

          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {search
              ? "Try searching with a different keyword."
              : "There are no tasks in this category."}
          </p>
        </div>

      ) : (

        filteredTasks.map((task) => {

          const isCompleting =
            completingTaskIds.includes(task.id);

          const visuallyCompleted =
            task.completed || isCompleting;

          return (
            <article
              key={task.id}
              className={`
                rounded-2xl
                border
                p-4
                shadow-sm
                transition-all
                duration-300
                sm:p-5

                ${
  visuallyCompleted
    ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30"
    : task.status === "due"
    ? "border-orange-200 bg-white dark:border-orange-900/60 dark:bg-slate-800"
    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
}
              `}
            >

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >

                {/* LEFT */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-start
                    gap-3
                    sm:gap-4
                  "
                >

                  {/* COMPLETE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleComplete(task.id)
                    }
                    disabled={task.completed}
                    className="mt-0.5 shrink-0"
                    aria-label={
                      task.completed
                        ? "Completed"
                        : "Complete task"
                    }
                  >
                    {visuallyCompleted ? (

                      <CheckCircle2
                        size={28}
                        className="text-green-500"
                      />

                    ) : (

                      <div
                        className="
                          h-7
                          w-7
                          rounded-full
                          border-2
                          border-slate-300
                          transition
                          dark:border-slate-600
                          dark:hover:border-blue-500
                          dark:hover:bg-blue-950/40
                          hover:border-blue-500
                          hover:bg-blue-50
                        "
                      />

                    )}
                  </button>


                  {/* INFORMATION */}

                  <div className="min-w-0 flex-1">

                    <h3
                      className={`
                        break-words
                        text-base
                        font-semibold
                        leading-6
                        sm:text-lg

                        ${
                          visuallyCompleted
                            ? "text-slate-400 line-through dark:text-slate-500"
                            : "text-slate-900 dark:text-slate-100"
                        }
                      `}
                    >
                      {task.title}
                    </h3>


                    {task.description && (
                      <p
                        className={`
                          mt-1
                          break-words
                          text-sm
                          leading-6

                          ${
                            visuallyCompleted
                              ? "text-slate-400 dark:text-slate-500"
                              : "text-slate-500 dark:text-slate-400"
                          }
                        `}
                      >
                        {task.description}
                      </p>
                    )}


                    {/* DATE + TIME */}

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        gap-x-4
                        gap-y-2
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {task.time || "No time set"}
                      </span>

                      <span>
                        {task.date}
                      </span>
                    </div>

                  </div>
                </div>


                {/* STATUS + ACTIONS */}

                <div
                  className="
                    flex
                    w-full
                    flex-wrap
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    dark:border-slate-700
                    pt-3
                    sm:w-auto
                    sm:shrink-0
                    sm:border-0
                    sm:pt-0
                  "
                >

                  {/* STATUS */}

                  {visuallyCompleted ? (

                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-green-600
                        dark:bg-green-950/50
                        dark:text-green-400
                      "
                    >
                      <CheckCircle2 size={14} />
                      COMPLETED
                    </span>

                  ) : task.status === "due" ? (

                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-orange-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-orange-600
                        dark:bg-orange-950/50
                        dark:text-orange-400
                      "
                    >
                      <AlertCircle size={14} />
                      DUE
                    </span>

                  ) : (

                    <span
                      className="
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-blue-600
                        dark:bg-blue-950/50
                        dark:text-blue-400
                      "
                    >
                      PENDING
                    </span>

                  )}


                  {/* ACTIONS */}

                  {!task.completed && (
                    <div className="ml-auto flex items-center gap-2 sm:ml-0">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(task)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition
                          hover:border-blue-200
                          hover:bg-blue-50
                          hover:text-blue-600
                          dark:border-slate-700
                          dark:text-slate-400
                          dark:hover:border-blue-800
                          dark:hover:bg-blue-950/40
                          dark:hover:text-blue-400
                        "
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(task.id)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-200
                          text-slate-500
                          transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                          dark:border-slate-700
                          dark:text-slate-400
                          dark:hover:border-red-900
                          dark:hover:bg-red-950/40
                          dark:hover:text-red-400
                        "
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </article>
          );
        })

      )}

    </section>


    {/* MODAL */}

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

export default TasksPage;