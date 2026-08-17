import { useState } from "react";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  Plus,
} from "lucide-react";

import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

import { useTasks } from "../context/TaskContext";


function Dashboard() {
  // ===============================
  // STATE
  // ===============================

  const [showModal, setShowModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  // Tasks that are temporarily shown after completing
  const [completedAnimationIds, setCompletedAnimationIds] =
    useState([]);


  // ===============================
  // TASK CONTEXT
  // ===============================

  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    completedCount,
    dueCount,
  } = useTasks();


  // ===============================
  // TODAY'S DATE
  // ===============================

  const todayDate = new Date();

  const today =
    todayDate.getFullYear() +
    "-" +
    String(todayDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(todayDate.getDate()).padStart(2, "0");


  // ===============================
  // TODAY'S WORK
  // ===============================

  const todayTasks = tasks.filter(
    (task) =>
      task.date === today &&
      (
        !task.completed ||
        completedAnimationIds.includes(task.id)
      )
  );


  // ===============================
  // DUE WORK
  // ===============================

  const dueTasks = tasks.filter(
    (task) =>
      task.status === "due" &&
      (
        !task.completed ||
        completedAnimationIds.includes(task.id)
      )
  );


  // ===============================
  // COMPLETE TASK
  // ===============================

  const handleComplete = (taskId) => {

    // Change task to completed
    toggleTask(taskId);

    // Temporarily keep it visible
    setCompletedAnimationIds((current) => [
      ...current,
      taskId,
    ]);

    // After 1 second remove it from dashboard
    setTimeout(() => {

      setCompletedAnimationIds((current) =>
        current.filter((id) => id !== taskId)
      );

    }, 1000);
  };


  // ===============================
  // EDIT TASK
  // ===============================

  const handleEdit = (task) => {

    setEditingTask(task);

    setShowModal(true);
  };


  // ===============================
  // DELETE TASK
  // ===============================

  const handleDelete = (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }
  };


  // ===============================
  // ADD NEW TASK
  // ===============================

  const handleAddTask = (newTask) => {

    addTask(newTask);

    setShowModal(false);

    setEditingTask(null);
  };


  // ===============================
  // UPDATE TASK
  // ===============================

  const handleUpdateTask = (id, updatedData) => {

    updateTask(id, updatedData);

    setShowModal(false);

    setEditingTask(null);
  };


  // ===============================
  // OPEN ADD MODAL
  // ===============================

  const handleAddButton = () => {

    setEditingTask(null);

    setShowModal(true);
  };


  // ===============================
  // CLOSE MODAL
  // ===============================

  const handleCloseModal = () => {

    setShowModal(false);

    setEditingTask(null);
  };


  // ===============================
  // UI
  // ===============================

  return (

    <div className="space-y-8">


      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm text-gray-500">

            {new Date().toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}

          </p>


          <h1 className="mt-1 text-3xl font-bold text-gray-900">

            Good morning 👋

          </h1>


          <p className="mt-1 text-gray-500">

            Here's what you have planned for today.

          </p>

        </div>


        {/* ADD WORK BUTTON */}

        <button
          onClick={handleAddButton}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
        >

          <Plus size={20} />

          Add Work

        </button>

      </div>



      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


        {/* TODAY'S TASKS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Today's Tasks

              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">

                {todayTasks.length}

              </h2>

            </div>


            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

              <Clock3 size={24} />

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

              <h2 className="mt-2 text-3xl font-bold text-gray-900">

                {completedCount}

              </h2>

            </div>


            <div className="rounded-xl bg-green-50 p-3 text-green-600">

              <CheckCircle2 size={24} />

            </div>

          </div>

        </div>



        {/* DUE TASKS */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Due Tasks

              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">

                {dueCount}

              </h2>

            </div>


            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">

              <AlertCircle size={24} />

            </div>

          </div>

        </div>

      </div>



      {/* ================= TODAY'S WORK ================= */}

      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">

              Today's Work

            </h2>

            <p className="mt-1 text-sm text-gray-500">

              Your scheduled work for today.

            </p>

          </div>


          <span className="text-sm text-gray-500">

            {todayTasks.length} tasks

          </span>

        </div>



        {todayTasks.length > 0 ? (

          todayTasks.map((task) => (

            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          ))

        ) : (

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">

            <p className="text-gray-500">

              No tasks planned for today.

            </p>

            <p className="mt-1 text-sm text-gray-400">

              Click "Add Work" to schedule something.

            </p>

          </div>

        )}

      </div>



      {/* ================= DUE WORK ================= */}

      {dueTasks.length > 0 && (

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">

                Due Work

              </h2>

              <p className="mt-1 text-sm text-gray-500">

                Unfinished work carried forward from previous days.

              </p>

            </div>


            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">

              {dueTasks.length} due

            </span>

          </div>



          {dueTasks.map((task) => (

            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}



      {/* ================= TASK MODAL ================= */}

      {showModal && (

        <TaskModal

          onClose={handleCloseModal}

          editingTask={editingTask}

          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}

        />

      )}

    </div>
  );
}


export default Dashboard;