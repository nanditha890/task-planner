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

    /* =====================================================
       GET PROFILE FROM DATABASE
    ===================================================== */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", user.id)
      .single();

    /* =====================================================
       DISPLAY NAME
       Priority:
       1. Auth Display Name
       2. profiles.full_name
       3. Unknown User

       IMPORTANT:
       DO NOT USE EMAIL AS NAME FALLBACK
    ===================================================== */

    const displayName =
      user.user_metadata?.full_name?.trim() ||
      profile?.full_name?.trim() ||
      "Unknown User";

    if (profileError) {
      console.warn(
        "Profile not found. Using Auth Display Name:",
        profileError
      );
    }

    return {
      id: user.id,

      full_name: displayName,

      /*
       * Email is now stored in profiles.
       * Auth email remains as fallback.
       */
      email:
        profile?.email ||
        user.email ||
        null,
    };
  };

  /* =======================================================
     LOAD TASKS FROM SUPABASE

     IMPORTANT:
     ALL AUTHENTICATED USERS CAN SEE ALL TASKS.
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
      .order("date", {
        ascending: true,
      })
      .order("time", {
        ascending: true,
      });

    console.log(
      "TASKS FROM SUPABASE:",
      data
    );

    console.log(
      "TASK LOAD ERROR:",
      error
    );

    if (error) {
      console.error(
        "Error loading tasks:",
        error
      );

      setLoading(false);

      return;
    }

    const formattedTasks =
      (data || []).map((task) => {
        const formattedTask =
          formatTask(task);

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
      });

    console.log(
      "FORMATTED TASKS:",
      formattedTasks
    );

    setTasks(formattedTasks);

    console.log(
      "TASKS WERE SET:",
      formattedTasks.length
    );

    setLoading(false);
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const initialize = async () => {
      const user =
        await loadCurrentUser();

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
        const user =
          session?.user || null;

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

    /* ==========================================
       TASK DATE
    ========================================== */

    const taskDate =
      taskData.date || getToday();

    /* ==========================================
       TASK TIME
    ========================================== */

    const taskTime =
      taskData.time || null;

    /* ==========================================
       CREATE TASK
    ========================================== */

    const newTask = {
      title:
        taskData.title?.trim() || "",

      description:
        taskData.description?.trim() || "",

      date: taskDate,

      time: taskTime,

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

      updated_by_id:
        profile.id,

      updated_by_name:
        profile.full_name,
    };

    /* ==========================================
       INSERT TASK
    ========================================== */

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

    console.log(
      "TASK CREATED:",
      data
    );

    /* ==========================================
       FORMAT TASK
    ========================================== */

    const taskForApp =
      formatTask(data);

    /* ==========================================
       ADD TASK TO UI
    ========================================== */

    setTasks((previousTasks) => [
      ...previousTasks,
      taskForApp,
    ]);

    /* ==========================================
       SEND TASK CREATED EMAIL TO ALL USERS
    ========================================== */

    try {
      console.log(
        "Getting all users for TASK CREATED email..."
      );

      const {
        data: allProfiles,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        );

      if (profilesError) {
        console.error(
          "ERROR GETTING ALL USER PROFILES:",
          profilesError
        );
      } else {
        console.log(
          "ALL USERS FOR TASK CREATED EMAIL:",
          allProfiles
        );

        for (const recipient of allProfiles || []) {
          if (!recipient.email) {
            console.warn(
              "Skipping user without email:",
              recipient
            );

            continue;
          }

          try {
            console.log(
              "Sending TASK CREATED email to:",
              recipient.email
            );

            const {
              data: emailResponse,
              error: emailError,
            } = await supabase.functions.invoke(
              "smart-task",
              {
                body: {
                  to: recipient.email,

                  type: "created",

                  task: {
                    ...data,

                    createdByName:
                      profile.full_name,

                    createdAt:
                      data.created_at,
                  },
                },
              }
            );

            if (emailError) {
              console.error(
                "TASK CREATED EMAIL ERROR:",
                recipient.email,
                emailError
              );
            } else {
              console.log(
                "TASK CREATED EMAIL SENT:",
                recipient.email,
                emailResponse
              );
            }
          } catch (emailError) {
            console.error(
              "TASK CREATED EMAIL REQUEST FAILED:",
              recipient.email,
              emailError
            );
          }
        }
      }
    } catch (emailError) {
      console.error(
        "TASK CREATED EMAIL SYSTEM FAILED:",
        emailError
      );
    }

    /* ==========================================
       CREATE EMAIL REMINDER

       IMPORTANT:
       KEEPING YOUR CURRENT WORKING
       REMINDER SYSTEM UNCHANGED FOR NOW.
    ========================================== */

    const reminderMinutes =
      Number(taskData.reminder || 0);

    if (
      reminderMinutes > 0 &&
      taskDate &&
      taskTime &&
      profile.email
    ) {
      try {
        /* =====================================
           COMBINE DATE + TIME
        ===================================== */

        const taskDateTime =
          new Date(
            `${taskDate}T${taskTime}`
          );

        /* =====================================
           CALCULATE REMINDER TIME
        ===================================== */

        const reminderAt =
          new Date(
            taskDateTime.getTime() -
              reminderMinutes *
                60 *
                1000
          );

        const {
          error: reminderError,
        } = await supabase
          .from("task_reminders")
          .insert({
            task_id: data.id,

            user_id: profile.id,

            email: profile.email,

            reminder_minutes:
              reminderMinutes,

            reminder_at:
              reminderAt.toISOString(),

            sent: false,
          });

        if (reminderError) {
          console.error(
            "Error creating task reminder:",
            reminderError
          );
        }
      } catch (reminderError) {
        console.error(
          "Reminder creation failed:",
          reminderError
        );
      }
    }

    return taskForApp;
  };

  /* =======================================================
     UPDATE TASK
  ======================================================= */

  const updateTask = async (
    id,
    updatedData
  ) => {
    const existingTask =
      tasks.find(
        (task) => task.id === id
      );

    if (!existingTask) {
      console.error(
        "Task not found:",
        id
      );

      return null;
    }

    const profile =
      await getCurrentUserProfile();

    if (!profile) {
      console.error(
        "Cannot update task: user profile not found"
      );

      return null;
    }

    const newDate =
      updatedData.date ??
      existingTask.date;

    let newStatus;

    if (existingTask.completed) {
      newStatus = "completed";
    } else {
      newStatus =
        getTaskStatus(newDate);
    }

    const updatedTime =
      getTimestamp();

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

      updated_by_id:
        profile.id,

      updated_by_name:
        profile.full_name,
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

    const updatedTask =
      formatTask(data);

    setTasks((previousTasks) =>
      previousTasks.map(
        (task) =>
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
    /* ==========================================
       GET COMPLETION TIME
    ========================================== */

    const completedTime =
      getTimestamp();

    /* ==========================================
       GET CURRENT USER PROFILE
    ========================================== */

    const profile =
      await getCurrentUserProfile();

    console.log(
      "COMPLETE TASK PROFILE:",
      profile
    );

    if (!profile) {
      console.error(
        "Cannot complete task: user not found"
      );

      return;
    }

    /* ==========================================
       FIND TASK
    ========================================== */

    const existingTask =
      tasks.find(
        (task) => task.id === id
      );

    if (!existingTask) {
      console.error(
        "Cannot complete task: task not found:",
        id
      );

      return;
    }

    /* ==========================================
       UPDATE TASK IN SUPABASE
    ========================================== */

    console.log(
      "COMPLETION DATA:",
      {
        completed_by_id:
          profile.id,

        completed_by_name:
          profile.full_name,

        completed_at:
          completedTime,
      }
    );

    const {
      data,
      error,
    } = await supabase
      .from("tasks")
      .update({
        completed: true,

        status: "completed",

        completed_at:
          completedTime,

        completed_by_id:
          profile.id,

        completed_by_name:
          profile.full_name,

        updated_at:
          completedTime,

        updated_by_id:
          profile.id,

        updated_by_name:
          profile.full_name,
      })
      .eq("id", id)
      .select()
      .single();

    /* ==========================================
       STOP IF DATABASE UPDATE FAILED
    ========================================== */

    if (error) {
      console.error(
        "Error completing task:",
        error
      );

      return;
    }

    console.log(
      "TASK COMPLETED IN SUPABASE:",
      data
    );

    /* ==========================================
       UPDATE TASK IN UI
    ========================================== */

    const completedTask =
      formatTask(data);

    setTasks((previousTasks) =>
      previousTasks.map(
        (task) =>
          task.id === id
            ? completedTask
            : task
      )
    );

    /* ==========================================
       SEND TASK COMPLETED EMAIL TO ALL USERS
    ========================================== */

    try {
      console.log(
        "Getting all users for TASK COMPLETED email..."
      );

      const {
        data: allProfiles,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email"
        );

      if (profilesError) {
        console.error(
          "ERROR GETTING ALL USER PROFILES:",
          profilesError
        );
      } else {
        console.log(
          "ALL USERS FOR TASK COMPLETED EMAIL:",
          allProfiles
        );

        for (const recipient of allProfiles || []) {
          if (!recipient.email) {
            console.warn(
              "Skipping user without email:",
              recipient
            );

            continue;
          }

          try {
            console.log(
              "Sending TASK COMPLETED email to:",
              recipient.email
            );

            const {
              data: emailResponse,
              error: emailError,
            } = await supabase.functions.invoke(
              "smart-task",
              {
                body: {
                  to: recipient.email,

                  type: "completed",

                  task: {
                    ...data,

                    createdByName:
                      data.created_by_name,

                    createdAt:
                      data.created_at,

                    completedByName:
                      profile.full_name,

                    completedAt:
                      data.completed_at,
                  },
                },
              }
            );

            if (emailError) {
              console.error(
                "TASK COMPLETED EMAIL ERROR:",
                recipient.email,
                emailError
              );
            } else {
              console.log(
                "TASK COMPLETED EMAIL SENT:",
                recipient.email,
                emailResponse
              );
            }
          } catch (emailError) {
            console.error(
              "TASK COMPLETED EMAIL REQUEST FAILED:",
              recipient.email,
              emailError
            );
          }
        }
      }
    } catch (emailError) {
      console.error(
        "TASK COMPLETED EMAIL SYSTEM FAILED:",
        emailError
      );
    }

    return completedTask;
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

  const refreshTaskStatuses =
    async () => {
      setTasks(
        (previousTasks) =>
          previousTasks.map(
            (task) => {
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
            }
          )
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