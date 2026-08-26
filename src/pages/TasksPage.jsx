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
    // SEARCH
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(searchText) ||
      task.description
        ?.toLowerCase()
        .includes(searchText);

    if (!matchesSearch) {
      return false;
    }

    // ALL
    if (filter === "all") {
      return true;
    }

    // PENDING
    if (filter === "pending") {
  return (
    !task.completed &&
    task.date >= getToday()
  );
}

    // DUE
   if (filter === "due") {
  return (
    (task.date < getToday() &&
      !task.completed) ||
    completingTaskIds.includes(task.id)
  );
}
    // COMPLETED
    if (filter === "completed") {
      return task.completed;
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
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="mt-1 text-gray-500">
            Manage all your scheduled work in one place.
          </p>

        </div>

        {/* ADD WORK */}

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
            transition
            hover:bg-blue-700
          "
        >

          <Plus size={20} />

          Add Work

        </button>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="relative">

        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
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
            border-gray-200
            bg-white
            py-3
            pl-12
            pr-4
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>


      {/* =================================================
          FILTER BUTTONS
      ================================================= */}

      <div className="flex flex-wrap gap-3">

        {/* ALL */}

        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          All
        </button>


        {/* PENDING */}

        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          Pending
        </button>


        {/* DUE */}

        <button
          type="button"
          onClick={() => setFilter("due")}
          className={`
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "due"
                ? "bg-orange-500 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          Due
        </button>


        {/* COMPLETED */}

        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`
            rounded-xl
            px-4
            py-2
            text-sm
            font-medium
            transition

            ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          Completed
        </button>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

        {/* TOTAL */}

        <div className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
        ">

          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalCount}
          </p>

        </div>


        {/* PENDING */}

        <div className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
        ">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {pendingCount}
          </p>

        </div>


        {/* DUE */}

        <div className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
        ">

          <p className="text-sm text-gray-500">
            Due
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-500">
            {dueCount}
          </p>

        </div>


        {/* COMPLETED */}

        <div className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
        ">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedCount}
          </p>

        </div>

      </div>


      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <div className="text-sm text-gray-500">

        Showing{" "}
        <span className="font-medium text-gray-700">
          {filteredTasks.length}
        </span>{" "}
        {filteredTasks.length === 1
          ? "task"
          : "tasks"}

      </div>


      {/* =================================================
          TASK LIST
      ================================================= */}

      <div className="space-y-4">

        {filteredTasks.length === 0 ? (

          <div className="
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-white
            p-10
            text-center
          ">

            <CheckCircle2
              size={42}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              No tasks found
            </h2>

            <p className="mt-1 text-sm text-gray-400">

              {search
                ? "Try searching with a different keyword."
                : "There are no tasks in this category."}

            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              key={task.id}
              className={`
                rounded-2xl
                transition-all
                duration-300

                ${
                  task.completed
                    ? "border-green-200 bg-green-50/30"
                    : task.status === "due"
                    ? "border-orange-200"
                    : "border-gray-200"
                }
              `}
            >

              {/* =================================================
                  TASK CARD
              ================================================= */}

              <div className="relative">

                <div
                  className="
                    rounded-2xl
                    border
                    border-transparent
                  "
                >

                  {/* TASK CARD CONTENT */}

                  <div className="p-0">

                    <div className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      p-5
                    ">

                      {/* LEFT */}

                      <div className="
                        flex
                        min-w-0
                        items-start
                        gap-4
                      ">

                        {/* CHECK BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleComplete(task.id)
                          }
                          disabled={task.completed}
                          className="
                            mt-1
                            shrink-0
                          "
                          aria-label={
                            task.completed
                              ? "Completed"
                              : "Complete task"
                          }
                        >

                          {task.completed ? (

                            <CheckCircle2
                              size={28}
                              className="text-green-500"
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                border-gray-300
                                transition
                                hover:border-blue-500
                                hover:bg-blue-50
                              "
                            />

                          )}

                        </button>


                        {/* INFORMATION */}

                        <div className="min-w-0">

                          <h3
                            className={`
                              text-lg
                              font-semibold

                              ${
                                task.completed
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                              }
                            `}
                          >
                            {task.title}
                          </h3>


                          {task.description && (

                            <p
                              className={`
                                mt-1
                                text-sm

                                ${
                                  task.completed
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              `}
                            >
                              {task.description}
                            </p>

                          )}


                          {/* DATE + TIME */}

                          <div className="
                            mt-3
                            flex
                            flex-wrap
                            gap-4
                            text-xs
                            text-gray-500
                          ">

                            <span className="
                              flex
                              items-center
                              gap-1
                            ">

                              <Clock3 size={14} />

                              {task.time ||
                                "No time set"}

                            </span>


                            <span>
                              {task.date}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                      ">

                        {/* STATUS */}

                        {task.completed ? (

                          <span className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-green-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-green-600
                          ">

                            <CheckCircle2
                              size={14}
                            />

                            COMPLETED

                          </span>

                        ) : task.status === "due" ? (

                          <span className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-orange-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-orange-600
                          ">

                            <AlertCircle
                              size={14}
                            />

                            DUE

                          </span>

                        ) : (

                          <span className="
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-600
                          ">

                            PENDING

                          </span>

                        )}


                        {/* EDIT */}

                        {!task.completed && (

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(task)
                            }
                            className="
                              rounded-lg
                              p-2
                              text-gray-500
                              transition
                              hover:bg-blue-50
                              hover:text-blue-600
                            "
                            title="Edit task"
                          >

                            <Pencil size={17} />

                          </button>

                        )}


                        {/* DELETE */}

                        {!task.completed && (

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(task.id)
                            }
                            className="
                              rounded-lg
                              p-2
                              text-gray-500
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                            "
                            title="Delete task"
                          >

                            <Trash2 size={17} />

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>


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

export default TasksPage;