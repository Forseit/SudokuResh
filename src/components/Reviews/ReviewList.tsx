
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import ShareReview from "@/components/ShareReview";
import { translations } from "@/utils/translations";

interface ReviewListProps {
  reviews: any[];
  language: "en" | "ru";
}

const ReviewList = ({ reviews, language }: ReviewListProps) => {
  const navigate = useNavigate();
  const t = translations[language];

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const locale = language === "en" ? enUS : ru;
    return format(dateObj, "d MMMM yyyy, HH:mm", { locale });
  };

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div
          key={review.id}
          className="p-4 rounded-lg border bg-card text-card-foreground"
          onClick={() => navigate(`/reviews/${review.slug}`)}
          role="button"
          tabIndex={0}
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
      ))}
    </div>
  );
};

export default ReviewList;
