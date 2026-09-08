import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { forumApi } from "@/api/index";
import { useAuth } from "@/context/AuthContext";
import { CommentThread } from "@/components/shared/CommentThread";
import { Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";

export function ForumPostDetailsPage() {
  const { id } = useParams();
  const { isBlocked } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const loadPostAndComments = async () => {
    const [postData, commentData, voteData] = await Promise.all([
      forumApi.getPost(id),
      forumApi.getComments(id),
      forumApi.getMyVote(id),
    ]);
    setPost(postData);
    setComments(commentData);
    setMyVote(voteData.vote);
  };

  useEffect(() => {
    setIsLoading(true);
    loadPostAndComments()
      .catch((err) => toast.error(err.message || "Failed to load post"))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleVote = async (type) => {
    if (isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }
    try {
      const updatedPost = await forumApi.castVote(id, type);
      setPost(updatedPost);
      setMyVote((prev) => (prev === type ? null : type));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateComment = async (postId, payload) => {
    if (isBlocked) {
      toast.error("Action restricted by Admin");
      throw new Error("blocked");
    }
    await forumApi.createComment(postId, payload);
    await loadPostAndComments();
  };

  const handleTopLevelComment = async () => {
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      await handleCreateComment(id, { content: newComment });
      setNewComment("");
    } catch (err) {
      if (err.message !== "blocked") toast.error(err.message);
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) return <PageSpinner />;
  if (!post) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <img src={post.image} alt={post.title} className="h-72 w-full rounded-2xl object-cover sm:h-96" />

      <div className="mt-8 flex items-center gap-3 text-sm text-muted">
        <img
          src={post.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "A")}`}
          alt={post.author?.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="font-medium text-paper">{post.author?.name}</span>
        <span>·</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      <h1 className="mt-4 font-display text-4xl tracking-wide text-paper">{post.title}</h1>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{post.description}</p>

      <div className="mt-8 flex items-center gap-3 border-y border-border-subtle py-4">
        <button
          onClick={() => handleVote("like")}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            myVote === "like" ? "border-pulse text-pulse" : "border-border-subtle text-muted hover:text-paper"
          }`}
        >
          <ThumbsUp size={15} /> {post.likeCount}
        </button>
        <button
          onClick={() => handleVote("dislike")}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            myVote === "dislike" ? "border-signal text-signal" : "border-border-subtle text-muted hover:text-paper"
          }`}
        >
          <ThumbsDown size={15} /> {post.dislikeCount}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl tracking-wide text-paper">
          Comments ({comments.length})
        </h2>

        <div className="mt-4 flex flex-col gap-2">
          <Textarea
            rows={3}
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleTopLevelComment} isLoading={isPosting} className="self-end">
            Post Comment
          </Button>
        </div>

        <div className="mt-8">
          <CommentThread
            comments={comments}
            postId={id}
            onCreateReply={handleCreateComment}
            onChanged={loadPostAndComments}
          />
        </div>
      </div>
    </div>
  );
}
