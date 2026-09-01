"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type OfficerNavbarProps = {
  officerName?: string;
};

export default function OfficerNavbar({ officerName }: OfficerNavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("officer");
    router.push("/case-officer/login");
  };

  return (
    <header>
      <nav>
        <Link href="/case-officer"><strong>Case Officer Portal</strong></Link>
        {" | "}
        <Link href="/case-officer">Dashboard</Link>
        {" | "}
        <Link href="/">Home</Link>
        {officerName && ` | Officer: ${officerName}`}
        {" | "}
        <button onClick={handleLogout} type="button">
          Logout
        </button>
      </nav>
      <hr />
    </header>
  );
}
