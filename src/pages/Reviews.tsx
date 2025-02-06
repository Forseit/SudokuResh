
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/utils/translations";
import { AdManager } from "@/components/Advertisement/AdManager";
import { useReviews } from "@/hooks/useReviews";
import ThemeToggle from "@/components/Reviews/ThemeToggle";
import LanguageSelector from "@/components/Reviews/LanguageSelector";
import ReviewForm from "@/components/Reviews/ReviewForm";
import ReviewList from "@/components/Reviews/ReviewList";

const Reviews = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "ru">(() => {
    return localStorage.getItem("language") as "en" | "ru" || "ru";
  });

  const { data: reviews, refetch } = useReviews();

  const handleLanguageChange = (newLang: "en" | "ru") => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-4xl px-4 mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.goBack}
            </Button>
            <h1 className="text-3xl font-bold">{t.reviews}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector 
              language={language} 
              onLanguageChange={handleLanguageChange} 
            />
            <ThemeToggle />
          </div>
        </div>

        <ReviewForm language={language} onSuccess={refetch} />

        <AdManager />

        <ReviewList reviews={reviews || []} language={language} />
      </div>
    </div>
  );
};

export default Reviews;
