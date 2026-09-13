"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";

export interface OfficerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}

const STORAGE_KEY = "mprs_officer_notifications_v3";

export default function OfficerNotificationBell() {
  const [notifications, setNotifications] = useState<OfficerNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize notifications from localStorage or default seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    // Default seed with real current timestamps
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const initialList: OfficerNotification[] = [
      {
        id: "1",
        title: "Case Dispatch Active",
        message: "Officer dispatch channel listening for emergency alerts.",
        timestamp: currentTimeStr,
        type: "info",
        read: true,
      },
      {
        id: "2",
        title: "New Case Assigned",
        message: "Urgent missing person report routed to Case Officer desk.",
        timestamp: currentTimeStr,
        type: "alert",
        read: false,
      },
    ];

    setNotifications(initialList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
    } catch {
      /* ignore */
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pusher real-time WebSocket connection
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

    if (!pusherKey) return;

    try {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });

      const channel = pusher.subscribe("mprs-officer-channel");

      channel.bind(
        "officer-alert",
        (data: { title?: string; message?: string; type?: "info" | "warning" | "success" | "alert" }) => {
          const newNotification: OfficerNotification = {
            id: Date.now().toString(),
            title: data.title || "Case Officer Alert",
            message: data.message || "A new real-time case update was received via PusherJS.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: data.type || "alert",
            read: false,
          };

          setNotifications((prev) => {
            const updated = [newNotification, ...prev];
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      );

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    } catch (e) {
      console.warn("Pusher initialization skipped or offline:", e);
    }
  }, []);

  // Save changes to state & localStorage
  const persistNotifications = (updated: OfficerNotification[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
  };

  const markSingleAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  };

  const triggerSimulation = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const sampleEvents = [
      {
        title: "High Priority Case",
        message: "New critical missing child report submitted in your sector.",
        type: "alert" as const,
      },
      {
        title: "Sighting Reported",
        message: "Witness uploaded a lead with photo on Case #204.",
        type: "warning" as const,
      },
      {
        title: "Case Status Updated",
        message: "Case #102 marked as 'Found' by central operations.",
        type: "success" as const,
      },
    ];
    const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

    const simNotification: OfficerNotification = {
      id: Date.now().toString(),
      title: randomEvent.title,
      message: randomEvent.message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: randomEvent.type,
      read: false,
    };

    const updated = [simNotification, ...notifications];
    persistNotifications(updated);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none cursor-pointer"
        aria-label="Officer Notifications"
        title="PusherJS Realtime Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <h4 className="text-sm font-semibold tracking-tight">Pusher Realtime Alerts</h4>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onMouseDown={triggerSimulation}
                onClick={triggerSimulation}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                title="Simulate live Pusher event"
              >
                + Test Alert
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onMouseDown={markAllAsRead}
                  onClick={markAllAsRead}
                  className="text-slate-300 hover:text-white underline font-medium transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={(e) => markSingleAsRead(n.id, e)}
                  className={`p-3.5 transition-all cursor-pointer ${
                    n.read
                      ? "bg-white opacity-70 border-l-2 border-transparent hover:bg-slate-50"
                      : "bg-red-50/40 border-l-2 border-red-500 font-medium hover:bg-red-50/60"
                  }`}
                  title={n.read ? undefined : "Click to mark as read"}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-red-600 animate-pulse" />
                      )}
                      <span
                        className={`text-xs ${
                          n.read
                            ? "text-slate-600 font-medium"
                            : n.type === "alert"
                            ? "text-red-700 font-bold uppercase tracking-wide"
                            : n.type === "warning"
                            ? "text-amber-700 font-bold"
                            : n.type === "success"
                            ? "text-emerald-700 font-bold"
                            : "text-slate-900 font-bold"
                        }`}
                      >
                        {n.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={(e) => markSingleAsRead(n.id, e)}
                          className="text-[10px] text-red-600 hover:text-red-800 underline font-semibold cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-1 text-xs leading-relaxed ${n.read ? "text-slate-500" : "text-slate-700"}`}>
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 text-[11px] text-slate-500 text-center border-t border-slate-200">
            Channel: <code className="text-slate-800 font-mono font-semibold">mprs-officer-channel</code>
          </div>
        </div>
      )}
    </div>
  );
}
