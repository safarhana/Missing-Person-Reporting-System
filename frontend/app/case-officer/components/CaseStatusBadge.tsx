import React from "react";

export type CaseStatusBadgeProps = {
  status: string;
};

export default function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  return (
    <span>
      <strong>[{status || "Active"}]</strong>
    </span>
  );
}
