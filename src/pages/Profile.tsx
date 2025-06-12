"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Loader2, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { URL } from "@/api";
import api from "@/api";

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
    status: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentUser = async () => {
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
    setProfile(data);
    return data;
  };

  // Gọi API đổi mật khẩu đúng chuẩn backend
  const changePassword = async () => {
    const data = {
      old_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
    };
    try {
      await api.put("/users/change-password", data);
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: "Unable to change password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
  };

  // api update user profile
  const handleSaveProfile = async () => {
    setIsEditingProfile(true);
    const data = {
      username: profile.username,
      email: profile.email,
    };
    try {
      const response = await api.put(`/users/update/${profile.id}`, data);
      if (response.status === 200) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: "Unable to update profile failed",
      });
    } finally {
      setIsEditingProfile(false);
    }
  };

  // Fetch user profile from /auth/me
  useEffect(() => {
    getCurrentUser();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    changePassword();
  };

  return (
    <div className="container mx-auto py-6 text-white">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Avatar and basic info */}
        <div className="space-y-6">
          <Card className="border-[#1e293b] bg-[#0f172a]">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 border-2 border-[#2563eb] mb-4">
                <AvatarImage src="/placeholder.svg" alt={profile.username} />
                <AvatarFallback className="bg-[#1d4ed8] text-white text-xl">
                  {profile.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold">{profile.username}</h2>
              <p className="text-gray-400 mb-2">{profile.email}</p>

              <div className="flex gap-2 mb-4">
                <Badge
                  variant={profile.role === "admin" ? "default" : "secondary"}
                  className={
                    profile.role === "admin" ? "bg-[#2563eb]" : "bg-[#1e293b]"
                  }
                >
                  {profile.role === "admin" ? (
                    <Shield className="w-3 h-3 mr-1" />
                  ) : (
                    <User className="w-3 h-3 mr-1" />
                  )}
                  {profile.role}
                </Badge>

                <Badge
                  variant={
                    profile.status === "active" ? "default" : "secondary"
                  }
                  className={
                    profile.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                >
                  {profile.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs for profile details and security */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-[#1e293b] mb-4">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#2563eb]"
              >
                Profile Details
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-[#2563eb]"
              >
                Change Password
              </TabsTrigger>
            </TabsList>

            {/* Profile Details Tab */}
            <TabsContent value="profile">
              <Card className="border-[#1e293b] bg-[#0f172a]">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      className="bg-[#1e293b] border-[#2e3b52] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="bg-[#1e293b] border-[#2e3b52] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={profile.role}
                      disabled
                      className="bg-[#1e293b] border-[#2e3b52] text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">
                      Role can only be changed by an administrator
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Input
                      value={profile.status}
                      disabled
                      className="bg-[#1e293b] border-[#2e3b52] text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">
                      Status can only be changed by an administrator
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1e293b] pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="ml-auto bg-[#2563eb] hover:bg-[#1d4ed8]"
                    disabled={isEditingProfile}
                  >
                    {isEditingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-[#1e293b] bg-[#0f172a]">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="bg-[#1e293b] border-[#2e3b52] text-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="bg-[#1e293b] border-[#2e3b52] text-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="bg-[#1e293b] border-[#2e3b52] text-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#1e293b] pt-4">
                  <Button
                    onClick={handleChangePassword}
                    className="ml-auto bg-[#2563eb] hover:bg-[#1d4ed8]"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
