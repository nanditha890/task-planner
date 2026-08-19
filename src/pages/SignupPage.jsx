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

      // =================================================
      // VALIDATION
      // =================================================

      if (!trimmedName) {
        throw new Error("Please enter your display name.");
      }

      if (!trimmedEmail) {
        throw new Error("Please enter your email.");
      }

      if (password.length < 6) {
        throw new Error(
          "Password must be at least 6 characters."
        );
      }

      // =================================================
      // CREATE SUPABASE AUTH USER
      // =================================================

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,

        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (signupError) {
        throw signupError;
      }

      if (!data.user) {
        throw new Error(
          "Account could not be created."
        );
      }

      // =================================================
      // CREATE PROFILE
      // =================================================

      const { error: profileError } =
  await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: trimmedName,
    });

      if (profileError) {
        throw profileError;
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        "Account created successfully!"
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        error.message ||
        "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Create your TaskFlow account
          </p>

        </div>

        {/* ===============================================
            ERROR
        =============================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ===============================================
            SUCCESS
        =============================================== */}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* ===============================================
            FORM
        =============================================== */}

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          {/* =============================================
              DISPLAY NAME
          ============================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Display Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* =============================================
              EMAIL
          ============================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* =============================================
              PASSWORD
          ============================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a password"
              minLength={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

            <p className="mt-1 text-xs text-gray-400">
              Minimum 6 characters
            </p>

          </div>

          {/* =============================================
              CREATE ACCOUNT BUTTON
          ============================================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* ===============================================
            LOGIN LINK
        =============================================== */}

        <p className="mt-6 text-center text-sm text-gray-500">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default SignupPage;