import {
  Check,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({
  task,
  isCompleting = false,
  onComplete,
  onEdit,
  onDelete,
}) {
  /* =======================================================
     DATE
  ======================================================= */

  const formattedDate = new Date(
    `${task.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  /* =======================================================
     COMPLETED STATE
  ======================================================= */

 const isCompleted =
  task.completed === true ||
  task.status === "completed" ||
  isCompleting;

  /* =======================================================
     COMPLETE TASK
  ======================================================= */

 const handleComplete = () => {
  if (isCompleted) {
    return;
  }

  onComplete(task.id);
};

  return (
  <div
    className={`
      mb-3
      rounded-2xl
      border
      p-4
      shadow-sm
      transition-all
      duration-500
      ease-in-out
      sm:p-5

      ${
        isCompleted
          ? "scale-[0.98] border-green-300 bg-green-50 opacity-80"
          : task.status === "due"
          ? "border-orange-200 bg-white"
          : "border-gray-200 bg-white"
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
      {/* LEFT SIDE */}

      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">

        {/* CHECKBOX */}

        <button
          type="button"
          onClick={handleComplete}
          disabled={isCompleted}
          aria-label={
            isCompleted
              ? "Completed"
              : "Complete task"
          }
          className={`
            mt-1
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            border-2
            transition-all
            duration-300

            ${
              isCompleted
                ? "scale-110 border-green-500 bg-green-500 text-white"
                : "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50"
            }
          `}
        >
          {isCompleted && (
            <Check
              size={18}
              strokeWidth={3}
            />
          )}
        </button>

        {/* TASK INFORMATION */}

        <div className="min-w-0 flex-1">

          {/* TITLE */}

          <h3
            className={`
              break-words
              text-base
              font-medium
              leading-6
              transition-all
              duration-500

              ${
                isCompleted
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }
            `}
          >
            {task.title}
          </h3>

          {/* DESCRIPTION */}

          {task.description && (
            <p
              className={`
                mt-1
                break-words
                text-sm
                leading-6
                transition-all
                duration-500

                ${
                  isCompleted
                    ? "text-gray-400 line-through"
                    : "text-gray-500"
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
              text-gray-500
            "
          >
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formattedDate}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} />
              {task.time || "No time set"}
            </span>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}

      <div
        className="
          flex
          w-full
          flex-wrap
          items-center
          gap-2
          border-t
          border-gray-100
          pt-3
          sm:w-auto
          sm:shrink-0
          sm:flex-col
          sm:items-end
          sm:border-0
          sm:pt-0
        "
      >

        {/* STATUS BADGE */}

        {isCompleted ? (
          <span
            className="
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
        ) : task.status === "due" ? (
          <span
            className="
              rounded-full
              bg-orange-50
              px-3
              py-1
              text-xs
              font-medium
              text-orange-600
            "
          >
            DUE
          </span>
        ) : (
          <span
            className="
              rounded-full
              bg-blue-50
              px-3
              py-1
              text-xs
              font-medium
              text-blue-600
            "
          >
            PENDING
          </span>
        )}

        {/* PRIORITY */}

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium

            ${
              task.priority === "High"
                ? "bg-red-50 text-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-green-50 text-green-600"
            }
          `}
        >
          {(task.priority || "Medium").toUpperCase()}
        </span>

        {/* EDIT + DELETE */}

        {!isCompleted && (
          <div
            className="
              ml-auto
              flex
              items-center
              gap-2
              sm:ml-0
              sm:mt-2
            "
          >
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                text-gray-500
                transition
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
              "
              title="Edit task"
              aria-label="Edit task"
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                text-gray-500
                transition
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
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
  </div>
);
}

export default TaskCard;