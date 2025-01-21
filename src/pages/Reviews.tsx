"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import axios from "axios";
import VKAuth from './VKAuth';

interface VKUser {
  first_name: string;
  last_name: string;
  avatar_url: string;
  vk_user_id: string;
}

const Reviews = () => {
  const [vkUser, setVkUser] = useState<VKUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || (!name.trim() && !isAnonymous)) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/reviews", {
        name: isAnonymous ? "Аноним" : vkUser?.first_name + " " + vkUser?.last_name || name,
        email,
        message,
      });

      alert("Ваш отзыв успешно отправлен!");
      setName("");
      setEmail("");
      setMessage("");
      setIsAnonymous(false);
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      alert("Не удалось отправить отзыв. Попробуйте еще раз позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-8">
      {!vkUser && (
        <VKAuth
          onAuth={(user) => {
            setVkUser(user);
          }}
        />
      )}

      {vkUser && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <img
            src={vkUser.avatar_url}
            alt="VK Profile"
            className="w-8 h-8 rounded-full"
          />
          <span>{vkUser.first_name} {vkUser.last_name}</span>
        </div>
      )}

      {!isAnonymous && !vkUser && (
        <Input
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <Input
        placeholder="Ваш email (необязательно)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Textarea
        placeholder="Ваш отзыв"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <label htmlFor="anonymous">Оставить отзыв анонимно</label>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить отзыв"}
      </Button>
    </div>
  );
};

export default Reviews;
