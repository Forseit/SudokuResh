
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PopupAdProps {
  imageUrl: string;
  targetUrl: string;
  countdownSeconds: number;
  onClose: () => void;
  title?: string;
  description?: string;
}

const PopupAd = ({ 
  imageUrl, 
  targetUrl, 
  countdownSeconds, 
  onClose,
  title,
  description 
}: PopupAdProps) => {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleImageClick = () => {
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="relative max-w-2xl w-full mx-4">
        {countdown === 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 z-10 bg-background hover:bg-background/90 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title || "Advertisement"}
            className="w-full h-auto cursor-pointer"
            onClick={handleImageClick}
          />
          {countdown > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full">
              {countdown}s
            </div>
          )}
          {(title || description) && (
            <div className="p-4 bg-background">
              {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PopupAd;
