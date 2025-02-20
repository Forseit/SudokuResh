
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareReview from "@/components/ShareReview";
import { translations } from "@/utils/translations";

interface ReviewListProps {
  reviews: any[];
  language: "en" | "ru";
}

const ReviewList = ({ reviews, language }: ReviewListProps) => {
  const navigate = useNavigate();
  const t = translations[language];
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const locale = language === "en" ? enUS : ru;
    return format(dateObj, "d MMMM yyyy, HH:mm", { locale });
  };

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div
          key={review.id}
          className="p-4 rounded-lg border bg-card text-card-foreground"
        >
          <div 
            className="cursor-pointer"
            onClick={() => navigate(`/reviews/${review.slug}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">
                {review.is_anonymous ? t.anonymousUser : review.name || t.anonymousUser}
              </div>
              <div className="flex items-center gap-2">
                <ShareReview reviewId={review.slug!} language={language} />
                <div className="text-sm text-muted-foreground">
                  {formatDate(review.created_at!)}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.content}</p>
          </div>

          {review.comments?.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{review.comments.length} {t.comments}</span>
              </div>
              
              {review.comments.slice(0, expandedReviews[review.id] ? undefined : 3).map((comment: any) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground ml-8"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {comment.is_anonymous ? t.anonymousUser : comment.name || t.anonymousUser}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(comment.created_at!)}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              ))}
              
              {review.comments.length > 3 && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(review.id);
                  }}
                >
                  {expandedReviews[review.id] ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      {t.showLess}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      {t.showMore}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
