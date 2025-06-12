"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { URL } from "@/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMe = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await fetch(`${URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("role", data.role);
    return data;
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
          scope: "",
          client_id: "",
          client_secret: "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        localStorage.setItem("access_token", data.access_token);
        // Đợi fetchMe hoàn thành rồi mới lấy role và chuyển trang
        const user = await fetchMe();
        const role = user?.role || localStorage.getItem("role");
        if (role === "admin") {
          navigate("/");
        } else {
          navigate("/user");
        }
      } else {
        throw new Error(data.detail || "Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-[#1e293b] bg-[#0f172a] text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1e293b] border-[#2e3b52] text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#2563eb] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1e293b] border-[#2e3b52] text-white pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-[#1e293b] pt-4">
        <div className="text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#2563eb] hover:underline">
            Register
          </Link>
        </div>
        <div className="text-xs text-gray-500 text-center">
          For demo purposes, use: admin@example.com / password
        </div>
      </CardFooter>
    </Card>
  );
}
