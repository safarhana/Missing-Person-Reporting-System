import React from "react";
import Link from "next/link";
import axios from "axios";
import OfficerCard from "../components/OfficerCard";

type OfficerItem = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  uniqueId?: string;
  joiningDate?: string;
};

interface OfficersPageProps {
  searchParams?: Promise<{ q?: string; delay?: string }>;
}

// Server-Side Rendered (SSR) Page using Axios as taught in ref (Next.js App Router)
export default async function OfficersListPage(props: OfficersPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const searchQuery = searchParams?.q?.trim() || "";

  // Artificial delay for demonstrating loading.tsx when ?delay=true is provided
  if (searchParams?.delay) {
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  let officers: OfficerItem[] = [];
  let isFromBackend = true;

  try {
    // Axios call: Server-Side Data Fetching (SSR)
    const url = searchQuery
      ? `${apiEndpoint}/case-officer/search?q=${encodeURIComponent(searchQuery)}`
      : `${apiEndpoint}/case-officer`;

    const res = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
      timeout: 3000,
    });

    if (Array.isArray(res.data)) {
      officers = res.data;
    }
  } catch {
    isFromBackend = false;
    // Safe SSR fallback data
    const fallbackOfficers: OfficerItem[] = [
      {
        id: 1,
        name: "Ahmed Raza",
        email: "ahmed@police.gov",
        phone: "01711000001",
        country: "Bangladesh",
        uniqueId: "CO-A1B2",
        joiningDate: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Fatima Begum",
        email: "fatima@police.gov",
        phone: "01722000002",
        country: "Bangladesh",
        uniqueId: "CO-C3D4",
        joiningDate: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Karim Hossain",
        email: "karim@police.gov",
        phone: "01733000003",
        country: "Chittagong",
        uniqueId: "CO-E5F6",
        joiningDate: new Date().toISOString(),
      },
    ];

    if (searchQuery) {
      const qLower = searchQuery.toLowerCase();
      officers = fallbackOfficers.filter(
        (o) =>
          o.name.toLowerCase().includes(qLower) ||
          o.email.toLowerCase().includes(qLower) ||
          (o.country || "").toLowerCase().includes(qLower)
      );
    } else {
      officers = fallbackOfficers;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">
            <Link href="/case-officer" className="hover:text-slate-900">Dashboard</Link> / Officers
          </p>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Officer Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search and view active duty case officers
          </p>
        </div>

        <Link
          href="/case-officer/register"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
        >
          <span>+</span> Register New Officer
        </Link>
      </div>

      {/* SSR Search Bar (Native Form GET) */}
      <form method="GET" action="/case-officer/officers" className="flex items-center gap-2 max-w-lg">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, email, or district..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
        >
          Search
        </button>
        {searchQuery && (
          <Link
            href="/case-officer/officers"
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 text-xs font-medium transition-colors"
          >
            Clear
          </Link>
        )}
      </form>


      {/* Officers Grid */}
      {officers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-700">No officers found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {officers.map((officer) => (
            <OfficerCard
              key={officer.id}
              id={officer.id}
              name={officer.name}
              uniqueId={officer.uniqueId}
              email={officer.email}
              phone={officer.phone}
              country={officer.country}
              joiningDate={officer.joiningDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
