import { useState } from "react";
import toast from "react-hot-toast";
import { CornerDownRight, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { commentApi } from "@/api/index";
import { Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/format";

export function CommentThread({ comments, postId, onCreateReply, onChanged }) {
  const topLevel = comments.filter((c) => !c.parentComment);
  const repliesFor = (id) => comments.filter((c) => c.parentComment === id);

  return (
    <div className="flex flex-col gap-6">
      {topLevel.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          replies={repliesFor(comment._id)}
          postId={postId}
          onCreateReply={onCreateReply}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}

function CommentItem({ comment, replies, postId, onCreateReply, onChanged }) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOwner = user?.id === comment.author?._id;

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateReply(postId, { content: replyText, parentComment: comment._id });
      setReplyText("");
      setIsReplying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!editText.trim()) return;
    setIsSubmitting(true);
    try {
      await commentApi.update(comment._id, editText);
      toast.success("Comment updated");
      setIsEditing(false);
      onChanged();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await commentApi.remove(comment._id);
      toast.success("Comment deleted");
      onChanged();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        <img
          src={comment.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || "U")}`}
          alt={comment.author?.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-paper">{comment.author?.name}</span>
            <span className="text-xs text-muted">{formatDate(comment.createdAt)}</span>
            {comment.editedAt && <span className="text-xs text-muted">(edited)</span>}
          </div>

          {isEditing ? (
            <div className="mt-2 flex flex-col gap-2">
              <Textarea rows={2} value={editText} onChange={(e) => setEditText(e.target.value)} />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={submitEdit} isLoading={isSubmitting}>
                  <Check size={14} /> Save
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  <X size={14} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted">{comment.content}</p>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            <button onClick={() => setIsReplying((v) => !v)} className="flex items-center gap-1 hover:text-pulse">
              <CornerDownRight size={13} /> Reply
            </button>
            {isOwner && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 hover:text-pulse">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={handleDelete} className="flex items-center gap-1 hover:text-signal">
                  <Trash2 size={13} /> Delete
                </button>
              </>
            )}
          </div>

          {isReplying && (
            <div className="mt-3 flex flex-col gap-2">
              <Textarea
                rows={2}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={submitReply} isLoading={isSubmitting}>Post Reply</Button>
                <Button variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12 mt-4 flex flex-col gap-4 border-l border-border-subtle pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={[]}
              postId={postId}
              onCreateReply={onCreateReply}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}
