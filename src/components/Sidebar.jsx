import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart3,
  History,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      setMobileMenuOpen(false);

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

  // =====================================================
  // USER DISPLAY NAME
  // =====================================================

  const userName =
    user?.user_metadata?.full_name ||
    user?.email ||
    "Guest";

  const avatarLetter =
    userName.charAt(0).toUpperCase();

  // =====================================================
  // SIDEBAR CONTENT
  // =====================================================

  const SidebarContent = () => (
    <>
      {/* LOGO */}

      <div
        className="
          mb-8
          flex
          items-start
          justify-between
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-lg
                font-bold
                text-white
                shadow-lg
                shadow-blue-200
                dark:shadow-none
              "
            >
              T
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                TaskFlow
              </h1>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Plan. Do. Complete.
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE CLOSE */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="
            rounded-xl
            p-2
            text-slate-500
            transition
            hover:bg-slate-100
            dark:text-slate-400
            dark:hover:bg-slate-800
            lg:hidden
          "
          aria-label="Close navigation"
        >
          <X size={21} />
        </button>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-1.5">
        <p
          className="
            mb-3
            px-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-slate-400
            dark:text-slate-500
          "
        >
          Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3.5
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-blue-600
                        text-white
                        shadow-md
                        shadow-blue-100
                        dark:shadow-none
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-100
                        hover:text-slate-900
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                        dark:hover:text-white
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      transition

                      ${
                        isActive
                          ? "bg-white/15"
                          : `
                            bg-slate-100
                            group-hover:bg-white
                            dark:bg-slate-800
                            dark:group-hover:bg-slate-700
                          `
                      }
                    `}
                  >
                    <Icon size={18} />
                  </div>

                  <span>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BOTTOM AREA */}

      <div
        className="
          mt-5
          border-t
          border-slate-200
          pt-5
          dark:border-slate-700
        "
      >
        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            mb-3
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3.5
            py-3
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-red-50
            hover:text-red-600
            dark:text-slate-300
            dark:hover:bg-red-950/30
            dark:hover:text-red-400
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              dark:bg-slate-800
            "
          >
            <LogOut size={18} />
          </div>

          <span>
            Logout
          </span>
        </button>

        {/* PROFILE */}

        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            navigate("/settings");
          }}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-3
            text-left
            transition-all
            duration-200
            hover:border-blue-200
            hover:bg-blue-50
            dark:border-slate-700
            dark:bg-slate-800
            dark:hover:border-blue-800
            dark:hover:bg-slate-700
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
              rounded-full
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              text-white
              shadow-sm
            "
          >
            {user ? (
              <span className="font-semibold">
                {avatarLetter}
              </span>
            ) : (
              <User size={20} />
            )}
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {userName}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              View profile
            </p>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-30
          flex
          h-16
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white/95
          px-4
          shadow-sm
          backdrop-blur
          dark:border-slate-800
          dark:bg-slate-900/95
          lg:hidden
        "
      >
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(true)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            transition
            hover:bg-slate-50
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:bg-slate-700
          "
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-blue-600
              to-indigo-600
              font-bold
              text-white
            "
          >
            T
          </div>

          <span
            className="
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            TaskFlow
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/settings")
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-blue-50
            font-semibold
            text-blue-600
            transition
            dark:bg-blue-950/50
            dark:text-blue-400
          "
          aria-label="Open profile"
        >
          {user ? (
            avatarLetter
          ) : (
            <User size={19} />
          )}
        </button>
      </header>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/50
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[285px]
          max-w-[85vw]
          flex-col
          overflow-y-auto
          border-r
          border-slate-200
          bg-white
          p-5
          shadow-2xl
          transition-transform
          duration-300
          ease-out

          dark:border-slate-800
          dark:bg-slate-900

          lg:hidden

          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <SidebarContent />
      </aside>

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-30
          hidden
          h-screen
          w-64
          flex-col
          border-r
          border-slate-200
          bg-white
          p-5
          dark:border-slate-800
          dark:bg-slate-900
          lg:flex
        "
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export default Sidebar;