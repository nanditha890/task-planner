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
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="mt-1 text-gray-500">
          Track your productivity and task progress.
        </p>
      </div>


      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Tasks
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalTasks}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ListTodo size={24} />
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

              <p className="mt-2 text-3xl font-bold text-green-600">
                {completedTasks}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {pendingTasks}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Clock3 size={24} />
            </div>

          </div>

        </div>


        {/* DUE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Due
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {dueTasks}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <AlertCircle size={24} />
            </div>

          </div>

        </div>

      </div>


      {/* COMPLETION RATE */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <TrendingUp size={24} />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Completion Rate
            </h2>

            <p className="text-sm text-gray-500">
              Your overall task completion progress.
            </p>

          </div>

        </div>


        {/* PROGRESS */}

        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">

            <span className="text-gray-500">
              Progress
            </span>

            <span className="font-semibold text-gray-900">
              {completionPercentage}%
            </span>

          </div>


          <div className="h-4 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>

        </div>

      </div>


      {/* PRODUCTIVITY MESSAGE */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

        <h2 className="text-lg font-semibold text-blue-900">
          Productivity Overview
        </h2>

        <p className="mt-2 text-sm text-blue-700">

          {totalTasks === 0
            ? "Start adding tasks to see your productivity analytics."
            : completionPercentage >= 80
            ? "Excellent work! You're completing most of your tasks."
            : completionPercentage >= 50
            ? "Good progress! Keep working towards completing your tasks."
            : "You have some pending work. Stay focused and keep going!"}

        </p>

      </div>

    </div>
  );
}

export default AnalyticsPage;