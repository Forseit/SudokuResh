import { useEffect, useRef, useState } from 'react';
import { User } from 'lucide-react';

declare global {
  interface Window {
    VKIDSDK: any;
  }
}

interface VKAuthProps {
  onAuth: (userData: { 
    first_name: string;
    last_name: string;
    avatar_url: string;
    vk_user_id: string;
  }) => void;
}

export const VKAuth = ({ onAuth }: VKAuthProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://id.vk.com/js/sdk/vkid.js';
    script.async = true;
    script.onload = () => {
      // Ensure the SDK is fully loaded before initialization
      setTimeout(initVK, 100);
    };
    script.onerror = () => {
      setError('Ошибка загрузки VK ID SDK');
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initVK = () => {
    if (!window.VKIDSDK) {
      setError('VK ID SDK не загружен');
      setIsLoading(false);
      return;
    }

    try {
      const VKID = window.VKIDSDK;

      VKID.init({
        app: 52942639,
        redirectUrl: window.location.origin + '/reviews'
      });

      const oneTap = new VKID.OneTap({
        container: containerRef.current,
        showAlternativeLogin: true,
        styles: {
          borderRadius: 16,
          width: 285
        },
        onAuth: (data: any) => {
          onAuth({
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            avatar_url: data.user.avatar_url,
            vk_user_id: data.user.id.toString()
          });
        },
        onError: (error: any) => {
          console.error('VK Auth Error:', error);
          setError('Ошибка авторизации через VK ID');
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('VK Init Error:', err);
      setError('Ошибка инициализации VK ID');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-5 w-5" />
          Загрузка VK ID...
        </div>
      )}
      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
};
