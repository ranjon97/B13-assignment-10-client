import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessagesSquare, Trash2 } from "lucide-react";
import { forumApi } from "@/api/index";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { EmptyState } from "@/components/ui/States";
import { PageSpinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/Modal";
import { formatDate } from "@/utils/format";

export function ForumModerationPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = () => forumApi.getAllForModeration().then(setPosts).finally(() => setIsLoading(false));

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await forumApi.adminDeletePost(deletingPost._id);
      setPosts((prev) => prev.filter((p) => p._id !== deletingPost._id));
      toast.success("Post removed");
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
      <DashboardHeader title="Forum Moderation" description="Remove posts that violate community guidelines." />

      {posts.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No forum posts to moderate" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Published</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-5 py-4 font-medium text-paper">{post.title}</td>
                  <td className="px-5 py-4 text-muted">{post.author?.name}</td>
                  <td className="px-5 py-4 text-muted">{formatDate(post.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setDeletingPost(post)}
                      className="flex items-center gap-1.5 text-xs font-medium text-signal hover:underline"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingPost)}
        onClose={() => setDeletingPost(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Remove Post"
        description={`Permanently remove "${deletingPost?.title}"?`}
      />
    </div>
  );
}
