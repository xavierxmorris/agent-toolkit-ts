"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@securebank.com", role: "admin", status: "active", lastLogin: "2 hours ago" },
  { id: "2", name: "Sarah Manager", email: "manager@securebank.com", role: "manager", status: "active", lastLogin: "1 day ago" },
  { id: "3", name: "John User", email: "user@securebank.com", role: "user", status: "active", lastLogin: "3 days ago" },
  { id: "4", name: "Jane Doe", email: "jane@company.com", role: "user", status: "pending", lastLogin: "Never" },
  { id: "5", name: "Bob Smith", email: "bob@company.com", role: "user", status: "inactive", lastLogin: "30 days ago" },
];

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirect if not admin
  if (userRole !== "admin") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <span className="text-5xl">🔐</span>
        <h1 className="mt-4 text-xl font-bold text-foreground">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    );
    toast.success("User role updated successfully");
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
    toast.success("User status updated successfully");
  };

  const handleDeleteUser = () => {
    if (deleteConfirm.userId) {
      setUsers((prev) => prev.filter((user) => user.id !== deleteConfirm.userId));
      toast.success("User deleted successfully");
    }
    setDeleteConfirm({ open: false, userId: null });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "manager":
        return "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-green-600/10 text-green-600 dark:text-green-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600/10 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => toast.info("User creation is coming soon")} className="bg-primary hover:bg-primary/80">
          ➕ Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-foreground">{users.length}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{users.filter((u) => u.status === "active").length}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{users.filter((u) => u.status === "pending").length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="text-2xl font-bold text-muted-foreground">{users.filter((u) => u.status === "inactive").length}</div>
          <div className="text-sm text-muted-foreground">Inactive</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Last Login</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${getRoleColor(user.role)}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${getStatusColor(user.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.info(`Edit user: ${user.name}`)}>Edit</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm({ open: true, userId: user.id })}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteConfirm({ open: false, userId: null })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete User"
        variant="danger"
      />
    </div>
  );
}
