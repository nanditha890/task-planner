import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

import { useTasks } from "../context/TaskContext";
import TaskModal from "../components/TaskModal";

function CalendarPage() {
  const { tasks, addTask } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  function getDateString(day) {
    const monthNumber = String(month + 1).padStart(2, "0");

    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  function getTasksForDay(day) {
    if (!day) {
      return [];
    }

    const dateString = getDateString(day);

    return tasks.filter(
      (task) => task.date === dateString
    );
  }

  function isToday(day) {
    if (!day) {
      return false;
    }

    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function handleDateClick(day) {
    if (!day) {
      return;
    }

    const dateString = getDateString(day);

    setSelectedDate(dateString);

    setShowModal(true);
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

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
              text-slate-900
              dark:text-white
              sm:text-3xl
            "
          >
            Calendar
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
            View and manage your scheduled work.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedDate(null);
            setShowModal(true);
          }}
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
            dark:shadow-none
            sm:w-auto
          "
        >
          <Plus size={18} />

          Add Work
        </button>
      </div>

      {/* ================= CALENDAR CARD ================= */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-colors
          duration-200
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        {/* ================= CALENDAR HEADER ================= */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-slate-200
            p-4
            dark:border-slate-700
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:p-5
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
              dark:text-white
              sm:text-xl
            "
          >
            {monthName}
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="
                rounded-lg
                border
                border-slate-200
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              Today
            </button>

            <button
              type="button"
              onClick={goToPreviousMonth}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                text-slate-600
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                text-slate-600
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE VIEW
        ================================================= */}

        <div className="block p-4 md:hidden">
          <div className="space-y-3">
            {calendarDays
              .filter((day) => day !== null)
              .map((day) => {
                const dayTasks = getTasksForDay(day);

                const fullDate = new Date(
                  year,
                  month,
                  day
                ).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      handleDateClick(day)
                    }
                    className={`
                      w-full
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition

                      ${
                        isToday(day)
                          ? `
                            border-blue-200
                            bg-blue-50/60
                            dark:border-blue-800
                            dark:bg-blue-950/30
                          `
                          : `
                            border-slate-200
                            bg-white
                            hover:bg-slate-50
                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:hover:bg-slate-700
                          `
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              text-sm
                              font-bold

                              ${
                                isToday(day)
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                              }
                            `}
                          >
                            {day}
                          </span>

                          <div>
                            <p
                              className="
                                text-sm
                                font-semibold
                                text-slate-800
                                dark:text-slate-100
                              "
                            >
                              {fullDate}
                            </p>

                            <p
                              className="
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                              "
                            >
                              {dayTasks.length}{" "}
                              {dayTasks.length === 1
                                ? "task"
                                : "tasks"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isToday(day) && (
                        <span
                          className="
                            rounded-full
                            bg-blue-100
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-blue-600
                            dark:bg-blue-950
                            dark:text-blue-400
                          "
                        >
                          TODAY
                        </span>
                      )}
                    </div>

                    {dayTasks.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            className={`
                              rounded-xl
                              px-3
                              py-2
                              text-xs

                              ${
                                task.completed
                                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : task.status === "due"
                                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                                  : task.priority === "High"
                                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                  : task.priority === "Medium"
                                  ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                              }
                            `}
                          >
                            <div className="font-medium">
                              {task.completed && "✓ "}

                              {task.status === "due" &&
                                !task.completed &&
                                "DUE: "}

                              {task.title}
                            </div>

                            {task.time &&
                              task.time !== "No time set" && (
                                <div className="mt-0.5 opacity-70">
                                  {task.time}
                                </div>
                              )}
                          </div>
                        ))}

                        {dayTasks.length > 3 && (
                          <p
                            className="
                              text-xs
                              font-medium
                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            +{dayTasks.length - 3} more
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* =================================================
            DESKTOP / TABLET CALENDAR
        ================================================= */}

        <div className="hidden md:block">
          {/* WEEK DAYS */}

          <div
            className="
              grid
              grid-cols-7
              border-b
              border-slate-200
              bg-slate-50
              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="
                  p-3
                  text-center
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {day}
              </div>
            ))}
          </div>

          {/* CALENDAR DAYS */}

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDay(day);

              return (
                <div
                  key={index}
                  onClick={() =>
                    handleDateClick(day)
                  }
                  className={`
                    min-h-[130px]
                    border-b
                    border-r
                    border-slate-100
                    p-2
                    transition
                    dark:border-slate-800

                    ${
                      day
                        ? `
                          cursor-pointer
                          hover:bg-blue-50/50
                          dark:hover:bg-slate-800
                        `
                        : `
                          bg-slate-50/30
                          dark:bg-slate-950/20
                        `
                    }

                    ${
                      isToday(day)
                        ? "bg-blue-50/20 dark:bg-blue-950/10"
                        : ""
                    }
                  `}
                >
                  {day && (
                    <>
                      {/* DATE */}

                      <div className="mb-2 flex justify-end">
                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            text-sm
                            font-medium

                            ${
                              isToday(day)
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-700 dark:text-slate-300"
                            }
                          `}
                        >
                          {day}
                        </span>
                      </div>

                      {/* TASKS */}

                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className={`
                              rounded-lg
                              px-2
                              py-1.5
                              text-xs

                              ${
                                task.completed
                                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : task.status === "due"
                                  ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                                  : task.priority === "High"
                                  ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                  : task.priority === "Medium"
                                  ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                              }
                            `}
                          >
                            <div className="truncate font-medium">
                              {task.completed && "✓ "}

                              {task.status === "due" &&
                                !task.completed &&
                                "DUE: "}

                              {task.title}
                            </div>

                            {task.time &&
                              task.time !== "No time set" && (
                                <div className="mt-0.5 opacity-70">
                                  {task.time}
                                </div>
                              )}
                          </div>
                        ))}

                        {dayTasks.length > 3 && (
                          <div
                            className="
                              px-1
                              pt-1
                              text-[11px]
                              font-medium
                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ADD WORK MODAL ================= */}

      {showModal && (
        <TaskModal
          selectedDate={selectedDate}
          onClose={() => {
            setShowModal(false);
            setSelectedDate(null);
          }}
          onAddTask={(newTask) => {
            addTask(newTask);

            setShowModal(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}

export default CalendarPage;