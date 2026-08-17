import {
  Check,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
}) {

  const formattedDate = new Date(
    `${task.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


  return (

    <div
      className={`mb-3 rounded-2xl border bg-white p-5 shadow-sm transition-all duration-500 ${
        task.completed
          ? "border-green-300 bg-green-50"
          : task.status === "due"
          ? "border-orange-200"
          : "border-gray-200"
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        {/* ================= LEFT ================= */}

        <div className="flex items-start gap-4">

          {/* CHECK BUTTON */}

          <button
            type="button"

            onClick={() => onComplete(task.id)}

            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              task.completed
                ? "border-green-500 bg-green-500 text-white scale-110"
                : "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50"
            }`}
          >

            {task.completed && (
              <Check
                size={18}
                strokeWidth={3}
              />
            )}

          </button>


          {/* TASK DETAILS */}

          <div>

            <h3
              className={`font-medium transition-all duration-500 ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>


            {task.description && (

              <p
                className={`mt-1 text-sm transition-all duration-500 ${
                  task.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-500"
                }`}
              >
                {task.description}
              </p>

            )}


            {/* DATE / TIME */}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">

              <span className="flex items-center gap-1">

                <CalendarDays size={14} />

                {formattedDate}

              </span>


              <span className="flex items-center gap-1">

                <Clock3 size={14} />

                {task.time}

              </span>

            </div>

          </div>

        </div>


        {/* ================= RIGHT ================= */}

        <div className="flex shrink-0 flex-col items-end gap-2">


          {/* DUE BADGE */}

          {task.status === "due" &&
            !task.completed && (

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                DUE
              </span>

            )}


          {/* COMPLETED BADGE */}

          {task.completed && (

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              COMPLETED
            </span>

          )}


          {/* PRIORITY */}

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              task.priority === "High"
                ? "bg-red-50 text-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {task.priority.toUpperCase()}
          </span>


          {/* ACTION BUTTONS */}

          {!task.completed && (

            <div className="mt-2 flex items-center gap-2">

              {/* EDIT */}

              <button
                type="button"

                onClick={() =>
                  onEdit(task)
                }

                className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                title="Edit task"
              >
                <Pencil size={16} />
              </button>


              {/* DELETE */}

              <button
                type="button"

                onClick={() =>
                  onDelete(task.id)
                }

                className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default TaskCard;