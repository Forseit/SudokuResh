
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translations } from "@/utils/translations";

interface ReviewFormProps {
  language: "en" | "ru";
  onSuccess: () => void;
}

const ReviewForm = ({ language, onSuccess }: ReviewFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
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
      const { count, error: countError } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      const nextSlug = String((count || 0) + 1);

      const { error } = await supabase
        .from("reviews")
        .insert({
          name: isAnonymous ? null : name,
          content,
          is_anonymous: isAnonymous,
          slug: nextSlug,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t.success,
        description: t.reviewSubmitted,
      });

      setName("");
      setContent("");
      setIsAnonymous(false);
      onSuccess();
    } catch (error) {
      toast({
        title: t.error,
        description: t.errorOccurred,
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default ReviewForm;
