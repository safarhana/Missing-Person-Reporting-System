"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "1",
      title: "System Initialized",
      message: "Admin monitoring service online and listening for events.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "info",
      read: true,
    },
    {
      id: "2",
      title: "New Case Assigned",
      message: "Case #4092 assigned to lead investigation team.",
      timestamp: "10 mins ago",
      type: "warning",
      read: false,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

    if (!pusherKey) {
      console.warn("Pusher key (NEXT_PUBLIC_PUSHER_KEY) is not configured.");
      return;
    }

    try {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });

      const channel = pusher.subscribe("mprs-admin-channel");

      channel.bind("admin-alert", (data: { title?: string; message?: string; type?: "info" | "warning" | "success" | "alert" }) => {
        const newNotification: SystemNotification = {
          id: Date.now().toString(),
          title: data.title || "Live Alert",
          message: data.message || "A new real-time event was received via PusherJS.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: data.type || "alert",
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    } catch (e) {
      console.warn("Pusher initialization skipped or offline:", e);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const triggerSimulation = () => {
    const sampleEvents = [
      { title: "Volunteer Verified", message: "Volunteer Sarah Connor was confirmed by coordinator.", type: "success" as const },
      { title: "Case Officer Update", message: "Officer Miller updated status on Case #108.", type: "info" as const },
      { title: "High Priority Alert", message: "New missing person report flagged as urgent in Dhaka North.", type: "alert" as const },
    ];
    const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

    const simNotification: SystemNotification = {
      id: Date.now().toString(),
      title: randomEvent.title,
      message: randomEvent.message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: randomEvent.type,
      read: false,
    };

    setNotifications((prev) => [simNotification, ...prev]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-pink-600 rounded-lg hover:bg-pink-50 border border-pink-200 transition-colors focus:outline-none"
        aria-label="Notifications"
        title="PusherJS Realtime Notifications"
      >
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-pink-200 shadow-2xl z-50 overflow-hidden">
          <div className="p-3 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse"></span>
              <h4 className="text-sm font-semibold text-slate-800">Pusher Realtime Alerts</h4>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={triggerSimulation}
                className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                title="Simulate live Pusher event"
              >
                + Test Alert
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-pink-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No new notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 transition-colors ${
                    n.read ? "bg-white opacity-80" : "bg-pink-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        n.type === "alert"
                          ? "text-rose-600"
                          : n.type === "warning"
                          ? "text-amber-600"
                          : n.type === "success"
                          ? "text-emerald-600"
                          : "text-pink-600"
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-pink-50/70 text-[11px] text-slate-500 text-center border-t border-pink-100">
            Channel: <code className="text-pink-600 font-medium">mprs-admin-channel</code>
          </div>
        </div>
      )}
    </div>
  );
}
