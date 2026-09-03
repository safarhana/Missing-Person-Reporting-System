import React from "react";

type AdminCardProps = {
  title?: string;
  name?: string;
  role?: string;
  value?: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: "success" | "warning" | "danger" | "info";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function AdminCard({
  title,
  name,
  role,
  value,
  subtitle,
  badge,
  badgeType = "info",
  icon,
  children,
  className = "",
}: AdminCardProps) {
  const badgeClasses = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-pink-50 text-pink-700 border-pink-200",
  }[badgeType];

  return (
    <div
      className={`card rounded-xl border border-pink-100 bg-white p-5 shadow-xs transition-all hover:border-pink-200 hover:shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>}
          {name && <h2 className="text-lg font-bold text-slate-900 mt-1">{name}</h2>}
          {value !== undefined && (
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {value}
            </div>
          )}
          {role && <p className="text-xs text-pink-600 font-medium mt-0.5">{role}</p>}
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-600 border border-pink-100">
              {icon}
            </div>
          )}
          {badge && (
            <span
              className={`badge badge-sm inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClasses}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {children && <div className="mt-4 pt-3 border-t border-pink-100">{children}</div>}
    </div>
  );
}