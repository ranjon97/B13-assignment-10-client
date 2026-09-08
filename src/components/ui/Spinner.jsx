export function PageSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-border-subtle border-t-pulse" />
      </div>
    </div>
  );
}

export function InlineSpinner({ className = "" }) {
  return (
    <div
      className={`h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink ${className}`}
    />
  );
}
