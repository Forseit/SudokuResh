
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translations } from "@/utils/translations";

interface CommentFormProps {
  reviewId: string;
  language: "en" | "ru";
  replyTo: { id: string; name: string } | null;
  onCommentSubmitted: () => void;
  onCancelReply: () => void;
}

const CommentForm = ({ 
  reviewId, 
  language, 
  replyTo, 
  onCommentSubmitted,
  onCancelReply 
}: CommentFormProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: t.error,
        description: t.reviewRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      const commentContent = replyTo ? `${replyTo.name}${t.to} ${content}` : content;

      const { error } = await supabase.from("comments").insert({
        review_id: reviewId,
        name: isAnonymous ? null : name,
        content: commentContent,
        is_anonymous: isAnonymous,
        parent_id: replyTo?.id || null,
        mention_name: replyTo?.name || null,
      });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.commentSubmitted,
      });

      setName("");
      setContent("");
      setIsAnonymous(false);
      onCommentSubmitted();
      if (replyTo) onCancelReply();
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorOccurred,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {replyTo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {t.replyingTo} @{replyTo.name}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
          >
            {t.cancel}
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <Input
          placeholder={t.yourName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAnonymous}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder={t.yourComment}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
        />
        <label
          htmlFor="anonymous"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t.anonymous}
        </label>
      </div>
      <Button type="submit">{t.submitComment}</Button>
    </form>
  );
};

export default CommentForm;
