"use client";

import React, { useState } from "react";
import Link from "next/link";

export type AlertSlide = {
  id: number;
  name: string;
  age: number;
  lastSeen: string;
  status: string;
  description: string;
};

const defaultAlerts: AlertSlide[] = [
  {
    id: 101,
    name: "Rahim Uddin",
    age: 14,
    lastSeen: "Dhanmondi Lake, Dhaka",
    status: "URGENT ACTIVE",
    description:
      "Wearing blue t-shirt & dark jeans. Last seen near bridge 2. Search party active.",
  },
  {
    id: 102,
    name: "Sumaiya Akter",
    age: 22,
    lastSeen: "Uttara Sector 7, Dhaka",
    status: "INVESTIGATING",
    description:
      "College student, last seen boarding a bus near north tower. CCTV footage being checked.",
  },
  {
    id: 103,
    name: "Tanvir Ahmed",
    age: 8,
    lastSeen: "Mirpur 10 Circle, Dhaka",
    status: "CRITICAL ALERT",
    description:
      "Wearing school uniform. Height ~4ft. Any visual contact please report to precinct.",
  },
];

const statusColor: Record<string, string> = {
  "URGENT ACTIVE": "bg-emerald-50 border-emerald-200 text-emerald-700",
  INVESTIGATING: "bg-amber-50 border-amber-200 text-amber-700",
  "CRITICAL ALERT": "bg-red-50 border-red-200 text-red-700",
  URGENT: "bg-red-50 border-red-200 text-red-700",
  ACTIVE: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

export type UrgentAlertsCarouselProps = {
  alerts?: AlertSlide[];
};

export default function UrgentAlertsCarousel({ alerts }: UrgentAlertsCarouselProps) {
  const activeAlerts = alerts && alerts.length > 0 ? alerts : defaultAlerts;
  const [currentSlide, setCurrentSlide] = useState(0);

  // keep index within bounds when alerts list length changes
  const safeIndex = currentSlide >= activeAlerts.length ? 0 : currentSlide;

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % activeAlerts.length);
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? activeAlerts.length - 1 : prev - 1
    );

  const alert = activeAlerts[safeIndex];
  const badgeCls =
    statusColor[alert.status.toUpperCase()] ||
    "bg-red-50 border-red-200 text-red-700";

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Priority Missing Person Alerts
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {safeIndex + 1} / {activeAlerts.length}
        </span>
      </div>

      <div className={`rounded-xl border p-4 mb-4 ${badgeCls}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-current/10 mr-2">
              {alert.status}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {alert.name}
            </span>
            <span className="text-xs text-slate-500 ml-1">({alert.age} yrs)</span>
          </div>
          <Link
            href={`/case-officer/cases/${alert.id}`}
            className="inline-flex items-center rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-700 transition-colors shrink-0"
          >
            Open Case
          </Link>
        </div>
        <p className="text-xs mt-2">
          <span className="font-semibold">Last Seen:</span> {alert.lastSeen}
        </p>
        <p className="text-xs mt-1 opacity-80">{alert.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {activeAlerts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              type="button"
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === safeIndex ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            type="button"
            className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={nextSlide}
            type="button"
            className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
