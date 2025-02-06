
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translations } from "@/utils/translations";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { ArrowLeft, MessageCircle, ArrowUp } from "lucide-react";
import ShareReview from "@/components/ShareReview";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [language, setLanguage] = useState<"en" | "ru">(() => {
    return localStorage.getItem("language") as "en" | "ru" || "ru";
  });

  const { data: review, isLoading: reviewLoading } = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("slug", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, replies:comments!parent_id(*)")
        .eq("review_id", review?.id)
        .is("parent_id", null)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!review?.id,
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const locale = language === "en" ? enUS : ru;
    return format(dateObj, "d MMMM yyyy, HH:mm", { locale });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
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
      const { error } = await supabase.from("comments").insert({
        review_id: review?.id,
        name: isAnonymous ? null : name,
        content,
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
      setReplyTo(null);
      refetchComments();
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorOccurred,
        variant: "destructive",
      });
    }
  };

  const handleReply = (commentId: string, commentName: string) => {
    setReplyTo({ id: commentId, name: commentName });
    setContent(`@${commentName} `);
  };

  const scrollToComment = (commentId: string) => {
    const element = document.getElementById(`comment-${commentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.classList.add("bg-muted/50");
      setTimeout(() => element.classList.remove("bg-muted/50"), 2000);
    }
  };

  const t = translations[language];

  if (reviewLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (!review) {
    return <div className="p-8 text-center">{t.reviewNotFound}</div>;
  }

  const renderComment = (comment: any, isReply = false) => (
    <div
      key={comment.id}
      id={`comment-${comment.id}`}
      className={`p-4 rounded-lg border bg-card text-card-foreground transition-colors ${
        isReply ? "ml-8" : "ml-4"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">
          {comment.is_anonymous ? t.anonymousUser : comment.name || t.anonymousUser}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleReply(comment.id, comment.name || t.anonymousUser)}
            title={t.reply}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            {formatDate(comment.created_at!)}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">
        {comment.mention_name && (
          <button
            onClick={() => scrollToComment(comment.parent_id)}
            className="text-primary hover:underline inline-flex items-center gap-1 mr-1"
          >
            @{comment.mention_name} <ArrowUp className="h-3 w-3" />
          </button>
        )}
        {comment.content}
      </p>
      {comment.replies && comment.replies.map((reply: any) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-4xl px-4 mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.goBack}
          </Button>
          <ShareReview reviewId={id!} language={language} />
        </div>

        <div className="space-y-8">
          <div className="p-4 rounded-lg border bg-card text-card-foreground">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">
                {review.is_anonymous ? t.anonymousUser : review.name || t.anonymousUser}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(review.created_at!)}
              </div>
            </div>
            <p className="text-muted-foreground">{review.content}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t.comments}</h2>
            {comments?.map((comment) => renderComment(comment))}

            <form onSubmit={handleSubmitComment} className="space-y-4">
              {replyTo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {t.replyingTo} @{replyTo.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null);
                      setContent("");
                    }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
