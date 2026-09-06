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
        className="relative px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifications"
        title="PusherJS Realtime Notifications"
      >
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <h4 className="text-sm font-semibold tracking-tight">Realtime Ops Alerts</h4>
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={triggerSimulation}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                title="Simulate live Pusher event"
              >
                + Test Alert
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No active notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition-colors ${
                    n.read ? "bg-white opacity-85" : "bg-slate-50 font-medium"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-xs font-bold ${
                        n.type === "alert"
                          ? "text-red-600 uppercase tracking-wide"
                          : n.type === "warning"
                          ? "text-amber-600"
                          : n.type === "success"
                          ? "text-emerald-700"
                          : "text-slate-800"
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

          <div className="p-2.5 bg-slate-50 text-[11px] text-slate-500 text-center border-t border-slate-200">
            Channel: <code className="text-slate-800 font-mono font-semibold">mprs-admin-channel</code>
          </div>
        </div>
      )}
    </div>
  );
}
