import { InlineSpinner } from "./Spinner";

const VARIANTS = {
  primary: "bg-pulse text-ink hover:bg-pulse-dim",
  secondary: "bg-surface-raised text-paper border border-border-subtle hover:border-pulse/50",
  danger: "bg-signal text-paper hover:bg-signal/85",
  ghost: "bg-transparent text-paper hover:bg-surface-raised",
};

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {isLoading && <InlineSpinner />}
      {children}
    </button>
  );
}
