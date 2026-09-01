import React from "react";
import Link from "next/link";
import CaseStatusBadge from "./CaseStatusBadge";

export type CaseCardProps = {
  id: number;
  name: string;
  age: number;
  lastSeenLocation: string;
  status: string;
  description: string;
  contactNumber: string;
  createdAt?: string;
  notesCount?: number;
  onStatusChange?: (id: number, newStatus: string) => void;
  onDelete?: (id: number) => void;
};

export default function CaseCard({
  id,
  name,
  age,
  lastSeenLocation,
  status,
  description,
  contactNumber,
  createdAt,
  notesCount = 0,
  onStatusChange,
  onDelete,
}: CaseCardProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <fieldset style={{ margin: "10px 0" }}>
      <legend>
        <strong>
          <Link href={`/case-officer/cases/${id}`}>{name}</Link> ({age} yrs)
        </strong>{" "}
        - <CaseStatusBadge status={status} />
      </legend>
      <p><strong>Reported:</strong> {formattedDate}</p>
      <p><strong>Last Seen:</strong> {lastSeenLocation}</p>
      <p><strong>Contact:</strong> {contactNumber}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Notes:</strong> {notesCount} logged</p>

      <div>
        {onStatusChange && (
          <>
            <label>Update Status: </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Found">Found</option>
              <option value="Closed">Closed</option>
            </select>
            {" "}
          </>
        )}

        <Link href={`/case-officer/cases/${id}`}>[View Full Details]</Link>
        {" "}

        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            type="button"
          >
            Delete Case
          </button>
        )}
      </div>
    </fieldset>
  );
}
