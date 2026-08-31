import { X } from "lucide-react";
import { useState } from "react";
import { getToday } from "../context/TaskContext";

function TaskModal({
  onClose,
  onAddTask,
  onUpdateTask,
  editingTask,
}) {
  /* =====================================================
     EDIT MODE
  ===================================================== */

  const isEditMode = Boolean(editingTask);

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [title, setTitle] = useState(
    editingTask?.title || ""
  );

  const [description, setDescription] = useState(
    editingTask?.description || ""
  );

  /*
    IMPORTANT:
    If editing an old task, keep its original date.
    If adding a new task, use today's date.
  */
  const [date, setDate] = useState(
    editingTask?.date || getToday()
  );

  const [time, setTime] = useState(
    editingTask?.time === "No time set"
      ? ""
      : editingTask?.time || ""
  );

  const [priority, setPriority] = useState(
    editingTask?.priority || "Medium"
  );

  const [reminder, setReminder] = useState(
    String(editingTask?.reminder ?? "15")
  );

  const [repeat, setRepeat] = useState(
    editingTask?.repeat || "Never"
  );

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const taskData = {
      title: title.trim(),

      description: description.trim(),

      /*
        Keep exactly the date selected by the user.
      */
      date: date,

      time: time || "No time set",

      priority: priority,

      reminder: Number(reminder),

      repeat: repeat,
    };

    /* ===================================================
       EDIT EXISTING TASK
    =================================================== */

    if (editingTask) {
      onUpdateTask(
        editingTask.id,
        taskData
      );

      return;
    }

    /* ===================================================
       ADD NEW TASK
    =================================================== */

    onAddTask({
      ...taskData,

      status: "pending",

      completed: false,
    });
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-end
      justify-center
      bg-slate-950/50
      backdrop-blur-[2px]
      sm:items-center
      sm:p-4
    "
  >
    {/* MODAL */}

    <div
      className="
        flex
        max-h-[92vh]
        w-full
        flex-col
        overflow-hidden
        rounded-t-3xl
        bg-white
        shadow-2xl
        sm:max-w-lg
        sm:rounded-3xl
      "
    >

      {/* ================= HEADER ================= */}

      <div
        className="
          flex
          shrink-0
          items-start
          justify-between
          gap-4
          border-b
          border-slate-100
          bg-white
          px-5
          py-5
          sm:px-6
        "
      >
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditMode
              ? "Edit Work"
              : "Add New Work"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? "Update your scheduled work."
              : "Plan something you want to complete."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-500
            transition
            hover:bg-slate-200
            hover:text-slate-800
          "
        >
          <X size={19} />
        </button>
      </div>


      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="
          flex
          min-h-0
          flex-1
          flex-col
        "
      >

        {/* SCROLLABLE FORM CONTENT */}

        <div
          className="
            flex-1
            space-y-5
            overflow-y-auto
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >

          {/* TITLE */}

          <div>
            <label
              htmlFor="task-title"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Work title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Example: Complete project report"
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
              required
            />
          </div>


          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="task-description"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Add some details about this work..."
              rows="3"
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>


          {/* DATE + TIME */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* DATE */}

            <div>
              <label
                htmlFor="task-date"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Date
              </label>

              <input
                id="task-date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/50
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-50
                "
                required
              />
            </div>


            {/* TIME */}

            <div>
              <label
                htmlFor="task-time"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Time
              </label>

              <input
                id="task-time"
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/50
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-50
                "
              />
            </div>

          </div>


          {/* PRIORITY */}

          <div>
            <label
              htmlFor="task-priority"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="High">
                🔴 High
              </option>

              <option value="Medium">
                🟡 Medium
              </option>

              <option value="Low">
                🟢 Low
              </option>
            </select>
          </div>


          {/* REMINDER */}

          <div>
            <label
              htmlFor="task-reminder"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Reminder
            </label>

            <select
              id="task-reminder"
              value={reminder}
              onChange={(event) =>
                setReminder(event.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="0">
                At the scheduled time
              </option>

              <option value="5">
                5 minutes before
              </option>

              <option value="15">
                15 minutes before
              </option>

              <option value="30">
                30 minutes before
              </option>

              <option value="60">
                1 hour before
              </option>

              <option value="1440">
                1 day before
              </option>
            </select>
          </div>


          {/* REPEAT */}

          <div>
            <label
              htmlFor="task-repeat"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "
            >
              Repeat
            </label>

            <select
              id="task-repeat"
              value={repeat}
              onChange={(event) =>
                setRepeat(event.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="Never">
                Never
              </option>

              <option value="Daily">
                Every day
              </option>

              <option value="Weekly">
                Every week
              </option>

              <option value="Monthly">
                Every month
              </option>
            </select>
          </div>

        </div>


        {/* ================= BUTTONS ================= */}

        <div
          className="
            grid
            shrink-0
            grid-cols-2
            gap-3
            border-t
            border-slate-100
            bg-white
            px-5
            py-4
            sm:px-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              rounded-xl
              bg-blue-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
            "
          >
            {isEditMode
              ? "Save Changes"
              : "Add Work"}
          </button>
        </div>

      </form>

    </div>
  </div>
);
}

export default TaskModal;