
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translations } from "@/utils/translations";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import ShareReview from "@/components/ShareReview";
import ThemeToggle from "@/components/Reviews/ThemeToggle";
import LanguageSelector from "@/components/Reviews/LanguageSelector";
import CommentForm from "@/components/Comments/CommentForm";
import Comment from "@/components/Comments/Comment";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      // Recursively fetch all comments and their replies
      const fetchCommentsRecursive = async (parentId: string | null = null): Promise<any[]> => {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("review_id", review?.id)
          .eq("parent_id", parentId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (!data) return [];

        const commentsWithReplies = await Promise.all(
          data.map(async (comment) => {
            const replies = await fetchCommentsRecursive(comment.id);
            return { ...comment, replies };
          })
        );

        return commentsWithReplies;
      };

      return fetchCommentsRecursive(null);
    },
    enabled: !!review?.id,
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const locale = language === "en" ? enUS : ru;
    return format(dateObj, "d MMMM yyyy, HH:mm", { locale });
  };

  const t = translations[language];

  if (reviewLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (!review) {
    return <div className="p-8 text-center">{t.reviewNotFound}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-4xl px-4 mx-auto py-8">
        <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
          <LanguageSelector 
            language={language} 
            onLanguageChange={(newLang) => {
              setLanguage(newLang);
              localStorage.setItem("language", newLang);
            }} 
          />
          <ThemeToggle />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold mb-4">{t.reviews}</h1>
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.goBack}
              </Button>
            </div>
          </div>
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
            {comments?.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                language={language}
                formatDate={formatDate}
                onReply={(commentId, commentName) => {
                  setReplyTo({ id: commentId, name: commentName });
                }}
                onScrollToComment={(commentId) => {
                  const element = document.getElementById(`comment-${commentId}`);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    element.classList.add("bg-muted/50");
                    setTimeout(() => element.classList.remove("bg-muted/50"), 2000);
                  }
                }}
              />
            ))}

            <CommentForm
              reviewId={review.id}
              language={language}
              replyTo={replyTo}
              onCommentSubmitted={refetchComments}
              onCancelReply={() => setReplyTo(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
