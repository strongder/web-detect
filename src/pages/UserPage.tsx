"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Loader2,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/api";

interface UserInterface {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  lastLogin: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/users/");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.detail ||
            error?.message ||
            "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
      setFilteredUsers(res.data);
      toast({
        title: "Refreshed",
        description: "User list has been refreshed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to refresh users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await api.post("/users/", {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
      });
      setUsers([...users, res.data]);
      setFilteredUsers([...users, res.data]);
      setIsAddUserOpen(false);
      setNewUser({
        username: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
      });
      toast({
        title: "User Added",
        description: `User ${newUser.username} has been added successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;
    try {
      const res = await api.put(`/users/update/${currentUser.id}`, {
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
      });
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? res.data : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsEditUserOpen(false);
      setCurrentUser(null);
      toast({
        title: "User Updated",
        description: `User ${res.data.username} has been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      await api.delete(`/users/${currentUser.id}`);
      const updatedUsers = users.filter((user) => user.id !== currentUser.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsDeleteUserOpen(false);
      setCurrentUser(null);
      toast({
        title: "User Deleted",
        description: `User has been deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to delete user",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="container mx-auto text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#1e293b] text-gray-400 hover:text-white"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Add User
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 bg-[#0f172a] border-[#1e293b] text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 mr-2 animate-spin text-[#2563eb]" />
          <span>Loading users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-[#1e293b] bg-[#0f172a]">
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="overflow-hidden border rounded-lg border-[#1e293b] bg-[#0f172a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#1e293b]">
                  <td className="px-4 py-3 text-sm">{user.username}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className={
                        user.role === "admin" ? "bg-[#2563eb]" : "bg-[#1e293b]"
                      }
                    >
                      {user.role === "admin" ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.status === "active" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsEditUserOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsDeleteUserOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="bg-[#0f172a] text-white border-[#1e293b]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                className="bg-[#1e293b] border-[#2e3b52] text-white"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                className="bg-[#1e293b] border-[#2e3b52] text-white"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="bg-[#1e293b] border-[#2e3b52] text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#2e3b52] text-white">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="bg-[#1e293b] border-[#2e3b52] text-white"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="bg-[#1e293b] border-[#2e3b52] text-white"
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="bg-[#0f172a] text-white border-[#1e293b]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user information
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  placeholder="Enter username"
                  className="bg-[#1e293b] border-[#2e3b52] text-white"
                  value={currentUser.username}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="Enter email"
                  className="bg-[#1e293b] border-[#2e3b52] text-white"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: "admin" | "user") =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger className="bg-[#1e293b] border-[#2e3b52] text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#2e3b52] text-white">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setCurrentUser({ ...currentUser, status: value })
                  }
                >
                  <SelectTrigger className="bg-[#1e293b] border-[#2e3b52] text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#2e3b52] text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent className="bg-[#0f172a] text-white border-[#1e293b]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the
              user
              {currentUser && ` "${currentUser.username}"`} and remove their
              data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#1e293b] text-white hover:bg-[#2e3b52] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
