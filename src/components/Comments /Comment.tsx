
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { translations } from "@/utils/translations";

interface CommentProps {
  comment: any;
  language: "en" | "ru";
  formatDate: (date: string) => string;
  onReply: (commentId: string, commentName: string) => void;
  onScrollToComment: (commentId: string) => void;
}

const Comment = ({
  comment,
  language,
  formatDate,
  onReply,
  onScrollToComment,
}: CommentProps) => {
  const t = translations[language];

  const renderReplies = (replies: any[]) => {
    if (!replies) return null;
    return replies.map((reply: any) => (
      <div key={reply.id} className="ml-6">
        <Comment
          comment={reply}
          language={language}
          formatDate={formatDate}
          onReply={onReply}
          onScrollToComment={onScrollToComment}
        />
        {reply.replies && renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className="space-y-4 mt-4"
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="font-medium">
            {comment.is_anonymous ? t.anonymousUser : comment.name || t.anonymousUser}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReply(comment.id, comment.name || t.anonymousUser)}
              title={t.reply}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              {formatDate(comment.created_at!)}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          {comment.content}
        </p>
      </div>

      {comment.replies && renderReplies(comment.replies)}
    </div>
  );
};

export default Comment;
