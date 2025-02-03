import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PopupAd from "./PopupAd";
import BannerAd from "./BannerAd";

export const AdManager = () => {
  const [showPopup, setShowPopup] = useState(false);

  const { data: ads } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("active", true);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Show popup ad after a short delay
    const timer = setTimeout(() => {
      const popupAd = ads?.find(ad => ad.display_type === "popup");
      if (popupAd) {
        setShowPopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [ads]);

  const bannerAds = ads?.filter(ad => ad.display_type === "banner") || [];
  const popupAd = ads?.find(ad => ad.display_type === "popup");

  return (
    <>
      {showPopup && popupAd && (
        <PopupAd
          imageUrl={popupAd.image_url}
          targetUrl={popupAd.target_url}
          countdownSeconds={popupAd.countdown_seconds || 5}
          onClose={() => setShowPopup(false)}
        />
      )}
      
      {bannerAds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {bannerAds.map((ad) => (
            <BannerAd
              key={ad.id}
              title={ad.title}
              description={ad.description || undefined}
              imageUrl={ad.image_url}
              targetUrl={ad.target_url}
            />
          ))}
        </div>
      )}
    </>
  );
};
