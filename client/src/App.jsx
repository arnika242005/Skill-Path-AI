import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Recommendation from "./pages/Recommendation";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/recommendation" element={<Recommendation />} />
        {/* Alias to prevent 404 if plural is typed */}
        <Route path="/recommendations" element={<Navigate to="/recommendation" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
