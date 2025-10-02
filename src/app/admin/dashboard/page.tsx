"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Shield, 
  Settings, 
  UserCheck, 
  UserMinus, 
  Search,
  Filter,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  emailVerified: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    adminUsers: 0
  });

  // Check if user has admin access
  useEffect(() => {
    if (isPending) return;
    
    if (!session?.user) {
      router.push('/sign-in?redirect=/admin/dashboard');
      return;
    }

    // Check if user is admin (this would typically be done server-side too)
    checkAdminAccess();
  }, [session, isPending, router]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/check-access');
      if (!response.ok) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
      loadDashboardData();
    } catch (error) {
      console.error('Access check failed:', error);
      router.push('/');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load users, roles, and permissions in parallel
      const [usersRes, rolesRes, permissionsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
        fetch('/api/admin/permissions'),
        fetch('/api/admin/stats')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles || []);
      }

      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData.permissions || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, roleName: string) => {
    try {
      const response = await fetch('/api/admin/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleName }),
      });

      if (response.ok) {
        toast.success('Role assigned successfully');
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to assign role');
      }
    } catch (error) {
      console.error('Failed to assign role:', error);
      toast.error('Failed to assign role');
    }
  };

  const removeRole = async (userId: string, roleName: string) => {
    try {
      const response = await fetch('/api/admin/remove-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleName }),
      });

      if (response.ok) {
        toast.success('Role removed successfully');
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to remove role');
      }
    } catch (error) {
      console.error('Failed to remove role:', error);
      toast.error('Failed to remove role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Permissions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPermissions}</div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts and role assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.emailVerified ? "success" : "secondary"}>
                          {user.emailVerified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Manage User Roles</DialogTitle>
                              <DialogDescription>
                                Assign or remove roles for {selectedUser?.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Current Roles</h4>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedUser?.roles.map((role) => (
                                    <div key={role} className="flex items-center gap-2">
                                      <Badge variant="secondary">{role}</Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRole(selectedUser.id, role)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <UserMinus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Available Roles</h4>
                                <div className="space-y-2">
                                  {roles
                                    .filter((role) => !selectedUser?.roles.includes(role.name))
                                    .map((role) => (
                                      <div key={role.id} className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium">{role.name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {role.description}
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => assignRole(selectedUser!.id, role.name)}
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}