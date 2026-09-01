import React from "react";

export type NoteItem = {
  noteText: string;
  addedBy: string;
  date: string;
};

export type CaseNotesListProps = {
  notes?: NoteItem[];
};

export default function CaseNotesList({ notes = [] }: CaseNotesListProps) {
  if (!notes || notes.length === 0) {
    return <p><em>No investigation notes recorded yet.</em></p>;
  }

  return (
    <ul>
      {notes.map((note, index) => {
        const formattedDate = note.date
          ? new Date(note.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A";

        return (
          <li key={index}>
            <p>{note.noteText}</p>
            <small>
              Added by: <strong>{note.addedBy}</strong> on {formattedDate}
            </small>
            <hr />
          </li>
        );
      })}
    </ul>
  );
}
