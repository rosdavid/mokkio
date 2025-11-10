"use client";

import { useEffect, useState } from "react";
import { useAuth, usePresence } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  UserCheck,
  UserX,
  Shield,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  profile: {
    disabled?: boolean;
    [key: string]: unknown;
  } | null;
}

interface OnlineUser {
  id: string;
  username?: string;
  email?: string;
}

interface Analytics {
  totalUsers: number;
  recentUsers: number;
  dailySignups: Array<{ date: string; count: number }>;
}

const TABS = ["Users", "Currently Online", "Analytics"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const { user, loading } = useAuth();
  const { onlineUsers } = usePresence();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [refreshingOnline, setRefreshingOnline] = useState(false);
  const [onlineUsersFromAPI, setOnlineUsersFromAPI] = useState<OnlineUser[]>(
    []
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    // Check if user is admin (you'll need to implement this check)
    if (user && user.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
    fetchAnalytics();
    fetchOnlineUsers();
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      logger.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      logger.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const toggleUserStatus = async (userId: string, disabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, disabled }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      logger.error("Error updating user:", error);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch("/api/admin/online-users");
      const data = await response.json();
      setOnlineUsersFromAPI(data.onlineUsers || []);
    } catch (error) {
      logger.error("Error fetching online users:", error);
    }
  };

  const refreshOnlineUsers = async () => {
    setRefreshingOnline(true);
    try {
      // Try to refresh presence first
      if (user) {
        const channel = supabase.channel("online-users", {
          config: {
            presence: {
              key: user.id,
            },
          },
        });

        // Re-track to force sync
        await channel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              id: user.id,
              email: user.email,
              last_seen: new Date().toISOString(),
            });
            // Unsubscribe after a short delay
            setTimeout(() => channel.unsubscribe(), 500);
          }
        });
      }

      // Also fetch from API as fallback
      await fetchOnlineUsers();
    } catch (error) {
      logger.error("Error refreshing online users:", error);
    } finally {
      setTimeout(() => setRefreshingOnline(false), 1000);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-size-[20px_20px]"></div>
      </div>

      <div className="relative min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Modern Header */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage users, monitor analytics, and oversee the platform
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to App
              </Button>
            </div>
          </div>

          {/* Modern Tabs */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-2">
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "Users" && (
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{user.email}</div>
                            <div className="text-sm text-muted-foreground">
                              Joined:{" "}
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            {user.last_sign_in_at && (
                              <div className="text-sm text-muted-foreground">
                                Last sign in:{" "}
                                {new Date(
                                  user.last_sign_in_at
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                user.email_confirmed_at
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.email_confirmed_at
                                ? "Verified"
                                : "Unverified"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleUserStatus(
                                  user.id,
                                  !user.profile?.disabled
                                )
                              }
                            >
                              {user.profile?.disabled ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Enable
                                </>
                              ) : (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Disable
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "Currently Online" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Currently Online</CardTitle>
                  <Button
                    onClick={refreshOnlineUsers}
                    disabled={refreshingOnline}
                    variant="outline"
                    size="sm"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        refreshingOnline ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {Math.max(onlineUsers.length, onlineUsersFromAPI.length)}
                  </div>
                  <div className="space-y-2">
                    {onlineUsers.length === 0 &&
                    onlineUsersFromAPI.length === 0 ? (
                      <div className="text-muted-foreground">
                        No users online. Try refreshing or check if users are
                        properly connected.
                      </div>
                    ) : (
                      <>
                        {/* Show realtime presence users first */}
                        {onlineUsers.map((u: OnlineUser) => (
                          <div
                            key={`realtime-${u.id}`}
                            className="flex items-center gap-2 p-2 border rounded bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          >
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="font-medium">
                              {u.username || u.email || u.id}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Live
                            </Badge>
                          </div>
                        ))}
                        {/* Show API users (recently active) */}
                        {onlineUsersFromAPI
                          .filter(
                            (apiUser) =>
                              !onlineUsers.some(
                                (realtimeUser) => realtimeUser.id === apiUser.id
                              )
                          )
                          .map((u: OnlineUser) => (
                            <div
                              key={`api-${u.id}`}
                              className="flex items-center gap-2 p-2 border rounded bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                            >
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {u.username || u.email || u.id}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                Recent
                              </Badge>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "Analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loadingAnalytics ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <div className="text-2xl font-bold">
                          {analytics?.totalUsers || 0}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Recent Signups (30d)
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {loadingAnalytics ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <div className="text-2xl font-bold">
                          {analytics?.recentUsers || 0}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Online Now
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {onlineUsers.length}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Charts Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Charts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">View Charts</div>
                    {/* Aquí puedes agregar gráficos adicionales */}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
