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
  script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
  script.async = true;
  script.onload = () => {
    if ('VKIDSDK' in window && containerRef.current) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 52942639,
        redirectUrl: 'https://sudokuresh.ru/reviews',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
      });

      const oneTap = new VKID.OneTap();

      const vkidOnSuccess = (data: any) => {
        onAuth({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          avatar_url: data.user.avatar_url,
          vk_user_id: data.user.id.toString()
        });
        setIsLoading(false);
      };

      const vkidOnError = (error: any) => {
        console.error('VK Auth Error:', error);
        setIsLoading(false);
      };

      oneTap.render({
        container: document.currentScript.parentElement,
        showAlternativeLogin: true
      })
      .on(VKID.WidgetEvents.ERROR, vkidOnError)
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
        const code = payload.code;
        const deviceId = payload.device_id;

        VKID.Auth.exchangeCode(code, deviceId)
          .then(vkidOnSuccess)
          .catch(vkidOnError);
      });
    }
  };

  document.body.appendChild(script);

  return () => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}, [onAuth]);

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
