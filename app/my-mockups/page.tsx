"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Loader2,
  Smartphone,
  Monitor,
  Tablet,
  Palette,
  Layout,
  Sparkles,
  Plus,
  Search,
  FolderOpen,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { Mockup } from "@/types";

const getDeviceIcon = (device: string) => {
  switch (device.toLowerCase()) {
    case "iphone":
      return <Smartphone className="h-4 w-4" />;
    case "ipad":
      return <Tablet className="h-4 w-4" />;
    case "macbook":
      return <Monitor className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

const getBackgroundIcon = (background: string) => {
  switch (background.toLowerCase()) {
    case "gradient":
      return <Palette className="h-4 w-4" />;
    case "texture":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Palette className="h-4 w-4" />;
  }
};

export default function MyMockupsPage() {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchMockups();

    // Refresh mockups when returning to the page (e.g., after saving)
    const handleFocus = () => fetchMockups();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchMockups = async () => {
    try {
      const response = await fetch("/api/mockups");
      const data = await response.json();
      setMockups(data.mockups || []);
    } catch (error) {
      console.error("Error fetching mockups:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMockup = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this mockup? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await fetch(`/api/mockups/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMockups(mockups.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting mockup:", error);
    }
  };

  const loadMockup = (mockup: Mockup) => {
    // Store the mockup data in localStorage to load it in the editor
    const dataToLoad = { ...mockup.data, name: mockup.name };
    localStorage.setItem("loadedMockup", JSON.stringify(dataToLoad));
    router.push("/");
  };

  const filteredMockups = mockups.filter(
    (mockup) =>
      mockup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockup.data.selectedDevice
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground font-medium">
            Loading your mockups...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border supports-backdrop-filter:bg-background/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  My Mockups
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage and organize your saved designs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search mockups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredMockups.length === 0 && mockups.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                You have no saved mockups
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Create your first professional mockup and save it for easy
                access later.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Mockup
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredMockups.length === 0 && searchTerm ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground">
                There are no mockups matching &quot;{searchTerm}&quot;
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Mockups
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground"
                >
                  {filteredMockups.length}{" "}
                  {filteredMockups.length === 1 ? "mockup" : "mockups"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredMockups.map((mockup, index) => (
                <Card
                  key={mockup.id}
                  className="group bg-card border border-border hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold text-foreground pr-2 flex-1 min-w-0">
                          {mockup.name}
                        </CardTitle>
                        {index === 0 && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs px-2 py-1 shrink-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Recent
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {index === 0 ? "Updated" : "Created"}{" "}
                          {new Date(mockup.created_at).toLocaleDateString(
                            "es-ES"
                          )}
                          {index === 0 && (
                            <span className="ml-2 text-foreground font-medium">
                              •{" "}
                              {new Date(mockup.created_at).toLocaleTimeString(
                                "es-ES",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          {getDeviceIcon(mockup.data.selectedDevice)}
                          <span className="ml-2 capitalize">
                            {mockup.data.selectedDevice}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          {getBackgroundIcon(mockup.data.backgroundType)}
                          <span className="ml-2 capitalize">
                            {mockup.data.backgroundType}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Layout className="h-4 w-4" />
                        <span className="ml-2 capitalize">
                          {mockup.data.layoutMode}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => loadMockup(mockup)}
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteMockup(mockup.id)}
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
