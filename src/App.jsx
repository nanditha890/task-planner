import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import TasksPage from "./pages/TasksPage";

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-gray-50">

        <Sidebar />

        <main className="ml-64 min-h-screen p-8">

          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Calendar */}
            <Route
              path="/calendar"
              element={<CalendarPage />}
            />

            {/* Tasks */}
            <Route
              path="/tasks"
              element={<TasksPage />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;