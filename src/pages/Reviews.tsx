import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, User, X } from "lucide-react";
import { VKAuth } from "@/components/VKAuth";

const Reviews = () => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [vkUser, setVkUser] = useState<{
    firstName: string;
    lastName: string;
    photo: string;
    userId: string;
  } | null>(null);
  const { toast } = useToast();

  const { data: reviews = [], refetch } = useQuery({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, введите текст отзыва",
      });
      return;
    }

    try {
      const { error } = await supabase.from("reviews").insert({
        name: isAnonymous ? null : vkUser ? `${vkUser.firstName} ${vkUser.lastName}` : name,
        content,
        is_anonymous: isAnonymous,
        vk_user_id: vkUser?.userId,
        vk_profile_photo: vkUser?.photo,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Вы уже оставили отзыв. Авторизуйтесь через ВКонтакте, чтобы оставить больше отзывов.",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Успешно",
        description: "Ваш отзыв успешно добавлен",
      });

      setName("");
      setContent("");
      setIsAnonymous(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось добавить отзыв",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Отзыв удален",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить отзыв",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к игре
        </Link>

        <h1 className="text-3xl font-bold mb-8">Отзывы</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Оставить отзыв</h2>
            <VKAuth onAuth={setVkUser} />
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAnonymous && !vkUser && (
                <Input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Textarea
                placeholder="Ваш отзыв"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Анонимно
                </label>
              </div>
              <Button type="submit">Отправить отзыв</Button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Все отзывы</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border bg-card text-card-foreground relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleDelete(review.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 mb-2">
                    {review.vk_profile_photo ? (
                      <img
                        src={review.vk_profile_photo}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 p-1.5 bg-muted rounded-full" />
                    )}
                    <div>
                      <div className="font-medium">
                        {review.is_anonymous ? "Анонимно" : review.name || "Гость"}
                      </div>
                      {!review.vk_user_id && !review.is_anonymous && (
                        <div className="text-sm text-muted-foreground">
                          Не авторизован
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(review.created_at!).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-muted-foreground">Пока нет отзывов</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
