// src/news/NewsApp.tsx
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchComments, type Comment } from "@api/news/newsApi";
import { toast } from "react-toastify";

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Reply type definition
interface Reply {
  id: string;
  text: string;
  timestamp: Date;
}

// Reply Modal Component
const ReplyModal = ({
  isOpen,
  onClose,
  onSend,
  commentName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reply: string) => void;
  commentName: string;
}) => {
  const [replyText, setReplyText] = useState("");

  if (!isOpen) return null;

  const handleSend = () => {
    if (replyText.trim()) {
      onSend(replyText);
      setReplyText("");
      onClose();
    } else {
      toast.warning("Please write a reply before sending");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Reply to {commentName}
        </h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply here..."
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none mt-4"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSend}
            className="flex-1 px-4 py-2 bg-primary text-gray-800 rounded-lg hover:opacity-80 transition-colors font-medium"
          >
            Send Reply
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:opacity-80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirm Delete Modal
const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Delete Reply
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete this reply? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:opacity-80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Share Modal Component
const ShareModal = ({
  isOpen,
  onClose,
  comment,
}: {
  isOpen: boolean;
  onClose: () => void;
  comment: Comment;
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;
  const shareText = `${comment.name} said: "${comment.body.substring(0, 100)}..."`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Comment copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Comment from ${comment.name}`,
          text: comment.body,
          url: shareUrl,
        })
        .then(() => {
          toast.success("Shared successfully!");
          onClose();
        })
        .catch((err) => {
          console.log("Share cancelled or failed:", err);
        });
    } else {
      toast.info("Native sharing not supported, use copy instead");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Share Comment
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Share this comment with others
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <span className="text-xl">🔗</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white">
                Copy Link
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Copy comment link to clipboard
              </p>
            </div>
            {copied && (
              <span className="text-green-500 text-sm">✓ Copied!</span>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <span className="text-xl">📋</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white">
                Copy Text
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Copy comment content to clipboard
              </p>
            </div>
          </button>

          {typeof navigator.share === "function" && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors text-left"
            >
              <span className="text-xl">📱</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  Native Share
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use system share dialog
                </p>
              </div>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:opacity-80 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Comment Card Component
const CommentCard = ({
  comment,
  index,
}: {
  comment: Comment;
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    toast.success(isLiked ? "Removed like" : "Liked!");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(comment.email);
    toast.success("Email copied to clipboard!");
  };

  const handleReply = () => {
    setIsReplyModalOpen(true);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleSendReply = (replyText: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      text: replyText,
      timestamp: new Date(),
    };
    setReplies((prev) => [...prev, newReply]);
    toast.success(`Reply sent to ${comment.name}!`);
  };

  const handleDeleteReply = (replyId: string) => {
    setReplyToDelete(replyId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteReply = () => {
    if (replyToDelete) {
      setReplies((prev) => prev.filter((reply) => reply.id !== replyToDelete));
      toast.success("Reply deleted successfully!");
      setDeleteModalOpen(false);
      setReplyToDelete(null);
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden text-left"
        style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full ${getAvatarColor(comment.name)} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}
            >
              {getInitials(comment.name)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {comment.name}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                  Post #{comment.postId}
                </span>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  Comment #{comment.id}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  📧 {comment.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-primary"
                  title="Copy email"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 pl-16">
            <p
              className={`text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded && "line-clamp-3"}`}
            >
              {comment.body}
            </p>

            {comment.body.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm text-primary hover:underline focus:outline-none"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="mt-4 pl-16">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Replies ({replies.length}):
                </p>
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="group/reply text-sm text-gray-600 dark:text-gray-300 py-2 border-b border-gray-200 dark:border-gray-600 last:border-0 flex items-start justify-between gap-2"
                  >
                    <div className="flex-1">
                      <span>💬 {reply.text}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatTime(reply.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="opacity-0 group-hover/reply:opacity-100 transition-opacity text-red-500 hover:text-red-600 text-xs px-2"
                      title="Delete reply"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 pl-16 flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
              <span className={`${isLiked ? "text-red-500" : ""}`}>
                {likes}
              </span>
            </button>

            <button
              onClick={handleReply}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <span>💬</span>
              <span>Reply</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <span>🔗</span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSend={handleSendReply}
        commentName={comment.name}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        comment={comment}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteReply}
      />
    </>
  );
};

// Main News Component
export const NewsApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name" | "email">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const {
    data: comments,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () => fetchComments(20),
    staleTime: 5 * 60 * 1000,
  });

  // Filter and sort comments
  const filteredComments = useMemo(() => {
    if (!comments) return [];

    let filtered = [...comments];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.name.toLowerCase().includes(term) ||
          comment.email.toLowerCase().includes(term) ||
          comment.body.toLowerCase().includes(term),
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "id") comparison = a.id - b.id;
      else if (sortBy === "name") comparison = a.name.localeCompare(b.name);
      else if (sortBy === "email") comparison = a.email.localeCompare(b.email);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [comments, searchTerm, sortBy, sortOrder]);

  const stats = useMemo(() => {
    if (!comments) return null;
    return {
      total: comments.length,
      uniqueAuthors: new Set(comments.map((c) => c.email)).size,
      totalPosts: new Set(comments.map((c) => c.postId)).size,
    };
  }, [comments]);

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-4">😞</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Unable to Load News
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            There was an error loading the comments. Please check your
            connection.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary text-gray-800 rounded-lg hover:opacity-80 transition-all font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-8 text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">📰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            News Feed
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with the latest discussions from the community
          </p>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Comments
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.uniqueAuthors}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Contributors
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {stats.totalPosts}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Discussions
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or content..."
                className="w-full px-4 py-2.5 pl-11 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="id">Sort by ID</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>

              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {viewMode === "list" ? "⊞ Grid View" : "≡ List View"}
              </button>

              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="px-4 py-2.5 bg-primary text-gray-800 rounded-xl hover:opacity-80 transition-colors font-medium flex items-center gap-2"
              >
                {isFetching ? "⟳" : "↻"} Refresh
              </button>
            </div>
          </div>

          {/* Results info */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center flex-wrap gap-2">
            <span>
              {searchTerm ? (
                <>
                  Found{" "}
                  <strong className="text-primary">
                    {filteredComments.length}
                  </strong>{" "}
                  result{filteredComments.length !== 1 && "s"} for "
                  <strong>{searchTerm}</strong>"
                </>
              ) : (
                <>
                  Showing{" "}
                  <strong className="text-primary">
                    {filteredComments.length}
                  </strong>{" "}
                  comments
                </>
              )}
            </span>
            {isFetching && (
              <span className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                Updating...
              </span>
            )}
          </div>
        </div>

        {/* Comments Grid/List */}
        {filteredComments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No comments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search terms
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-primary text-gray-800 rounded-lg hover:opacity-80"
            >
              Clear search
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment, index) => (
              <CommentCard key={comment.id} comment={comment} index={index} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>
            💡 Tip: Click "Read more" to expand long comments • Use search to
            filter • Sort by different fields
          </p>
          <p className="mt-1">
            📊 Total comments loaded: {filteredComments.length}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-none {
          -webkit-line-clamp: unset;
        }
      `}</style>
    </div>
  );
};
