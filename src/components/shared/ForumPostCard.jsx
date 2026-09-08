import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { truncate, formatDate } from "@/utils/format";

export function ForumPostCard({ post }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-colors hover:border-pulse/40">
      <div className="h-44 w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <img
            src={post.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "A")}`}
            alt={post.author?.name}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span>{post.author?.name}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-tight tracking-wide text-paper">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{truncate(post.description, 100)}</p>
        <Link
          to={`/forum/${post._id}`}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-paper transition-colors hover:text-pulse"
        >
          Read More <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
