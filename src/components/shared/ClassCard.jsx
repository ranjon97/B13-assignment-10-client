import { Link } from "react-router-dom";
import { Clock, Users, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export function ClassCard({ fitnessClass }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-colors hover:border-pulse/40">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={fitnessClass.image}
          alt={fitnessClass.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-xs uppercase tracking-widest text-pulse backdrop-blur">
          {fitnessClass.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight tracking-wide text-paper">{fitnessClass.name}</h3>
        <p className="mt-1 text-sm text-muted">Trainer: {fitnessClass.trainer?.name || "IronPulse Coach"}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock size={13} /> {fitnessClass.duration}</span>
          <span className="flex items-center gap-1"><Users size={13} /> {fitnessClass.bookingCount || 0} booked</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
          <span className="font-display text-2xl text-pulse">{formatCurrency(fitnessClass.price)}</span>
          <Link
            to={`/classes/${fitnessClass._id}`}
            className="flex items-center gap-1 text-sm font-semibold text-paper transition-colors hover:text-pulse"
          >
            Details <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
