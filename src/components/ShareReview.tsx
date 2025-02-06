
import { Button } from "@/components/ui/button";
import { Share2, Link2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface ShareReviewProps {
  reviewId: string;
  language: "en" | "ru";
}

const ShareReview = ({ reviewId, language }: ShareReviewProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/reviews/${reviewId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: language === "en" ? "Link copied to clipboard" : "Ссылка скопирована в буфер обмена",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: language === "en" ? "Failed to copy link" : "Не удалось скопировать ссылку",
      });
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
    vk: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(shareLinks.whatsapp, "_blank")}>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.telegram, "_blank")}>
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.vk, "_blank")}>
          VK
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          {language === "en" ? "Copy link" : "Скопировать"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareReview;
