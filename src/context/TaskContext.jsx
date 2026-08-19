import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabase";

const TaskContext = createContext(null);

/* =========================================================
   GET TODAY
========================================================= */

export function getToday() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

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
   CONVERT SUPABASE TASK TO APP TASK
========================================================= */

function formatTask(task) {
  return {
    ...task,

    completedAt: task.completed_at,
    createdAt: task.created_at,
    updatedAt: task.updated_at,

    createdById: task.created_by_id,
    createdByName: task.created_by_name,

    updatedById: task.updated_by_id,
    updatedByName: task.updated_by_name,

    completedById: task.completed_by_id,
    completedByName: task.completed_by_name,
  };
}

/* =========================================================
   TASK PROVIDER
========================================================= */

export function TaskProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD CURRENT USER
  ======================================================= */

  const loadCurrentUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(
        "Error getting current user:",
        error
      );

      setCurrentUser(null);

      return null;
    }

    setCurrentUser(user);

    return user;
  };

  /* =======================================================
     GET CURRENT USER PROFILE
  ======================================================= */

  const getCurrentUserProfile = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      "User not found:",
      userError
    );

    return null;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", user.id)
    .single();

  /*
    Priority:

    1. profiles.full_name
    2. Auth Display Name
    3. Auth name
    4. Unknown User

    Email is NOT used as the display name.
  */

  if (profileError || !profile) {
    console.warn(
      "Profile not found. Using Auth Display Name."
    );

    return {
      id: user.id,

      full_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Unknown User",
    };
  }

  return {
    id: profile.id,

    full_name:
      profile.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Unknown User",
  };
};

  /* =======================================================
     LOAD TASKS FROM SUPABASE
  ======================================================= */

  const loadTasks = async (user = currentUser) => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("tasks")
      .select("*")
      .eq("created_by_id", user.id)
      .order("date", {
        ascending: true,
      })
      .order("time", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading tasks:",
        error
      );

      setLoading(false);

      return;
    }

    const formattedTasks = (data || []).map(
      (task) => {
        const formattedTask = formatTask(task);

        /*
          Automatically calculate the correct
          status for unfinished tasks.
        */

        if (formattedTask.completed) {
          return {
            ...formattedTask,
            status: "completed",
          };
        }

        return {
          ...formattedTask,
          status: getTaskStatus(
            formattedTask.date
          ),
        };
      }
    );

    setTasks(formattedTasks);

    setLoading(false);
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const initialize = async () => {
      const user = await loadCurrentUser();

      if (user) {
        await loadTasks(user);
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  /* =======================================================
     AUTH STATE CHANGES
  ======================================================= */

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user || null;

        setCurrentUser(user);

        if (user) {
          await loadTasks(user);
        } else {
          setTasks([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* =======================================================
     ADD TASK
  ======================================================= */

  const addTask = async (taskData) => {
    const profile =
      await getCurrentUserProfile();

    if (!profile) {
      console.error(
        "Cannot create task: user profile not found"
      );

      return null;
    }

    const taskDate =
      taskData.date || getToday();

    const newTask = {
      title:
        taskData.title?.trim() || "",

      description:
        taskData.description?.trim() || "",

      date: taskDate,

      time:
        taskData.time || null,

      priority:
        taskData.priority || "Medium",

      reminder:
        Number(taskData.reminder || 0),

      repeat:
        taskData.repeat || "Never",

      status:
        getTaskStatus(taskDate),

      completed: false,

      created_by_id:
        profile.id,

      created_by_name:
        profile.full_name,

      completed_by_id: null,

completed_by_name: null,

completed_at: null,

updated_by_id: profile.id,

updated_by_name: profile.full_name,
    };

    const {
      data,
      error,
    } = await supabase
      .from("tasks")
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating task:",
        error
      );

      return null;
    }

    const taskForApp =
      formatTask(data);

    setTasks((previousTasks) => [
      ...previousTasks,
      taskForApp,
    ]);

    return taskForApp;
  };

  /* =======================================================
     UPDATE TASK
  ======================================================= */

 const updateTask = async (id, updatedData) => {
  const existingTask = tasks.find(
    (task) => task.id === id
  );

  if (!existingTask) {
    console.error("Task not found:", id);
    return null;
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    console.error(
      "Cannot update task: user profile not found"
    );
    return null;
  }

  const newDate =
    updatedData.date ?? existingTask.date;

  let newStatus;

  if (existingTask.completed) {
    newStatus = "completed";
  } else {
    newStatus = getTaskStatus(newDate);
  }

  const updatedTime = getTimestamp();

  const databaseUpdate = {
    title:
      updatedData.title ??
      existingTask.title,

    description:
      updatedData.description ??
      existingTask.description,

    date: newDate,

    time:
      updatedData.time ??
      existingTask.time,

    priority:
      updatedData.priority ??
      existingTask.priority,

    reminder:
      updatedData.reminder ??
      existingTask.reminder,

    repeat:
      updatedData.repeat ??
      existingTask.repeat,

    status: newStatus,

    completed:
      updatedData.completed ??
      existingTask.completed,

    updated_at: updatedTime,

    updated_by_id: profile.id,

    updated_by_name: profile.full_name,
  };

  const {
    data,
    error,
  } = await supabase
    .from("tasks")
    .update(databaseUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Error updating task:",
      error
    );

    return null;
  }

  const updatedTask = formatTask(data);

  setTasks((previousTasks) =>
    previousTasks.map((task) =>
      task.id === id
        ? updatedTask
        : task
    )
  );

  return updatedTask;
};

  /* =======================================================
     COMPLETE TASK
  ======================================================= */

  const completeTask = async (id) => {
    const completedTime =
      getTimestamp();

    const profile =
      await getCurrentUserProfile();

    if (!profile) {
      console.error(
        "Cannot complete task: user not found"
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("tasks")
      .update({
  completed: true,

  status: "completed",

  completed_at: completedTime,

  completed_by_id: profile.id,

  completed_by_name: profile.full_name,

  updated_at: completedTime,

  updated_by_id: profile.id,

  updated_by_name: profile.full_name,
})
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error completing task:",
        error
      );

      return;
    }

    const completedTask =
      formatTask(data);

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? completedTask
          : task
      )
    );
  };

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const deleteTask = async (id) => {
    const {
      error,
    } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  /* =======================================================
     REFRESH DUE STATUS
  ======================================================= */

  const refreshTaskStatuses = async () => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.completed) {
          return {
            ...task,
            status: "completed",
          };
        }

        if (
          isPastDate(task.date)
        ) {
          return {
            ...task,
            status: "due",
          };
        }

        return {
          ...task,
          status: "pending",
        };
      })
    );
  };

  /* =======================================================
     REFRESH STATUS WHEN APP OPENS
  ======================================================= */

  useEffect(() => {
    refreshTaskStatuses();

    const interval =
      setInterval(() => {
        refreshTaskStatuses();
      }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     ACTIVE TASKS
  ======================================================= */

  const activeTasks =
    tasks.filter(
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

    currentUser,

    loading,

    getCurrentUserProfile,

    loadTasks,

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