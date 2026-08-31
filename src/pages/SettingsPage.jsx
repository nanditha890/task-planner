import { useEffect, useState } from "react";

import {
  Bell,
  User,
  Palette,
  Save,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
  const { user } = useAuth();

  // =====================================================
  // PROFILE
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(false);

  // =====================================================
  // APPEARANCE
  // =====================================================

  const [darkMode, setDarkMode] = useState(false);

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD USER PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // -----------------------------------------------
        // GET PROFILE FROM SUPABASE
        // -----------------------------------------------

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, full_name, notifications, email_notifications, dark_mode")
            .eq("id", user.id)
            .single();

        if (profileError) {
          console.error(
            "Error loading profile:",
            profileError
          );

          // Fallback to Auth metadata
          setName(
            user.user_metadata?.full_name || ""
          );

          setEmail(user.email || "");

        } else {
  setName(profile?.full_name || "");
  setEmail(user.email || "");

  setNotifications(
    profile?.notifications ?? true
  );

  setEmailNotifications(
    profile?.email_notifications ?? true
  );

  setDarkMode(
    profile?.dark_mode ?? false
  );
}
        // -----------------------------------------------
        // LOAD LOCAL SETTINGS
        // -----------------------------------------------

        const savedSettings =
          localStorage.getItem("taskflow_settings");

        if (savedSettings) {
          const settings =
            JSON.parse(savedSettings);

          setNotifications(
            settings.notifications ?? true
          );

          setEmailNotifications(
            settings.emailNotifications ?? false
          );

          setDarkMode(
            settings.darkMode ?? false
          );
        }

      } catch (error) {
        console.error(
          "Error loading settings:",
          error
        );

        setError(
          "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // =====================================================
  // APPLY DARK MODE
  // =====================================================

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }
  }, [darkMode]);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = async () => {
    if (!user) {
      setError("User is not logged in.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      // -----------------------------------------------
      // UPDATE PROFILE
      // -----------------------------------------------

      const { error: profileError } =
        await supabase
          .from("profiles")
          .update({
            full_name: name.trim(),
          })
          .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // -----------------------------------------------
      // UPDATE AUTH METADATA
      // -----------------------------------------------

      const { error: authError } =
        await supabase.auth.updateUser({
          data: {
            full_name: name.trim(),
          },
        });

      if (authError) {
        console.error(
          "Auth metadata update failed:",
          authError
        );
      }

      // -----------------------------------------------
      // SAVE APP SETTINGS
      // -----------------------------------------------

      const settings = {
        notifications,
        emailNotifications,
        darkMode,
      };

      localStorage.setItem(
        "taskflow_settings",
        JSON.stringify(settings)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Error saving settings:",
        error
      );

      setError(
        error.message ||
          "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
  <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">

    {/* ================= HEADER ================= */}

    <div>
      <h1
        className="
          text-2xl
          font-bold
          tracking-tight
          text-slate-900
          dark:text-white
          sm:text-3xl
        "
      >
        Settings
      </h1>

      <p
        className="
          mt-1
          text-sm
          text-slate-500
          dark:text-slate-400
          sm:text-base
        "
      >
        Manage your TaskFlow preferences.
      </p>
    </div>


    {/* ================= ERROR ================= */}

    {error && (
      <div
        role="alert"
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-600
          dark:border-red-900
          dark:bg-red-950/30
          dark:text-red-400
        "
      >
        {error}
      </div>
    )}


    {/* ================= PROFILE ================= */}

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {/* SECTION HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-100
          px-5
          py-5
          dark:border-slate-700
          sm:px-6
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-blue-600
            dark:bg-blue-950/50
            dark:text-blue-400
          "
        >
          <User size={21} />
        </div>

        <div>
          <h2
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            Profile
          </h2>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Manage your basic information.
          </p>
        </div>
      </div>


      {/* PROFILE FIELDS */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          p-5
          sm:p-6
          md:grid-cols-2
        "
      >

        {/* NAME */}

        <div>
          <label
            htmlFor="name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-300
            "
          >
            Display Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your name"
            className="
              mt-2
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
              dark:border-slate-600
              dark:bg-slate-700
              dark:text-white
              dark:focus:border-blue-500
              dark:focus:ring-blue-950
            "
          />
        </div>


        {/* EMAIL */}

        <div>
          <label
            htmlFor="email"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-300
            "
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="
              mt-2
              w-full
              cursor-not-allowed
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              px-4
              py-3
              text-sm
              text-slate-500
              outline-none
              dark:border-slate-600
              dark:bg-slate-700
              dark:text-slate-400
            "
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Email is managed by your account.
          </p>
        </div>

      </div>
    </section>


    {/* ================= NOTIFICATIONS ================= */}

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-800
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-100
          px-5
          py-5
          dark:border-slate-700
          sm:px-6
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-orange-50
            text-orange-600
            dark:bg-orange-950/40
            dark:text-orange-400
          "
        >
          <Bell size={21} />
        </div>

        <div>
          <h2
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            Notifications
          </h2>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Control how you receive reminders.
          </p>
        </div>
      </div>


      {/* OPTIONS */}

      <div className="divide-y divide-slate-100 dark:divide-slate-700">

        {/* TASK REMINDERS */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="min-w-0">
            <p
              className="
                font-medium
                text-slate-800
                dark:text-slate-200
              "
            >
              Task reminders
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Receive reminders for upcoming tasks.
            </p>
          </div>


          {/* TOGGLE */}

          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            aria-label="Task reminders"
            onClick={() =>
              setNotifications(!notifications)
            }
            className={`
              relative
              h-7
              w-12
              shrink-0
              rounded-full
              transition
              duration-200

              ${
                notifications
                  ? "bg-blue-600"
                  : "bg-slate-300 dark:bg-slate-600"
              }
            `}
          >
            <span
              className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow-sm
                transition-all
                duration-200

                ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }
              `}
            />
          </button>
        </div>


        {/* EMAIL NOTIFICATIONS */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="min-w-0">
            <p
              className="
                font-medium
                text-slate-800
                dark:text-slate-200
              "
            >
              Email notifications
            </p>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Receive task reminders by email.
            </p>
          </div>


          {/* TOGGLE */}

          <button
            type="button"
            role="switch"
            aria-checked={emailNotifications}
            aria-label="Email notifications"
            onClick={() =>
              setEmailNotifications(
                !emailNotifications
              )
            }
            className={`
              relative
              h-7
              w-12
              shrink-0
              rounded-full
              transition
              duration-200

              ${
                emailNotifications
                  ? "bg-blue-600"
                  : "bg-slate-300 dark:bg-slate-600"
              }
            `}
          >
            <span
              className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow-sm
                transition-all
                duration-200

                ${
                  emailNotifications
                    ? "left-6"
                    : "left-1"
                }
              `}
            />
          </button>
        </div>

      </div>
    </section>


    {/* ================= APPEARANCE ================= */}

    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-800
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-100
          px-5
          py-5
          dark:border-slate-700
          sm:px-6
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-purple-50
            text-purple-600
            dark:bg-purple-950/40
            dark:text-purple-400
          "
        >
          <Palette size={21} />
        </div>

        <div>
          <h2
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            Appearance
          </h2>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Customize how the application looks.
          </p>
        </div>
      </div>


      {/* DARK MODE */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-5
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="min-w-0">
          <p
            className="
              font-medium
              text-slate-800
              dark:text-slate-200
            "
          >
            Dark mode
          </p>

          <p
            className="
              mt-1
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            Use a darker color scheme.
          </p>
        </div>


        {/* TOGGLE */}

        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          aria-label="Dark mode"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className={`
            relative
            h-7
            w-12
            shrink-0
            rounded-full
            transition
            duration-200

            ${
              darkMode
                ? "bg-blue-600"
                : "bg-slate-300 dark:bg-slate-600"
            }
          `}
        >
          <span
            className={`
              absolute
              top-1
              h-5
              w-5
              rounded-full
              bg-white
              shadow-sm
              transition-all
              duration-200

              ${
                darkMode
                  ? "left-6"
                  : "left-1"
              }
            `}
          />
        </button>
      </div>

    </section>


    {/* ================= SAVE AREA ================= */}

    <div
      className="
        flex
        flex-col
        gap-3
        pb-2
        sm:flex-row
        sm:items-center
        sm:justify-end
      "
    >

      {saved && (
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-50
            px-4
            py-2
            text-sm
            font-medium
            text-green-600
            dark:bg-green-950/30
            dark:text-green-400
          "
        >
          <CheckCircle2 size={16} />
          Settings saved!
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:w-auto
        "
      >
        <Save size={18} />

        {saving
          ? "Saving..."
          : "Save Settings"}
      </button>

    </div>

  </div>
);
}

export default SettingsPage;