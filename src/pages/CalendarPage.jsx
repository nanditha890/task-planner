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

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Calendar
          </h1>

          <p className="mt-1 text-gray-500">
            View and manage your scheduled work.
          </p>
        </div>

        {/* ADD WORK BUTTON */}

        <button
          onClick={() => {
            setSelectedDate(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={18} />

          Add Work
        </button>

      </div>


      {/* ================= CALENDAR ================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* CALENDAR HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 p-5">

          <h2 className="text-xl font-semibold text-gray-900">
            {monthName}
          </h2>

          <div className="flex items-center gap-2">

            <button
              onClick={goToToday}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>

            <button
              onClick={goToPreviousMonth}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goToNextMonth}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>


        {/* ================= WEEK DAYS ================= */}

        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">

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
              className="p-3 text-center text-xs font-semibold uppercase text-gray-500"
            >
              {day}
            </div>

          ))}

        </div>


        {/* ================= CALENDAR DAYS ================= */}

        <div className="grid grid-cols-7">

          {calendarDays.map((day, index) => {

            const dayTasks = getTasksForDay(day);

            return (

              <div
                key={index}

                onClick={() => handleDateClick(day)}

                className={`min-h-[130px] border-b border-r border-gray-100 p-2 transition ${
                  day
                    ? "cursor-pointer hover:bg-blue-50/50"
                    : "bg-gray-50/30"
                }`}
              >

                {day && (
                  <>

                    {/* DATE NUMBER */}

                    <div className="mb-2 flex justify-end">

                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                          isToday(day)
                            ? "bg-blue-600 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>

                    </div>


                    {/* TASKS */}

                    <div className="space-y-1">

                      {dayTasks.map((task) => (

                        <div
                          key={task.id}
                          onClick={(event) => {
                            // Don't open Add Work
                            // when clicking existing task
                            event.stopPropagation();
                          }}
                          className={`rounded-lg px-2 py-1.5 text-xs ${
                            task.completed
                              ? "bg-green-50 text-green-700"
                              : task.status === "due"
                              ? "bg-orange-50 text-orange-700"
                              : task.priority === "High"
                              ? "bg-red-50 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
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

                    </div>

                  </>

                )}

              </div>

            );

          })}

        </div>

      </div>


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