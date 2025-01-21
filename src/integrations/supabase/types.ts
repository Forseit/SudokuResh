import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

declare global {
  interface Window {
    VKIDSDK: any;
  }
}

type VKAuthProps = {
  onAuth: (userData: { 
    firstName: string;
    lastName: string;
    photo: string;
    userId: string;
  }) => void;
};

export const VKAuth = ({ onAuth }: VKAuthProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://id.vk.com/js/sdk/1.1.0/vkid.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && containerRef.current && window.VKIDSDK) {
      const oneTap = new window.VKIDSDK.OneTap({
        app: 52942639,
        redirectUrl: window.location.origin + "/reviews",
        responseType: "code",
        source: "LOWCODE",
      });

      const vkidOnSuccess = (data: any) => {
        onAuth({
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.photo_max,
          userId: data.id,
        });
      };

      const vkidOnError = (error: any) => {
        console.error("VK Auth Error:", error);
      };

      oneTap.render({
        container: containerRef.current,
        showAlternativeLogin: true,
        styles: {
          borderRadius: 16,
          width: 285,
        },
      })
      .on(window.VKIDSDK.WidgetEvents.ERROR, vkidOnError)
      .on(window.VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, function (payload: any) {
        const code = payload.code;
        const deviceId = payload.device_id;

        window.VKIDSDK.Auth.exchangeCode(code, deviceId)
          .then(vkidOnSuccess)
          .catch(vkidOnError);
      });
    }
  }, [scriptLoaded, onAuth]);

  return (
    <div className="flex items-center justify-center">
      <div ref={containerRef} className="mb-4" />
      {!scriptLoaded && (
        <div className="flex items-center gap-2 p-4 rounded-lg border bg-muted">
          <User className="w-5 h-5" />
          <span>Загрузка кнопки авторизации ВКонтакте...</span>
        </div>
      )}
    </div>
  );
};
