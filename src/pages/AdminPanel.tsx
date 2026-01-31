import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Component as EtherealShadow } from "@/components/ui/etheral-shadow";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Users,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Loader2,
  LogIn,
  Crown,
  Activity,
  Database,
} from "lucide-react";
import {
  getAllUsers,
  getAllHealthData,
  createMockUser,
  updateMockUser,
  deleteMockUser,
  createMockHealthData,
  getLeaderboard,
  LeaderboardEntry,
  MockUser,
} from "@/firebase";

// Admin emails - add your admin email here
const ADMIN_EMAILS = ["anshloveragmail.com", "anshloveraa@gmail.com", "admin@neonnexus.com"];

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddHealthOpen, setIsAddHealthOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  
  // Form states
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [healthData, setHealthData] = useState({
    sleepHours: 7,
    steps: 5000,
    activityLevel: "medium" as "low" | "medium" | "high",
    focusLevel: "medium" as "low" | "medium" | "high",
    stressLevel: "medium" as "low" | "medium" | "high",
  });

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, leaderboardData] = await Promise.all([
        getAllUsers(),
        getLeaderboard(),
      ]);
      setUsers(usersData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Add new user
  const handleAddUser = async () => {
    if (!newUserName.trim()) return;
    
    try {
      await createMockUser({
        name: newUserName,
        email: newUserEmail || `${newUserName.toLowerCase().replace(/\s/g, '')}@mock.com`,
      });
      setNewUserName("");
      setNewUserEmail("");
      setIsAddUserOpen(false);
      loadData();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      await updateMockUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
      });
      setEditingUser(null);
      loadData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteMockUser(userId);
      loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Add health data
  const handleAddHealthData = async () => {
    if (!selectedUserId) return;
    
    try {
      await createMockHealthData(selectedUserId, healthData);
      setIsAddHealthOpen(false);
      setSelectedUserId("");
      loadData();
    } catch (error) {
      console.error("Error adding health data:", error);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <Navbar />
        <div className="absolute inset-0 z-0">
          <EtherealShadow
            color="rgba(239, 68, 68, 0.15)"
            animation={{ scale: 60, speed: 50 }}
            noise={{ opacity: 0.6, scale: 1.2 }}
            sizing="fill"
          />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h1 className="text-2xl font-display font-bold uppercase tracking-wider mb-4 text-red-500">
              Authentication Required
            </h1>
            <p className="text-muted-foreground mb-8 font-mono text-sm">
              Please sign in to access the admin panel.
            </p>
            <Button onClick={() => navigate("/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <Navbar />
        <div className="absolute inset-0 z-0">
          <EtherealShadow
            color="rgba(239, 68, 68, 0.15)"
            animation={{ scale: 60, speed: 50 }}
            noise={{ opacity: 0.6, scale: 1.2 }}
            sizing="fill"
          />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h1 className="text-2xl font-display font-bold uppercase tracking-wider mb-4 text-red-500">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-4 font-mono text-sm">
              You don't have admin privileges.
            </p>
            <p className="text-xs text-muted-foreground/50 font-mono mb-8">
              Logged in as: {user.email}
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <EtherealShadow
          color="rgba(239, 68, 68, 0.15)"
          animation={{ scale: 60, speed: 50 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-20" />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-500" />
            <h1
              className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-wider"
              style={{
                color: "#ef4444",
                textShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
              }}
            >
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            Manage users, health data, and leaderboard
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="p-4 rounded-lg border border-red-500/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-display font-bold text-red-500">{users.length}</p>
                <p className="text-xs text-muted-foreground font-mono">Total Users</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-red-500/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-display font-bold text-red-500">{leaderboard.length}</p>
                <p className="text-xs text-muted-foreground font-mono">Active Users</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-red-500/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-display font-bold text-red-500">
                  {leaderboard.reduce((sum, u) => sum + (u.dataCount || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground font-mono">Health Records</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-red-500/30">
              <DialogHeader>
                <DialogTitle className="text-red-500 font-display">Add New User</DialogTitle>
                <DialogDescription>Create a new mock user for the leaderboard</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddUser} className="w-full bg-red-500 hover:bg-red-600">
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddHealthOpen} onOpenChange={setIsAddHealthOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30">
                <Activity className="w-4 h-4 mr-2" />
                Add Health Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-red-500/30">
              <DialogHeader>
                <DialogTitle className="text-red-500 font-display">Add Health Data</DialogTitle>
                <DialogDescription>Add health data for a user</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Select User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sleep Hours</Label>
                    <Input
                      type="number"
                      value={healthData.sleepHours}
                      onChange={(e) => setHealthData({ ...healthData, sleepHours: +e.target.value })}
                      min={0}
                      max={24}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Steps</Label>
                    <Input
                      type="number"
                      value={healthData.steps}
                      onChange={(e) => setHealthData({ ...healthData, steps: +e.target.value })}
                      min={0}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Activity</Label>
                    <Select
                      value={healthData.activityLevel}
                      onValueChange={(v) => setHealthData({ ...healthData, activityLevel: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Focus</Label>
                    <Select
                      value={healthData.focusLevel}
                      onValueChange={(v) => setHealthData({ ...healthData, focusLevel: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stress</Label>
                    <Select
                      value={healthData.stressLevel}
                      onValueChange={(v) => setHealthData({ ...healthData, stressLevel: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddHealthData} className="w-full bg-red-500 hover:bg-red-600">
                  Add Health Data
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={loadData}
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border border-red-500/20 bg-card/50 backdrop-blur-sm"
          >
            <h2 className="text-lg font-display text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-mono">{u.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingUser(u)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(u.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border border-red-500/20 bg-card/50 backdrop-blur-sm"
          >
            <h2 className="text-lg font-display text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Leaderboard
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Records</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry, index) => (
                      <TableRow key={entry.userId}>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              index === 0
                                ? "text-yellow-400"
                                : index === 1
                                ? "text-gray-300"
                                : index === 2
                                ? "text-amber-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            #{index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono">{entry.name}</TableCell>
                        <TableCell className="text-right font-bold text-red-500">
                          {entry.avgScore.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {entry.dataCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="bg-card border-red-500/30">
            <DialogHeader>
              <DialogTitle className="text-red-500 font-display">Edit User</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdateUser} className="w-full bg-red-500 hover:bg-red-600">
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminPanel;
