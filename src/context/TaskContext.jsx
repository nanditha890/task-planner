import {
  createContext,
  useContext,
  useState,
} from "react";

const TaskContext = createContext(null);

/* =========================================================
   GET TODAY
========================================================= */

export function getToday() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* =========================================================
   TIMESTAMP
========================================================= */

function getTimestamp() {
  return new Date().toISOString();
}


/* =========================================================
   CHECK WHETHER DATE IS IN THE PAST
========================================================= */

function isPastDate(date) {
  if (!date) {
    return false;
  }

  return date < getToday();
}


/* =========================================================
   GET INITIAL STATUS
========================================================= */

function getTaskStatus(date) {
  if (isPastDate(date)) {
    return "due";
  }

  return "pending";
}


/* =========================================================
   TASK PROVIDER
========================================================= */

export function TaskProvider({ children }) {

  const [tasks, setTasks] = useState([

    /* =====================================================
       SAMPLE TASK 1
    ===================================================== */

    {
      id: 1,

      title: "Complete project report",

      description:
        "Finish the project documentation.",

      date: getToday(),

      time: "10:00",

      priority: "High",

      reminder: 15,

      repeat: "Never",

      status: "pending",

      completed: false,

      completedAt: null,

      createdAt: getTimestamp(),

      updatedAt: getTimestamp(),
    },


    /* =====================================================
       SAMPLE TASK 2
    ===================================================== */

    {
      id: 2,

      title: "Review yesterday's work",

      description:
        "Check the pending work from yesterday.",

      date: getToday(),

      time: "14:00",

      priority: "Medium",

      reminder: 15,

      repeat: "Never",

      status: "pending",

      completed: false,

      completedAt: null,

      createdAt: getTimestamp(),

      updatedAt: getTimestamp(),
    },

  ]);


  /* =======================================================
     ADD TASK
  ======================================================= */

  const addTask = (taskData) => {

    const now = getTimestamp();

    const taskDate =
      taskData.date || getToday();

    const newTask = {

      id: Date.now(),

      title:
        taskData.title?.trim() || "",

      description:
        taskData.description?.trim() || "",

      date: taskDate,

      time:
        taskData.time || "",

      priority:
        taskData.priority || "Medium",

      reminder:
        Number(taskData.reminder || 0),

      repeat:
        taskData.repeat || "Never",

      status:
        getTaskStatus(taskDate),

      completed: false,

      completedAt: null,

      createdAt: now,

      updatedAt: now,
    };


    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);
  };


  /* =======================================================
     UPDATE TASK
  ======================================================= */

  const updateTask = (
    id,
    updatedData
  ) => {

    setTasks((previousTasks) =>

      previousTasks.map((task) => {

        if (task.id !== id) {
          return task;
        }

        const newDate =
          updatedData.date ?? task.date;

        let newStatus = task.status;

        /*
          If task is already completed,
          keep it completed.
        */

        if (task.completed) {

          newStatus = "completed";

        } else {

          newStatus =
            getTaskStatus(newDate);

        }

        return {

          ...task,

          ...updatedData,

          date: newDate,

          status: newStatus,

          completed:
            updatedData.completed ??
            task.completed,

          completedAt:
            updatedData.completedAt ??
            task.completedAt,

          updatedAt:
            getTimestamp(),
        };

      })

    );
  };


  /* =======================================================
     COMPLETE TASK
  ======================================================= */

  const completeTask = (id) => {
  const completedTime = getTimestamp();

  setTasks((previousTasks) =>
    previousTasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      return {
        ...task,
        completed: true,
        status: "completed",
        completedAt: completedTime,
        updatedAt: completedTime,
      };
    })
  );
};

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const deleteTask = (id) => {

    setTasks((previousTasks) =>

      previousTasks.filter(
        (task) => task.id !== id
      )

    );
  };


  /* =======================================================
     REFRESH DUE STATUS
  ======================================================= */

  const refreshTaskStatuses = () => {

    setTasks((previousTasks) =>

      previousTasks.map((task) => {

        /*
          Completed tasks should NEVER
          become due again.
        */

        if (task.completed) {

          return {
            ...task,
            status: "completed",
          };

        }


        /*
          Past unfinished task
          becomes due.
        */

        if (isPastDate(task.date)) {

          return {
            ...task,
            status: "due",
          };

        }


        /*
          Future/today unfinished task
          remains pending.
        */

        return {
          ...task,
          status: "pending",
        };

      })

    );
  };


  /* =======================================================
     ACTIVE TASKS
  ======================================================= */

  const activeTasks = tasks.filter(
    (task) => !task.completed
  );


  /* =======================================================
     COMPLETED TASKS
  ======================================================= */

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    );


  /* =======================================================
     TODAY TASKS
  ======================================================= */

  const todayTasks =
    activeTasks.filter(
      (task) =>
        task.date === getToday() &&
        task.status !== "due"
    );


  /* =======================================================
     DUE TASKS
  ======================================================= */

  const dueTasks =
    activeTasks.filter(
      (task) =>
        task.status === "due"
    );


  /* =======================================================
     COUNTS
  ======================================================= */

  const completedCount =
    completedTasks.length;

  const dueCount =
    dueTasks.length;

  const pendingCount =
    activeTasks.filter(
      (task) =>
        task.status === "pending"
    ).length;


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {

    tasks,

    activeTasks,

    completedTasks,

    todayTasks,

    dueTasks,

    completedCount,

    dueCount,

    pendingCount,

    addTask,

    updateTask,

    completeTask,

    deleteTask,

    refreshTaskStatuses,
  };


  return (
    <TaskContext.Provider
      value={value}
    >
      {children}
    </TaskContext.Provider>
  );
}


/* =========================================================
   USE TASKS
========================================================= */

export function useTasks() {

  const context =
    useContext(TaskContext);

  if (!context) {

    throw new Error(
      "useTasks must be used inside TaskProvider"
    );

  }

  return context;
}


export default TaskContext;