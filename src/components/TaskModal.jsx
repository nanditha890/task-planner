import { X } from "lucide-react";
import { useState } from "react";

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function TaskModal({
  onClose,
  onAddTask,
  onUpdateTask,
  editingTask,
}) {
  const [title, setTitle] = useState(
    editingTask?.title || ""
  );

  const [description, setDescription] = useState(
    editingTask?.description || ""
  );

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
    editingTask?.reminder || "15"
  );

  const [repeat, setRepeat] = useState(
    editingTask?.repeat || "Never"
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      date,
      time: time || "No time set",
      priority,
      reminder,
      repeat,
    };

    // EDIT MODE
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
      onClose();
      return;
    }

    // ADD MODE
    onAddTask({
      ...taskData,
      status: "pending",
      completed: false,
    });

    setTitle("");
    setDescription("");
    setDate(getToday());
    setTime("");
    setPriority("Medium");
    setReminder("15");
    setRepeat("Never");
  };

  const isEditMode = Boolean(editingTask);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Work" : "Add New Work"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update your scheduled work."
                : "Plan something you want to complete."}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Work title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Example: Complete project report"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Add some details about this work..."
              rows="3"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* PRIORITY */}
          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reminder
            </label>

            <select
              value={reminder}
              onChange={(event) =>
                setReminder(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Repeat
            </label>

            <select
              value={repeat}
              onChange={(event) =>
                setRepeat(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
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