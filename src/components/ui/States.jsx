export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface/50 px-6 py-16 text-center">
      {Icon && <Icon size={36} className="mb-4 text-muted" strokeWidth={1.5} />}
      <h3 className="text-lg font-semibold text-paper">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again." }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-signal/30 bg-signal/5 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-paper">We hit a snag</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
    </div>
  );
}
