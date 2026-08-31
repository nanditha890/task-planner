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

  // Date selected from calendar
  const [selectedDate, setSelectedDate] = useState(null);

  // Add Work modal
  const [showModal, setShowModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // First day of current month
  const firstDay = new Date(year, month, 1).getDay();

  // Number of days in current month
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // Create calendar cells
  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  // Convert date to YYYY-MM-DD
  function getDateString(day) {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  // Get tasks for a particular date
  function getTasksForDay(day) {
    if (!day) {
      return [];
    }

    const dateString = getDateString(day);

    return tasks.filter(
      (task) => task.date === dateString
    );
  }

  // Check if date is today
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

  // Go previous month
  function goToPreviousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  // Go next month
  function goToNextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  // Go current month
  function goToToday() {
    setCurrentDate(new Date());
  }

  // CLICK DATE
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
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Calendar
        </h1>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          View and manage your scheduled work.
        </p>
      </div>

      <button
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
      "
    >

      {/* CALENDAR HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-5
        "
      >
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {monthName}
        </h2>

        <div className="flex items-center gap-2">

          <button
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
            "
          >
            Today
          </button>

          <button
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
            "
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <button
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
                        ? "border-blue-200 bg-blue-50/60"
                        : "border-slate-200 bg-white hover:bg-slate-50"
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
                                : "bg-slate-100 text-slate-700"
                            }
                          `}
                        >
                          {day}
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {fullDate}
                          </p>

                          <p className="text-xs text-slate-400">
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
                                ? "bg-green-50 text-green-700"
                                : task.status === "due"
                                ? "bg-orange-50 text-orange-700"
                                : task.priority === "High"
                                ? "bg-red-50 text-red-700"
                                : task.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
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
                        <p className="text-xs font-medium text-slate-400">
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

                  ${
                    day
                      ? "cursor-pointer hover:bg-blue-50/50"
                      : "bg-slate-50/30"
                  }

                  ${
                    isToday(day)
                      ? "bg-blue-50/20"
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
                              : "text-slate-700"
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
                                ? "bg-green-50 text-green-700"
                                : task.status === "due"
                                ? "bg-orange-50 text-orange-700"
                                : task.priority === "High"
                                ? "bg-red-50 text-red-700"
                                : task.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
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