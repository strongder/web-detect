import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import UsersPage from "./pages/UserPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./layout/protectedRouter";
import HistoryPageUser from "./pages/HistoryPageUser";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="malware-detector-theme">
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ScanPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ScanPage />} />
            <Route path="history" element={<HistoryPageUser />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
