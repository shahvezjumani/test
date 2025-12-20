import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ApiStatus from "./components/ApiStatus";
import ApiInfo from "./components/ApiInfo";
import "./App.css";

// Base API URL
const API_BASE_URL = "http://localhost:3000/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiMessage, setApiMessage] = useState(
    "Waiting for API at http://localhost:3000"
  );

  // Check backend connection
  const checkBackendConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.status === 200) {
        setApiConnected(true);
        setApiMessage("Connected successfully");
      } else {
        setApiConnected(false);
        setApiMessage("Health check failed");
      }
    } catch (error) {
      setApiConnected(false);
      setApiMessage("Cannot reach backend");
    }
  };

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      });

      if (response.status === 200 || response.status === 201) {
        loadTasks();
        showMessage("Task created successfully!", "green");
        return true;
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      showMessage("Failed to create task", "red");
    }
    return false;
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      loadTasks();
      showMessage("Task deleted successfully!", "blue");
    } catch (error) {
      console.error("Failed to delete task:", error);
      showMessage("Failed to delete task", "red");
    }
  };

  // Toggle task completion
  const toggleComplete = async (taskId) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, { completed: true });
      loadTasks();
      showMessage("Task marked as completed!", "green");
    } catch (error) {
      console.error("Failed to update task:", error);
      showMessage("Failed to update task", "red");
    }
  };

  // Test endpoints
  const testGetTasks = async () => {
    try {
      await axios.get(`${API_BASE_URL}/tasks`);
      showMessage("GET /tasks is working!", "green");
    } catch (error) {
      showMessage("Cannot reach GET /tasks endpoint", "red");
    }
  };

  const testHealth = async () => {
    try {
      await axios.get(`${API_BASE_URL}/health`);
      showMessage("GET /health is working!", "green");
    } catch (error) {
      showMessage("Cannot reach GET /health endpoint", "red");
    }
  };

  // Replace the showMessage function in App.js
  const showMessage = (message, color) => {
    const notification = document.createElement("div");

    // Use color mapping for proper Tailwind classes
    const colorClasses = {
      green: "bg-green-100 border-green-400 text-green-700",
      red: "bg-red-100 border-red-400 text-red-700",
      blue: "bg-blue-100 border-blue-400 text-blue-700",
      yellow: "bg-yellow-100 border-yellow-400 text-yellow-700",
    };

    notification.className = `fixed top-4 right-4 ${
      colorClasses[color] || colorClasses.blue
    } px-4 py-3 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-3"></i>
      <span>${message}</span>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Initial load
  useEffect(() => {
    checkBackendConnection();
    loadTasks();
  }, []);

  return (
    <>
      <div className="App bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              <i className="fas fa-tasks text-blue-500 mr-3"></i>Task Manager
            </h1>
            <p className="text-gray-600 style">
              A simple CRUD application for testing frontend & backend
              development skills
            </p>
          </header>

          {/* API Status Indicator */}
          <ApiStatus connected={apiConnected} message={apiMessage} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Task Creation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-4">
                {/* New Card */}
                <div className="w-48 h-32 bg-gray-100 border border-gray-300 rounded-xl flex items-center justify-center font-bold shadow">
                  <h3>Just New</h3>
                </div>

                {/* Existing Create New Task Card */}
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  <i className="fas fa-plus-circle text-green-500 mr-2"></i>
                  Create New Task
                </h2>

                <TaskForm onCreateTask={createTask} />
              </div>

              {/* API Test Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Quick API Tests
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={testGetTasks}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>GET /tasks
                  </button>
                  <button
                    onClick={testHealth}
                    className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-sm font-medium transition"
                  >
                    <i className="fas fa-heartbeat mr-2"></i>GET /health
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Task List */}
            <TaskList
              tasks={tasks}
              loading={loading}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleComplete}
            />
          </div>

          {/* API Info Panel */}
          <ApiInfo />

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Backend Developer Test • 10-15 minute assessment • Frontend ready
              to use
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
