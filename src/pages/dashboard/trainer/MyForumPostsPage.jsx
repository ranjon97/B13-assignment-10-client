import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Newspaper, Trash2 } from "lucide-react";
import { forumApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/Modal";
import { formatDate } from "@/utils/format";

export function MyForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    forumApi.getMyPosts().then(setPosts).finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await forumApi.deleteOwnPost(deletingPost._id);
      setPosts((prev) => prev.filter((p) => p._id !== deletingPost._id));
      toast.success("Post deleted");
      setDeletingPost(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div>
      <DashboardHeader title="My Forum Posts" description="Posts you've published to the community." />

      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Share your first post with the community." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
              <img src={post.image} alt={post.title} className="h-36 w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold text-paper">{post.title}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(post.createdAt)}</p>
                <button
                  onClick={() => setDeletingPost(post)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-signal hover:underline"
                >
                  <Trash2 size={13} /> Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingPost)}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Post"
        description={`Delete "${deletingPost?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
