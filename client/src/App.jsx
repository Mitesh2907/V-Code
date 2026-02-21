import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

import LandingPage from "./pages/LandingPage/LandingPage";
import CreateRoomPage from "./pages/CreateRoomPage/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage/JoinRoomPage";
import EditorPage from "./pages/EditorPage/EditorPage";
import RoomsPage from "./pages/RoomsPage/RoomsPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import DocumentationPage from "./pages/DocumentationPage";
import FeaturesPage from "./pages/FeaturesPage";

import ProtectedRoute from "./components/common/ProtectedRoute";

// ✅ Admin Imports (NO router import here)
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminSystem from "./pages/admin/AdminSystem";
import AdminRoute from "./routes/AdminRoute";


/* =========================
   MAIN APP CONTENT
========================= */

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Toaster />

      {/* ✅ Hide Header in Admin */}
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <Routes>

          {/* 🌐 Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateRoomPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join"
            element={
              <ProtectedRoute>
                <JoinRoomPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:roomId"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="system" element={<AdminSystem />} />
          </Route>

          {/* ❌ 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </main>

      {/* ✅ Hide Footer in Admin */}
      {!isAdminRoute && <Footer />}

    </div>
  );
}

/* =========================
   WRAPPER (Router Inside)
========================= */

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
