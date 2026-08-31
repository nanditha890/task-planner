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
  <div className="space-y-6 sm:space-y-8">

    {/* HEADER */}

    <div>
      <h1
        className="
          text-2xl
          font-bold
          tracking-tight
          text-slate-900
          sm:text-3xl
        "
      >
        History
      </h1>

      <p className="mt-1 text-sm text-slate-500 sm:text-base">
        View your completed tasks.
      </p>
    </div>


    {/* SUMMARY */}

    <section
      className="
        rounded-2xl
        border
        border-green-100
        bg-green-50/40
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div className="flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Completed Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedTasks.length}
          </p>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-green-100
            text-green-600
          "
        >
          <CheckCircle2 size={24} />
        </div>

      </div>
    </section>


    {/* HISTORY LIST */}

    <section className="space-y-3 sm:space-y-4">

      {completedTasks.length === 0 ? (

        /* EMPTY STATE */

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
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
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-slate-50
            "
          >
            <CheckCircle2
              size={30}
              className="text-slate-300"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-700">
            No completed tasks
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Completed tasks will appear here.
          </p>
        </div>

      ) : (

        completedTasks
          .slice()
          .reverse()
          .map((task) => (

            <article
              key={task.id}
              className="
                rounded-2xl
                border
                border-green-100
                bg-white
                p-4
                shadow-sm
                transition
                hover:shadow-md
                sm:p-5
              "
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

                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">

                  {/* CHECK ICON */}

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-green-500
                      text-white
                      shadow-sm
                    "
                  >
                    <CheckCircle2 size={20} />
                  </div>


                  {/* TASK INFORMATION */}

                  <div className="min-w-0 flex-1">

                    <div
                      className="
                        flex
                        flex-wrap
                        items-start
                        justify-between
                        gap-2
                      "
                    >
                      <h3
                        className="
                          break-words
                          font-semibold
                          text-slate-900
                        "
                      >
                        {task.title}
                      </h3>

                      <span
                        className="
                          rounded-full
                          bg-green-50
                          px-3
                          py-1
                          text-[11px]
                          font-semibold
                          text-green-600
                          sm:hidden
                        "
                      >
                        COMPLETED
                      </span>
                    </div>


                    {/* DESCRIPTION */}

                    {task.description && (
                      <p
                        className="
                          mt-1
                          break-words
                          text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {task.description}
                      </p>
                    )}


                    {/* ORIGINAL DATE + TIME */}

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
                      "
                    >
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {formatDate(task.date)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={14} />
                        {task.time || "No time set"}
                      </span>
                    </div>


                    {/* COMPLETED BY */}

                    <div
                      className="
                        mt-3
                        flex
                        items-start
                        gap-1.5
                        text-xs
                        text-slate-500
                      "
                    >
                      <User
                        size={14}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        Completed by{" "}
                        <span className="font-medium text-slate-700">
                          {getCompletedByName(task)}
                        </span>
                      </span>
                    </div>


                    {/* MOBILE COMPLETED DATE */}

                    <div
                      className="
                        mt-3
                        rounded-xl
                        bg-slate-50
                        px-3
                        py-2
                        sm:hidden
                      "
                    >
                      <p className="text-[11px] text-slate-400">
                        Completed on
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-slate-600">
                        {formatCompletedAt(task.completedAt)}
                      </p>
                    </div>

                  </div>
                </div>


                {/* RIGHT - DESKTOP */}

                <div
                  className="
                    hidden
                    shrink-0
                    text-right
                    sm:block
                  "
                >
                  <span
                    className="
                      inline-flex
                      rounded-full
                      bg-green-50
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-green-600
                    "
                  >
                    COMPLETED
                  </span>

                  <p className="mt-3 text-xs text-slate-400">
                    Completed on
                  </p>

                  <p
                    className="
                      mt-0.5
                      max-w-[170px]
                      text-xs
                      font-medium
                      leading-5
                      text-slate-600
                    "
                  >
                    {formatCompletedAt(task.completedAt)}
                  </p>
                </div>

              </div>
            </article>

          ))

      )}

    </section>

  </div>
);
}

export default HistoryPage;