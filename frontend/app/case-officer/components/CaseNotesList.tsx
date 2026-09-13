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
    return (
      <p className="text-sm text-slate-400 italic py-4 text-center">
        No investigation notes recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
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
          <div
            key={index}
            className="rounded-xl bg-slate-50 border border-slate-200 p-4"
          >
            <p className="text-sm text-slate-800 leading-relaxed mb-2">
              {note.noteText}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                {note.addedBy}
              </span>
              <span>·</span>
              <span>{formattedDate}</span>
              <span className="ml-auto text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Note #{index + 1}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
