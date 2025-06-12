import { NavLink } from "react-router-dom";
import { Download, History, Settings, Users } from "lucide-react";

export default function Navigation() {
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : null;
  const isAdmin = role === "admin";

  const pathScan = isAdmin ? "/" : "/user/";
  const pathHistory = isAdmin ? "/history" : "/user/history";
  return (
    <nav className="flex border-b border-[#1e293b] bg-[#0f172a]">
      <NavLink
        to={pathScan}
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            isActive
              ? "text-white border-b-2 border-[#2563eb]"
              : "text-gray-400 hover:text-white"
          }`
        }
      >
        <Download className="w-4 h-4" />
        Scan APK
      </NavLink>
      <NavLink
        to={pathHistory}
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            isActive
              ? "text-white border-b-2 border-[#2563eb]"
              : "text-gray-400 hover:text-white"
          }`
        }
      >
        <History className="w-4 h-4" />
        History
      </NavLink>
      {role === "admin" && (
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "text-white border-b-2 border-[#2563eb]"
                : "text-gray-400 hover:text-white"
            }`
          }
        >
          <Users className="w-4 h-4" />
          Account
        </NavLink>
      )}
    </nav>
  );
}
