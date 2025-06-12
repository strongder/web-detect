"use client";

import { Shield, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const json = localStorage.getItem("user");
  const user = json ? JSON.parse(json) : null;
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const handleProfile = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/profile");
    } else {
      navigate("/user/profile");
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-[#2563eb]">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-white" />
        <h1 className="text-xl font-bold text-white">APK Malware Detector</h1>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 flex items-center gap-2 text-white hover:bg-[#1d4ed8]"
            >
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src="/placeholder.svg" alt="Admin" />
                <AvatarFallback className="bg-[#1d4ed8] text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-[#0f172a] border-[#1e293b] text-white"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-gray-400">
                  admin@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#1e293b]" />
            <DropdownMenuItem
              onClick={handleProfile}
              className="text-gray-300 hover:text-white focus:text-white hover:bg-[#1e293b] focus:bg-[#1e293b]"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1e293b]" />
            <DropdownMenuItem
              className="text-gray-300 hover:text-white focus:text-white hover:bg-[#1e293b] focus:bg-[#1e293b]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
