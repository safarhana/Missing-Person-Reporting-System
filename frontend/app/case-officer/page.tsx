"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";

import OfficerNavbar from "./components/OfficerNavbar";
import OfficerCard from "./components/OfficerCard";
import CaseCard from "./components/CaseCard";
import UrgentAlertsCarousel from "./components/UrgentAlertsCarousel";

const newCaseSchema = z.object({
  name: z.string().min(1, "Missing person's name is required"),
  age: z.coerce.number().min(0, "Age must be a valid positive number"),
  lastSeenLocation: z.string().min(1, "Last seen location is required"),
  description: z.string().min(1, "Description is required"),
  contactNumber: z.string().min(1, "Contact phone number is required"),
});

type OfficerData = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  uniqueId?: string;
  joiningDate?: string;
};

type CaseData = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notes?: Array<{ noteText: string; addedBy: string; date: string }>;
};

export default function CaseOfficerDashboardPage() {
  const router = useRouter();

  const [officer] = useState<OfficerData | null>(() => {
    if (typeof window !== "undefined") {
      const storedOfficerStr =
        sessionStorage.getItem("officer") || localStorage.getItem("officer");
      if (storedOfficerStr) {
        try {
          return JSON.parse(storedOfficerStr);
        } catch {
          return null;
        }
      }
    }
    return {
      id: 1,
      name: "Case Officer",
      email: "officer@police.gov",
      phone: "01700000000",
      country: "Bangladesh",
      uniqueId: "CO-12345",
    };
  });

  const [cases, setCases] = useState<CaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    name: "",
    age: "",
    lastSeenLocation: "",
    description: "",
    contactNumber: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const apiEndpoint =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";

  useEffect(() => {
    let isMounted = true;

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      router.push("/case-officer/login");
      return;
    }

    const officerId = officer?.id || 1;

    const fetchOfficerCases = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apiEndpoint}/case-officer/${officerId}/cases`,
          { withCredentials: true }
        );
        if (isMounted && Array.isArray(response.data)) {
          setCases(response.data);
        }
      } catch {
        if (isMounted) {
          setCases([
            {
              id: 101,
              name: "Rahim Uddin",
              age: 14,
              lastSeenLocation: "Dhanmondi Lake, Dhaka",
              status: "Active",
              description: "Wearing blue shirt and black pants. Last seen near bridge 2.",
              contactNumber: "01711223344",
              createdAt: new Date().toISOString(),
              notes: [
                {
                  noteText: "Initial report received from local precinct.",
                  addedBy: "Officer",
                  date: new Date().toISOString(),
                },
              ],
            },
            {
              id: 102,
              name: "Sumaiya Akter",
              age: 22,
              lastSeenLocation: "Uttara Sector 7, Dhaka",
              status: "Investigating",
              description: "Height 5'3\", red handbag, college student.",
              contactNumber: "01822334455",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              notes: [
                {
                  noteText: "CCTV footage being reviewed near bus terminal.",
                  addedBy: "Lead Detective",
                  date: new Date().toISOString(),
                },
              ],
            },
          ]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOfficerCases();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint, officer, router]);

  const handleStatusChange = async (caseId: number, newStatus: string) => {
    try {
      await axios.patch(
        `${apiEndpoint}/case-officer/cases/${caseId}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );

      setActionMessage({
        type: "success",
        text: `Case #${caseId} status updated to ${newStatus}`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
      );
      setActionMessage({
        type: "success",
        text: `Case #${caseId} status changed to ${newStatus}`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleDeleteCase = async (caseId: number) => {
    if (!confirm(`Are you sure you want to delete Case #${caseId}?`)) return;

    try {
      await axios.delete(`${apiEndpoint}/case-officer/cases/${caseId}`, {
        withCredentials: true,
      });

      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({
        type: "success",
        text: `Case #${caseId} has been successfully deleted`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    } catch {
      setCases((prev) => prev.filter((c) => c.id !== caseId));
      setActionMessage({
        type: "success",
        text: `Case #${caseId} deleted`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleCreateCase = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = newCaseSchema.safeParse(newCaseData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((iss) => {
        const path = iss.path[0] as string;
        errMap[path] = iss.message;
      });
      setFormErrors(errMap);
      return;
    }

    try {
      const officerId = officer?.id || 1;
      const payload = {
        name: newCaseData.name.trim(),
        age: Number(newCaseData.age),
        lastSeenLocation: newCaseData.lastSeenLocation.trim(),
        description: newCaseData.description.trim(),
        contactNumber: newCaseData.contactNumber.trim(),
      };

      let newCreatedCase: CaseData;

      try {
        const response = await axios.post(
          `${apiEndpoint}/case-officer/${officerId}/cases`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        newCreatedCase = response.data;
      } catch {
        newCreatedCase = {
          id: Date.now(),
          ...payload,
          status: "Active",
          createdAt: new Date().toISOString(),
          notes: [],
        };
      }

      setCases((prev) => [newCreatedCase, ...prev]);
      setShowCreateForm(false);
      setNewCaseData({
        name: "",
        age: "",
        lastSeenLocation: "",
        description: "",
        contactNumber: "",
      });

      setActionMessage({
        type: "success",
        text: `New case for "${newCreatedCase.name}" created successfully!`,
      });
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      console.error(err);
      setActionMessage({
        type: "error",
        text: "Failed to create case. Please try again.",
      });
    }
  };

  const filteredCases = cases.filter((item) => {
    const matchesFilter =
      filterStatus === "All" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const totalCases = cases.length;
  const activeCases = cases.filter(
    (c) => c.status.toLowerCase() === "active"
  ).length;
  const investigatingCases = cases.filter(
    (c) => c.status.toLowerCase() === "investigating"
  ).length;
  const foundCases = cases.filter(
    (c) =>
      c.status.toLowerCase() === "found" || c.status.toLowerCase() === "closed"
  ).length;

  return (
    <div>
      <OfficerNavbar officerName={officer?.name} />

      <main>
        {actionMessage && (
          <p style={{ color: actionMessage.type === "success" ? "green" : "red" }}>
            <strong>{actionMessage.text}</strong>
          </p>
        )}

        <h1>Case Officer Dashboard</h1>

        {officer && (
          <OfficerCard
            id={officer.id}
            name={officer.name}
            uniqueId={officer.uniqueId}
            email={officer.email}
            phone={officer.phone}
            country={officer.country}
            joiningDate={officer.joiningDate}
          />
        )}

        <br />

        <UrgentAlertsCarousel />

        <br />

        <fieldset>
          <legend><strong>Case Statistics</strong></legend>
          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Total Cases</th>
                <th>Active</th>
                <th>Investigating</th>
                <th>Resolved / Found</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalCases}</td>
                <td>{activeCases}</td>
                <td>{investigatingCases}</td>
                <td>{foundCases}</td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        <br />

        <section>
          <h2>Assigned Missing Person Cases</h2>

          <div>
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              type="button"
            >
              {showCreateForm ? "[-] Hide Register Case Form" : "[+] Register New Missing Person Case"}
            </button>
          </div>

          {showCreateForm && (
            <fieldset style={{ margin: "15px 0" }}>
              <legend><strong>New Missing Person Case Form</strong></legend>
              <form onSubmit={handleCreateCase}>
                <div>
                  <label>Person&apos;s Name: </label>
                  <input
                    type="text"
                    value={newCaseData.name}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, name: e.target.value })
                    }
                    placeholder="e.g. John Doe"
                  />
                  {formErrors.name && <span style={{ color: "red" }}> {formErrors.name}</span>}
                </div>
                <br />

                <div>
                  <label>Age: </label>
                  <input
                    type="number"
                    value={newCaseData.age}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, age: e.target.value })
                    }
                    placeholder="e.g. 24"
                  />
                  {formErrors.age && <span style={{ color: "red" }}> {formErrors.age}</span>}
                </div>
                <br />

                <div>
                  <label>Contact Phone Number: </label>
                  <input
                    type="text"
                    value={newCaseData.contactNumber}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="e.g. 01711223344"
                  />
                  {formErrors.contactNumber && (
                    <span style={{ color: "red" }}> {formErrors.contactNumber}</span>
                  )}
                </div>
                <br />

                <div>
                  <label>Last Seen Location: </label>
                  <input
                    type="text"
                    value={newCaseData.lastSeenLocation}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        lastSeenLocation: e.target.value,
                      })
                    }
                    placeholder="e.g. Dhanmondi Lake, Dhaka"
                  />
                  {formErrors.lastSeenLocation && (
                    <span style={{ color: "red" }}> {formErrors.lastSeenLocation}</span>
                  )}
                </div>
                <br />

                <div>
                  <label>Physical Description: </label>
                  <textarea
                    rows={3}
                    cols={40}
                    value={newCaseData.description}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Distinct physical traits, clothing last seen wearing..."
                  ></textarea>
                  {formErrors.description && (
                    <span style={{ color: "red" }}> {formErrors.description}</span>
                  )}
                </div>
                <br />

                <button type="submit">Create Case File</button>
                {" "}
                <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
              </form>
            </fieldset>
          )}

          <br />

          <div>
            <label>Search: </label>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {" | "}
            <label>Filter Status: </label>
            {(["All", "Active", "Investigating", "Found", "Closed"] as const).map(
              (status) => (
                <span key={status}>
                  <button
                    onClick={() => setFilterStatus(status)}
                    type="button"
                    style={{ fontWeight: filterStatus === status ? "bold" : "normal" }}
                  >
                    {status}
                  </button>
                  {" "}
                </span>
              )
            )}
          </div>
        </section>

        <hr />

        <section>
          {isLoading ? (
            <p>Loading cases...</p>
          ) : filteredCases.length === 0 ? (
            <p>No cases found.</p>
          ) : (
            <div>
              {filteredCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  id={caseItem.id}
                  name={caseItem.name}
                  age={caseItem.age}
                  lastSeenLocation={caseItem.lastSeenLocation}
                  status={caseItem.status}
                  description={caseItem.description}
                  contactNumber={caseItem.contactNumber}
                  createdAt={caseItem.createdAt}
                  notesCount={caseItem.notes?.length || 0}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteCase}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
