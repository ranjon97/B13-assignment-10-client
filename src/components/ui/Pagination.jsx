import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, hasPrevPage, hasNextPage } = meta;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-paper transition-colors hover:border-pulse disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="font-mono text-sm text-muted">
        Page <span className="text-paper">{page}</span> / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-paper transition-colors hover:border-pulse disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
