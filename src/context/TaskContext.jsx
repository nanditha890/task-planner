import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const TaskContext = createContext();

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isBeforeToday(dateString) {
  return dateString < getToday();
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      description:
        "Finish the documentation for the current project.",
      date: getToday(),
      time: "10:00",
      priority: "High",
      reminder: "15",
      repeat: "Never",
      status: "pending",
      completed: false,
    },

    {
      id: 2,
      title: "Review API integration",
      description:
        "Check the API connection and test the responses.",
      date: getToday(),
      time: "14:00",
      priority: "Medium",
      reminder: "30",
      repeat: "Never",
      status: "pending",
      completed: false,
    },

    {
      id: 3,
      title: "Study React",
      description:
        "Learn React state and component communication.",
      date: getToday(),
      time: "19:00",
      priority: "Low",
      reminder: "15",
      repeat: "Daily",
      status: "pending",
      completed: false,
    },

    {
      id: 4,
      title: "Finish yesterday's pending work",
      description:
        "This work was not completed yesterday.",
      date: "2026-08-11",
      time: "09:00",
      priority: "High",
      reminder: "15",
      repeat: "Never",
      status: "due",
      completed: false,
    },
  ]);

  // ==========================================
  // CONVERT OLD UNFINISHED TASKS TO DUE
  // ==========================================

  useEffect(() => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (
          !task.completed &&
          isBeforeToday(task.date)
        ) {
          return {
            ...task,
            status: "due",
          };
        }

        return task;
      })
    );
  }, []);

  // ==========================================
  // ADD TASK
  // ==========================================

  const addTask = (newTask) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        ...newTask,
        id: Date.now(),
        completed: false,
        status: "pending",
      },
    ]);
  };

  // ==========================================
  // COMPLETE / UNCOMPLETE TASK
  // ==========================================

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const newCompletedState = !task.completed;

        // If completing
        if (newCompletedState) {
          return {
            ...task,
            completed: true,
            status: "completed",
          };
        }

        // If uncompleting an old task,
        // keep it as DUE.
        if (isBeforeToday(task.date)) {
          return {
            ...task,
            completed: false,
            status: "due",
          };
        }

        // Otherwise it is a normal pending task.
        return {
          ...task,
          completed: false,
          status: "pending",
        };
      })
    );
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const updateTask = (id, updatedData) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        let newStatus = task.status;

        // If task is already completed,
        // keep completed status.
        if (task.completed) {
          newStatus = "completed";
        }

        // If task is not completed and
        // its date is in the past,
        // make it due.
        else if (isBeforeToday(updatedData.date)) {
          newStatus = "due";
        }

        // Otherwise pending.
        else {
          newStatus = "pending";
        }

        return {
          ...task,
          ...updatedData,
          status: newStatus,
        };
      })
    );
  };

  // ==========================================
  // COMPLETED COUNT
  // ==========================================

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  // ==========================================
  // DUE COUNT
  // ==========================================

  const dueCount = tasks.filter(
    (task) =>
      task.status === "due" &&
      !task.completed
  ).length;

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        completedCount,
        dueCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useTasks() {
  return useContext(TaskContext);
}