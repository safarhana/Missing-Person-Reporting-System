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
    description: "Wearing blue t-shirt & dark jeans. Last seen near bridge 2. Search party active.",
  },
  {
    id: 102,
    name: "Sumaiya Akter",
    age: 22,
    lastSeen: "Uttara Sector 7, Dhaka",
    status: "INVESTIGATING",
    description: "College student, last seen boarding a bus near north tower. CCTV footage being checked.",
  },
  {
    id: 103,
    name: "Tanvir Ahmed",
    age: 8,
    lastSeen: "Mirpur 10 Circle, Dhaka",
    status: "CRITICAL ALERT",
    description: "Wearing school uniform. Height ~4ft. Any visual contact please report to precinct.",
  },
];

export default function UrgentAlertsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % defaultAlerts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? defaultAlerts.length - 1 : prev - 1
    );
  };

  const alert = defaultAlerts[currentSlide];

  return (
    <fieldset style={{ margin: "10px 0" }}>
      <legend>
        <strong>🚨 Priority Missing Person Alerts (Slide {currentSlide + 1} of {defaultAlerts.length})</strong>
      </legend>

      <div>
        <h3>
          [{alert.status}] {alert.name} ({alert.age} years old)
        </h3>
        <p><strong>Last Seen:</strong> {alert.lastSeen}</p>
        <p>{alert.description}</p>
      </div>

      <div>
        <Link href={`/case-officer/cases/${alert.id}`}>[Open Case File]</Link>
        {" | "}
        <button onClick={prevSlide} type="button">❮ Previous</button>
        {" "}
        <button onClick={nextSlide} type="button">Next ❯</button>
      </div>
    </fieldset>
  );
}
