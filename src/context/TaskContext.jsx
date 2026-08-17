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


  // ===============================
  // CARRY OLD WORK AS DUE
  // ===============================

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


  // ===============================
  // ADD TASK
  // ===============================

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


  // ===============================
  // COMPLETE / UNCOMPLETE
  // ===============================

  const toggleTask = (id) => {

    setTasks((currentTasks) =>
      currentTasks.map((task) => {

        if (task.id !== id) {
          return task;
        }

        const completed = !task.completed;

        return {
          ...task,
          completed,
          status: completed
            ? "completed"
            : "pending",
        };

      })
    );

  };


  // ===============================
  // DELETE TASK
  // ===============================

  const deleteTask = (id) => {

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );

  };


  // ===============================
  // UPDATE TASK
  // ===============================

  const updateTask = (id, updatedData) => {

    setTasks((currentTasks) =>
      currentTasks.map((task) => {

        if (task.id !== id) {
          return task;
        }

        return {
          ...task,
          ...updatedData,
        };

      })
    );

  };


  // ===============================
  // COUNTS
  // ===============================

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;


  const dueCount = tasks.filter(
    (task) =>
      task.status === "due" &&
      !task.completed
  ).length;


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


export function useTasks() {
  return useContext(TaskContext);
}