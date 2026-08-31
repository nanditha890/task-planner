import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import { useTasks } from "../context/TaskContext";

function AnalyticsPage() {
  const { tasks } = useTasks();

  // =====================================================
  // COUNTS
  // =====================================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed === true
  ).length;

  const dueTasks = tasks.filter(
    (task) =>
      task.status === "due" &&
      !task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.status !== "due"
  ).length;

  // =====================================================
  // COMPLETION %
  // =====================================================

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER */}

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
          Analytics
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
            sm:text-base
          "
        >
          Track your productivity and task progress.
        </p>
      </div>

      {/* STATISTICS */}

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
            transition-colors
            dark:border-slate-700
            dark:bg-slate-900
            sm:p-5
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  sm:text-sm
                "
              >
                Total Tasks
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-white
                  sm:text-3xl
                "
              >
                {totalTasks}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
                dark:bg-blue-950/50
                dark:text-blue-400
                sm:h-12
                sm:w-12
              "
            >
              <ListTodo size={22} />
            </div>
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
            transition-colors
            dark:border-green-900/50
            dark:bg-green-950/20
            sm:p-5
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  sm:text-sm
                "
              >
                Completed
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-green-600
                  dark:text-green-400
                  sm:text-3xl
                "
              >
                {completedTasks}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-green-100
                text-green-600
                dark:bg-green-950/60
                dark:text-green-400
                sm:h-12
                sm:w-12
              "
            >
              <CheckCircle2 size={22} />
            </div>
          </div>
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
            transition-colors
            dark:border-blue-900/50
            dark:bg-blue-950/20
            sm:p-5
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  sm:text-sm
                "
              >
                Pending
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-blue-600
                  dark:text-blue-400
                  sm:text-3xl
                "
              >
                {pendingTasks}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-100
                text-blue-600
                dark:bg-blue-950/60
                dark:text-blue-400
                sm:h-12
                sm:w-12
              "
            >
              <Clock3 size={22} />
            </div>
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
            transition-colors
            dark:border-orange-900/50
            dark:bg-orange-950/20
            sm:p-5
          "
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                  sm:text-sm
                "
              >
                Due
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-orange-500
                  dark:text-orange-400
                  sm:text-3xl
                "
              >
                {dueTasks}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-orange-100
                text-orange-600
                dark:bg-orange-950/60
                dark:text-orange-400
                sm:h-12
                sm:w-12
              "
            >
              <AlertCircle size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETION RATE */}

      <section
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          transition-colors
          dark:border-slate-700
          dark:bg-slate-900
          sm:p-6
        "
      >
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
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-green-50
                text-green-600
                dark:bg-green-950/50
                dark:text-green-400
              "
            >
              <TrendingUp size={23} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                Completion Rate
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Your overall task completion progress.
              </p>
            </div>
          </div>

          {/* BIG PERCENTAGE */}

          <div className="sm:text-right">
            <p
              className="
                text-3xl
                font-bold
                tracking-tight
                text-green-600
                dark:text-green-400
                sm:text-4xl
              "
            >
              {completionPercentage}%
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
                dark:text-slate-500
              "
            >
              Overall progress
            </p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span
              className="
                font-medium
                text-slate-500
                dark:text-slate-400
              "
            >
              Progress
            </span>

            <span
              className="
                font-semibold
                text-slate-900
                dark:text-slate-200
              "
            >
              {completedTasks} of {totalTasks} completed
            </span>
          </div>

          <div
            className="
              h-3
              overflow-hidden
              rounded-full
              bg-slate-100
              dark:bg-slate-800
              sm:h-4
            "
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={completionPercentage}
            aria-label="Task completion progress"
          >
            <div
              className="
                h-full
                rounded-full
                bg-green-500
                transition-all
                duration-500
              "
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* PRODUCTIVITY OVERVIEW */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-blue-100
          bg-gradient-to-br
          from-blue-50
          to-indigo-50
          p-5
          transition-colors
          dark:border-blue-900/50
          dark:from-blue-950/30
          dark:to-indigo-950/20
          sm:p-6
        "
      >
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
          <div className="max-w-2xl">
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/70
                px-3
                py-1.5
                text-xs
                font-semibold
                text-blue-600
                dark:bg-slate-900/60
                dark:text-blue-400
              "
            >
              <TrendingUp size={14} />
              PRODUCTIVITY
            </div>

            <h2
              className="
                text-lg
                font-semibold
                text-blue-950
                dark:text-blue-100
              "
            >
              Productivity Overview
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-blue-700
                dark:text-blue-300
              "
            >
              {totalTasks === 0
                ? "Start adding tasks to see your productivity analytics."
                : completionPercentage >= 80
                ? "Excellent work! You're completing most of your tasks."
                : completionPercentage >= 50
                ? "Good progress! Keep working towards completing your tasks."
                : "You have some pending work. Stay focused and keep going!"}
            </p>
          </div>

          {totalTasks > 0 && (
            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-full
                border-8
                border-white/70
                bg-blue-600
                text-lg
                font-bold
                text-white
                shadow-sm
                dark:border-slate-800/80
                dark:shadow-none
              "
            >
              {completionPercentage}%
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;