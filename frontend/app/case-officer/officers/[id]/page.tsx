"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import axios from "axios";

import OfficerNavbar from "../../components/OfficerNavbar";
import OfficerCard from "../../components/OfficerCard";

type CaseItem = {
  id: number;
  name: string;
  status: string;
};

type OfficerDetails = {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  uniqueId: string;
  joiningDate?: string;
  cases?: CaseItem[];
};

type OfficerDynamicProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function OfficerProfileDynamicPage({ params }: OfficerDynamicProps) {
  const resolvedParams = use(params);
  const officerId = resolvedParams.id;

  const [officer, setOfficer] = useState<OfficerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;

    const fetchOfficer = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${apiEndpoint}/case-officer/${officerId}`, {
          withCredentials: true,
        });
        if (isMounted && res.data) {
          setOfficer(res.data);
        }
      } catch {
        if (isMounted) {
          setOfficer({
            id: Number(officerId),
            name: "Officer #" + officerId,
            email: `officer${officerId}@police.gov`,
            phone: "01700000000",
            country: "Bangladesh",
            uniqueId: "CO-UUID-" + officerId,
            joiningDate: new Date().toISOString(),
            cases: [],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOfficer();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint, officerId]);

  return (
    <div>
      <OfficerNavbar officerName={officer?.name} />

      <main>
        <p>
          <Link href="/case-officer">← Back to Dashboard</Link>
        </p>

        {isLoading ? (
          <p>Loading officer profile...</p>
        ) : !officer ? (
          <h2>Officer Not Found</h2>
        ) : (
          <div>
            <h1>Officer Profile: {officer.name}</h1>
            <p><strong>Dynamic Route Parameter [id]:</strong> {officerId}</p>

            <OfficerCard
              id={officer.id}
              name={officer.name}
              uniqueId={officer.uniqueId}
              email={officer.email}
              phone={officer.phone}
              country={officer.country}
              joiningDate={officer.joiningDate}
            />

            <br />

            <fieldset>
              <legend><strong>Assigned Case Portfolio ({officer.cases?.length || 0})</strong></legend>
              {officer.cases && officer.cases.length > 0 ? (
                <ul>
                  {officer.cases.map((c: CaseItem) => (
                    <li key={c.id}>
                      <strong>{c.name}</strong> - Status: [{c.status}]
                    </li>
                  ))}
                </ul>
              ) : (
                <p><em>No assigned cases recorded.</em></p>
              )}
            </fieldset>
          </div>
        )}
      </main>
    </div>
  );
}
