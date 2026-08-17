import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

import { TaskProvider } from "./context/TaskContext";


function App() {

  return (

    <TaskProvider>

      <BrowserRouter>

        <div className="min-h-screen bg-gray-50">

          <Sidebar />

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

      </BrowserRouter>

    </TaskProvider>
  );
}

export default App;