import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            LOGIN
        ================================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* ================================
            SIGNUP
        ================================= */}

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* ================================
            MAIN APPLICATION
        ================================= */}

        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">

              {/* SIDEBAR */}

              <Sidebar />

              {/* MAIN CONTENT */}

              <main className="ml-64 min-h-screen p-8">

                <Routes>

                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/calendar"
                    element={<CalendarPage />}
                  />

                  <Route
                    path="/tasks"
                    element={<TasksPage />}
                  />

                  <Route
                    path="/analytics"
                    element={<AnalyticsPage />}
                  />

                  <Route
                    path="/history"
                    element={<HistoryPage />}
                  />

                  <Route
                    path="/settings"
                    element={<SettingsPage />}
                  />

                </Routes>

              </main>

            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;