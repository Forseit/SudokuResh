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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@vkid/sdk@1.1.0/dist-sdk/umd/index.js';
    script.async = true;
    script.onload = initVK;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initVK = () => {
    if ('VKIDSDK' in window && containerRef.current) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 52942639,
        redirectUrl: window.location.origin + '/reviews',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
      });

      const oneTap = new VKID.OneTap();

      oneTap.render({
        container: containerRef.current,
        showAlternativeLogin: true,
        styles: {
          borderRadius: 16,
          width: 285
        }
      })
      .on(VKID.WidgetEvents.ERROR, (error: any) => {
        console.error('VK Auth Error:', error);
      })
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
        VKID.Auth.exchangeCode(payload.code, payload.device_id)
          .then((data: any) => {
            onAuth({
              first_name: data.user.first_name,
              last_name: data.user.last_name,
              avatar_url: data.user.avatar_url,
              vk_user_id: data.user.id.toString()
            });
          })
          .catch((error: any) => {
            console.error('VK Auth Exchange Error:', error);
          });
      });

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
      <div ref={containerRef} />
    </div>
  );
};
