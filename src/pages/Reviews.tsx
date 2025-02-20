
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Navigation, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations } from "@/utils/translations";
import { AdManager } from "@/components/Advertisement/AdManager";
import { useReviews } from "@/hooks/useReviews";
import ThemeToggle from "@/components/Reviews/ThemeToggle";
import LanguageSelector from "@/components/Reviews/LanguageSelector";
import ReviewForm from "@/components/Reviews/ReviewForm";
import ReviewList from "@/components/Reviews/ReviewList";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-4xl px-4 mx-auto py-8 flex-grow">
        <div className="flex items-center gap-4">
          <img src="https://i.imgur.com/qGmOQDj.png" alt="Logo" className="h-8 w-8" />
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

        <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
          <LanguageSelector 
            language={language} 
            onLanguageChange={handleLanguageChange} 
          />
          <ThemeToggle />
        </div>

        <ReviewForm language={language} onSuccess={refetch} />

        <AdManager />

        <ReviewList reviews={reviews || []} language={language} />
      </div>
      <Footer t={t} />
    </div>
  );
};

export default Reviews;
