"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
//import VolunteerCard from "./components/volunteerCard";
//import VolunteerFooter from "./components/volunteerFooter";

type Volunteer = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export default function VolunteerHome() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getVolunteers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/volunteer");
        setVolunteers(response.data);
      } catch (requestError) {
        console.log(requestError);
        setError("Unable to load volunteers right now.");
      } finally {
        setLoading(false);
      }
    };
    getVolunteers();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <header className="border-b border-base-300 bg-base-100">
        <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
          <div className="navbar-start">
            <Link href="/volunteer" className="text-lg font-bold text-primary sm:text-xl">
              <span className="mr-2 rounded-lg bg-primary px-2 py-1 text-primary-content">V</span>
              Volunteer Portal
            </Link>
          </div>
          <div className="navbar-end gap-2">
            <Link href="/volunteer/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/volunteer/register" className="btn btn-primary btn-sm">Join the community</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-primary/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-primary">University volunteer network</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-base-content sm:text-6xl">
                Find and manage volunteers with confidence.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
                A focused space for volunteers to keep their information current and for coordinators to connect with the community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/volunteer/register" className="btn btn-primary">Become a volunteer</Link>
                <Link href="/volunteer/login" className="btn btn-outline">Volunteer login</Link>
              </div>
            </div>
            <div className="carousel w-full rounded-2xl shadow-lg">
              <div className="carousel-item w-full">
                <div className="flex min-h-64 w-full flex-col justify-end bg-primary p-8 text-primary-content">
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Volunteer community</p>
                  <h2 className="mt-2 text-3xl font-bold">Every contribution starts with a connection.</h2>
                </div>
              </div>
              <div className="carousel-item w-full">
                <div className="flex min-h-64 w-full flex-col justify-end bg-secondary p-8 text-secondary-content">
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Simple management</p>
                  <h2 className="mt-2 text-3xl font-bold">Keep your profile ready when it matters.</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-primary">Our volunteers</p>
              <h2 className="mt-2 text-3xl font-bold">Meet the community</h2>
            </div>
            <p className="max-w-md text-sm text-base-content/60">Browse the volunteer directory and view the information shared by each member.</p>
          </div>
          {loading && <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary" /></div>}
          {error && <div className="alert alert-error">{error}</div>}
          {!loading && !error && volunteers.length === 0 && <div className="rounded-xl border border-dashed border-base-300 p-10 text-center text-base-content/60">No volunteers found.</div>}
          {!loading && !error && volunteers.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{volunteers.map((volunteer) => <VolunteerCard key={volunteer.id} {...volunteer} />)}</div>}
        </section> */}
      </main>
      {/* <VolunteerFooter /> */}
    </div>
  );
}
