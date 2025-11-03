"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth/useAuth";

interface OnlineUser {
  id: string;
  email: string;
  last_seen: string;
}

export function usePresence() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    let presenceInterval: NodeJS.Timeout | null = null;

    // Join presence channel
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track user presence
    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState)
          .flat()
          .map((presence: unknown) => {
            const p = presence as {
              id: string;
              email: string;
              last_seen: string;
            };
            return {
              id: p.id,
              email: p.email,
              last_seen: p.last_seen,
            };
          }) as OnlineUser[];
        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: user.id,
            email: user.email,
            last_seen: new Date().toISOString(),
          });

          // Update presence every 30 seconds to stay "online"
          presenceInterval = setInterval(async () => {
            await channel.track({
              id: user.id,
              email: user.email,
              last_seen: new Date().toISOString(),
            });
          }, 30000);
        }
      });

    // Cleanup function
    return () => {
      if (presenceInterval) {
        clearInterval(presenceInterval);
      }
      channel.unsubscribe();
    };
  }, [user]);

  return { onlineUsers };
}
