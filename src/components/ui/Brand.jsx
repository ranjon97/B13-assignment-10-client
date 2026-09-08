export function PulseLine({ className = "", animate = true }) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={`w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points="0,20 60,20 80,20 95,4 110,36 125,20 145,20 220,20 240,20 255,8 270,32 285,20 305,20 400,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-pulse-draw" : ""}
        style={
          animate
            ? { strokeDasharray: 700, strokeDashoffset: 700 }
            : undefined
        }
      />
    </svg>
  );
}

export function RoleBadge({ role }) {
  const styles = {
    admin: "bg-signal/15 text-signal border-signal/30",
    trainer: "bg-pulse/15 text-pulse border-pulse/30",
    user: "bg-surface-raised text-muted border-border-subtle",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest ${styles[role] || styles.user}`}
    >
      {role}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
          <p className="mt-2 font-display text-4xl text-paper">{value}</p>
        </div>
        {Icon && <Icon size={22} className="text-pulse" strokeWidth={1.5} />}
      </div>
    </div>
  );
}
