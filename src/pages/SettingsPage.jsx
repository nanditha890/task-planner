import { useEffect, useState } from "react";

import {
  Bell,
  User,
  Palette,
  Save,
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
            .select("id, full_name")
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
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your TaskFlow preferences.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          PROFILE
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <User size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Profile
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your basic information.
            </p>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* NAME */}

          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
            />

            <p className="mt-1 text-xs text-gray-400">
              Email is managed by your account.
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <Bell size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Control how you receive reminders.
            </p>
          </div>

        </div>

        <div className="mt-6 space-y-6">

          {/* TASK REMINDERS */}

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Task reminders
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive reminders for upcoming tasks.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* EMAIL NOTIFICATIONS */}

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Email notifications
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive task reminders by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEmailNotifications(
                  !emailNotifications
                )
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                emailNotifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  emailNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>
      </div>

      {/* =================================================
          APPEARANCE
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <Palette size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize how the application looks.
            </p>
          </div>

        </div>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              Dark mode
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use a darker color scheme.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              darkMode
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                darkMode
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>

        </div>

      </div>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="flex items-center justify-end gap-4">

        {saved && (
          <span className="text-sm font-medium text-green-600">
            Settings saved!
          </span>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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