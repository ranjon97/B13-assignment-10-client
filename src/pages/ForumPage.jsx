import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { forumApi } from "@/api/index";
import { ForumPostCard } from "@/components/shared/ForumPostCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";

export function ForumPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function loadPosts() {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await forumApi.getPosts({ page, limit: 8 });
        if (!isCancelled) {
          setPosts(response.data);
          setMeta(response.meta);
        }
      } catch {
        if (!isCancelled) setHasError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    loadPosts();
    return () => {
      isCancelled = true;
    };
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">Community</span>
        <h1 className="mt-2 font-display text-4xl tracking-wide text-paper">Forum</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Insights and discussions from IronPulse trainers and admins. Log in to comment and vote.
        </p>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : hasError ? (
        <ErrorState message="We couldn't load forum posts right now." />
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Check back soon for new discussions." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <ForumPostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination meta={meta} onPageChange={(p) => setSearchParams({ page: p })} />
        </>
      )}
    </div>
  );
}
