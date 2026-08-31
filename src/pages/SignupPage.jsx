import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SIGN UP
  // =====================================================

 const handleSignup = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");
  setLoading(true);

  try {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Validation
    if (!trimmedName) {
      throw new Error("Please enter your display name.");
    }

    if (!trimmedEmail) {
      throw new Error("Please enter your email.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    // Create Auth user
    const { data, error: signupError } =
      await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

    if (signupError) {
      throw signupError;
    }

    if (!data?.user) {
      throw new Error("Account could not be created.");
    }

    // Signup succeeded
    setSuccess("Account created successfully! Redirecting to login...");

    setName("");
    setEmail("");
    setPassword("");

    // Go to login
    setTimeout(() => {
      navigate("/login");
    }, 1000);

  } catch (error) {
    console.error("Signup error:", error);

    setError(
      error?.message || "Unable to create account."
    );
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // UI
  // =====================================================

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
              Build a better routine, one task at a time.
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
              Create tasks, track progress, manage due work,
              and stay organized from a single workspace.
            </p>
          </div>

          <p className="text-sm text-blue-100">
            Simple planning. Clear progress. Better focus.
          </p>
        </div>


        {/* RIGHT SIGNUP FORM */}

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
                Create Account
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Create your TaskFlow account
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


            {/* SUCCESS */}

            {success && (
              <div
                role="status"
                className="
                  mb-5
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-green-600
                "
              >
                {success}
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* DISPLAY NAME */}

              <div>
                <label
                  htmlFor="signup-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Display Name
                </label>

                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
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


              {/* EMAIL */}

              <div>
                <label
                  htmlFor="signup-email"
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
                  id="signup-email"
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
                  htmlFor="signup-password"
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

                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={6}
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

                <p className="mt-1.5 text-xs text-slate-400">
                  Minimum 6 characters
                </p>
              </div>


              {/* CREATE ACCOUNT BUTTON */}

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
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>


            {/* LOGIN LINK */}

            <p
              className="
                mt-6
                text-center
                text-sm
                text-slate-500
              "
            >
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                Login
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default SignupPage;