import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart3,
  History,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: CalendarDays,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  /* =================================================
     LOGOUT
  ================================================= */

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  /* =================================================
     USER DISPLAY NAME
     
     Priority:
     1. Display Name from Supabase Auth metadata
     2. Email as fallback
     3. Guest
  ================================================= */

  const userName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "Guest";

  /* =================================================
     AVATAR LETTER
  ================================================= */

  const avatarLetter =
    userName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-5">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          TaskFlow
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Plan. Do. Complete.
        </p>
      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={20} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <button
        type="button"
        onClick={handleLogout}
        className="mb-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} />

        <span>
          Logout
        </span>
      </button>


      {/* =================================================
          USER PROFILE
          
          Clicking this opens Settings
      ================================================= */}

      <button
        type="button"
        onClick={() => navigate("/settings")}
        className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
      >

        {/* AVATAR */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {user ? (
            <span className="font-semibold">
              {avatarLetter}
            </span>
          ) : (
            <User size={20} />
          )}
        </div>


        {/* USER INFORMATION */}

        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-gray-900">
            {userName}
          </p>

          <p className="truncate text-xs text-gray-500">
            My Profile
          </p>

        </div>

      </button>

    </aside>
  );
}

export default Sidebar;