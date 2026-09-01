import React from "react";

export type OfficerCardProps = {
  id?: number;
  name: string;
  uniqueId?: string;
  email: string;
  phone?: string;
  country?: string;
  joiningDate?: string;
};

export default function OfficerCard({
  id,
  name,
  uniqueId,
  email,
  phone,
  country,
  joiningDate,
}: OfficerCardProps) {
  const formattedDate = joiningDate
    ? new Date(joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <fieldset>
      <legend><strong>Case Officer Profile (Props Component)</strong></legend>
      <h2>{name || "Case Officer"}</h2>
      <p><strong>Officer ID:</strong> {uniqueId || `#${id || "CO-01"}`}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone || "Not provided"}</p>
      <p><strong>Country / District:</strong> {country || "Unknown"}</p>
      {joiningDate && <p><strong>Joined:</strong> {formattedDate} (Active Duty)</p>}
    </fieldset>
  );
}
