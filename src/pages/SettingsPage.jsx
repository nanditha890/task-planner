import { useState } from "react";

import {
  Bell,
  User,
  Palette,
  Save,
} from "lucide-react";

function SettingsPage() {
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
  // SAVE STATE
  // =====================================================

  const [saved, setSaved] = useState(false);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {
    const settings = {
      name,
      email,
      notifications,
      emailNotifications,
      darkMode,
    };

    // Temporary local storage.
    // Later Supabase will store this permanently.
    localStorage.setItem(
      "taskflow_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="max-w-4xl space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your TaskFlow preferences.
        </p>
      </div>


      {/* =================================================
          PROFILE
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <User size={22} />
          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              Profile
            </h2>

            <p className="text-sm text-gray-500">
              Manage your basic information.
            </p>

          </div>

        </div>


        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* NAME */}

          <div>

            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Name
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
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="your@email.com"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

        </div>

      </div>


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <Bell size={22} />
          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              Notifications
            </h2>

            <p className="text-sm text-gray-500">
              Control how you receive reminders.
            </p>

          </div>

        </div>


        <div className="mt-6 space-y-6">

          {/* TASK REMINDERS */}

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="font-medium text-gray-800">
                Task reminders
              </p>

              <p className="text-sm text-gray-500">
                Receive reminders for upcoming tasks.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              aria-label="Toggle task reminders"
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

              <p className="font-medium text-gray-800">
                Email notifications
              </p>

              <p className="text-sm text-gray-500">
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
              aria-label="Toggle email notifications"
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <Palette size={22} />
          </div>

          <div>

            <h2 className="font-semibold text-gray-900">
              Appearance
            </h2>

            <p className="text-sm text-gray-500">
              Customize how the application looks.
            </p>

          </div>

        </div>


        <div className="mt-6 flex items-center justify-between gap-4">

          <div>

            <p className="font-medium text-gray-800">
              Dark mode
            </p>

            <p className="text-sm text-gray-500">
              Use a darker color scheme.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            aria-label="Toggle dark mode"
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
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
        >

          <Save size={18} />

          Save Settings

        </button>

      </div>

    </div>
  );
}

export default SettingsPage;