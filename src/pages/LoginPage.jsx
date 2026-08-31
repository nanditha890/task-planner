import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-4rem)]
          max-w-6xl
          items-center
          justify-center
        "
      >
        <div
          className="
            grid
            w-full
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
            lg:grid-cols-2
          "
        >
          {/* LEFT BRANDING */}

          <div
            className="
              hidden
              bg-gradient-to-br
              from-blue-600
              via-blue-700
              to-indigo-700
              p-10
              text-white
              lg:flex
              lg:flex-col
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  rounded-xl
                  bg-white/10
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  backdrop-blur-sm
                "
              >
                TaskFlow
              </div>

              <h2
                className="
                  mt-10
                  max-w-md
                  text-4xl
                  font-bold
                  leading-tight
                "
              >
                Stay organized and keep your work moving.
              </h2>

              <p
                className="
                  mt-4
                  max-w-md
                  text-sm
                  leading-6
                  text-blue-100
                "
              >
                Plan your tasks, track progress, manage due work,
                and stay focused from one place.
              </p>
            </div>

            <p className="text-sm text-blue-100">
              Simple task planning for everyday productivity.
            </p>
          </div>

          {/* RIGHT LOGIN FORM */}

          <div
            className="
              flex
              items-center
              justify-center
              p-5
              sm:p-8
              lg:p-12
            "
          >
            <div className="w-full max-w-md">
              {/* MOBILE BRAND */}

              <div className="mb-7 lg:hidden">
                <div
                  className="
                    inline-flex
                    rounded-xl
                    bg-blue-50
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  TaskFlow
                </div>
              </div>

              {/* HEADER */}

              <div className="mb-8">
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-3xl
                  "
                >
                  Welcome Back
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Login to your TaskFlow account
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="login-email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Email
                  </label>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50/60
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
                    "
                    required
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="login-password"
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50/60
                        px-4
                        py-3
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-50
                      "
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-md
                        p-1
                        text-slate-400
                        transition
                        hover:text-slate-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-400
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </button>
              </form>

              {/* SIGNUP */}

              <p
                className="
                  mt-6
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Don't have an account?{" "}

                <a
                  href="/signup"
                  className="
                    font-semibold
                    text-blue-600
                    transition
                    hover:text-blue-700
                  "
                >
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

