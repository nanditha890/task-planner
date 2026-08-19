import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  User,
} from "lucide-react";

import { useTasks } from "../context/TaskContext";

function HistoryPage() {
  const { completedTasks } = useTasks();

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT COMPLETION TIME
  // =====================================================

  const formatCompletedAt = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // GET COMPLETED BY NAME
  // =====================================================

  const getCompletedByName = (task) => {
    return (
      task.completedByName ||
      "Unknown User"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          History
        </h1>

        <p className="mt-1 text-gray-500">
          View your completed tasks.
        </p>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <p className="text-sm text-gray-500">
          Completed Tasks
        </p>

        <p className="mt-2 text-3xl font-bold text-green-600">
          {completedTasks.length}
        </p>

      </div>

      {/* =================================================
          HISTORY LIST
      ================================================= */}

      <div className="space-y-4">

        {completedTasks.length === 0 ? (

          /* EMPTY STATE */

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

            <CheckCircle2
              size={48}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              No completed tasks
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Completed tasks will appear here.
            </p>

          </div>

        ) : (

          /* COMPLETED TASKS */

          completedTasks
            .slice()
            .reverse()
            .map((task) => (

              <div
                key={task.id}
                className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  {/* LEFT */}

                  <div className="flex min-w-0 items-start gap-4">

                    {/* CHECK ICON */}

                    <div className="shrink-0 rounded-full bg-green-500 p-2 text-white">

                      <CheckCircle2 size={20} />

                    </div>

                    {/* TASK INFORMATION */}

                    <div className="min-w-0">

                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>

                      {/* DESCRIPTION */}

                      {task.description && (

                        <p className="mt-1 text-sm text-gray-500">
                          {task.description}
                        </p>

                      )}

                      {/* ORIGINAL DATE + TIME */}

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">

                        <span className="flex items-center gap-1">

                          <CalendarDays size={14} />

                          {formatDate(task.date)}

                        </span>

                        <span className="flex items-center gap-1">

                          <Clock3 size={14} />

                          {task.time || "No time set"}

                        </span>

                      </div>

                      {/* =================================
                          COMPLETED BY
                      ================================= */}

                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">

                        <User size={14} />

                        <span>
                          Completed by{" "}
                          <span className="font-medium text-gray-700">
                            {getCompletedByName(task)}
                          </span>
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="shrink-0 text-right">

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      COMPLETED
                    </span>

                    <p className="mt-2 text-xs text-gray-400">
                      Completed on
                    </p>

                    <p className="text-xs font-medium text-gray-500">
                      {formatCompletedAt(
                        task.completedAt
                      )}
                    </p>

                  </div>

                </div>

              </div>

            ))

        )}

      </div>

    </div>
  );
}

export default HistoryPage;