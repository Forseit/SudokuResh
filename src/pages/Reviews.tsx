import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { Moon, Sun, Languages, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { translations } from "@/utils/translations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdManager } from "@/components/Advertisement/AdManager";
import { format } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Reviews = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [language, setLanguage] = useState<"en" | "ru">(() => {
    return localStorage.getItem("language") as "en" | "ru" || "ru";
  });

  const { data: reviews, refetch } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const locale = language === "en" ? enUS : ru;
    return format(dateObj, "d MMMM yyyy, HH:mm", { locale });
  };

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
      const { error } = await supabase.from("reviews").insert({
        name: isAnonymous ? null : name,
        content,
        is_anonymous: isAnonymous,
      });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.reviewSubmitted,
      });

      setName("");
      setContent("");
      setIsAnonymous(false);
      refetch();
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorOccurred,
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Languages className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 text-xs font-medium">
                    {language.toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange("ru")}>
                  Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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
              placeholder={t.yourReview}
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
          <Button type="submit">{t.submit}</Button>
        </form>

        <AdManager />

        <div className="space-y-4">
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
