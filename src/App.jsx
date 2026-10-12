
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";

import { useState } from "react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Exams from "./pages/Exam";
import Questions from "./pages/Questions";
import MyResults from "./pages/MyResults";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function AppContent() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("loggedInUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/login");
  };

  const isAdmin =
    loggedInUser?.role?.toUpperCase() === "ADMIN";

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Online Examination System</h2>

        <div className="nav-links">
          {!loggedInUser ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <span>
                Welcome, {loggedInUser.name}
              </span>

              <Link to="/exams">Exams</Link>

              {isAdmin ? (
                <Link to="/admin">Admin Dashboard</Link>
              ) : (
                <Link to="/my-results">My Results</Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={loggedInUser ? "/exams" : "/login"}
              replace
            />
          }
        />

        <Route
          path="/register"
          element={
            loggedInUser ? (
              <Navigate to="/exams" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/login"
          element={
            loggedInUser ? (
              <Navigate to="/exams" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/exams"
          element={
            loggedInUser ? (
              <Exams />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/my-results"
          element={
            loggedInUser && !isAdmin ? (
              <MyResults />
            ) : (
              <Navigate to="/exams" replace />
            )
          }
        />

        <Route
          path="/exam"
          element={
            loggedInUser && !isAdmin ? (
              <Questions />
            ) : (
              <Navigate to="/exams" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/exams" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <div>
              <h2>404 - Page Not Found</h2>
              <Link to="/">Go to Home</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
