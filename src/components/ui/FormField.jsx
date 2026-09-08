export function FormField({ label, error, children, htmlFor }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-muted">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs font-medium text-signal">{error}</p>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-paper placeholder:text-muted/60 outline-none transition-colors focus:border-pulse ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-paper placeholder:text-muted/60 outline-none transition-colors focus:border-pulse ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-pulse ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
