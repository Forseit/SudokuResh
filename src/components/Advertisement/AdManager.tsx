
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

  const selectRandomAd = (adType: "popup" | "banner") => {
    const typeAds = ads?.filter(ad => ad.display_type === adType) || [];
    if (typeAds.length === 0) return null;

    // Create an array of ads weighted by their probability
    const weightedAds: typeof typeAds = [];
    typeAds.forEach(ad => {
      const weight = ad.probability || 25; // Default to 25% if not set
      for (let i = 0; i < weight; i++) {
        weightedAds.push(ad);
      }
    });

    // Select a random ad from the weighted array
    const randomIndex = Math.floor(Math.random() * weightedAds.length);
    return weightedAds[randomIndex];
  };

  useEffect(() => {
    // Show popup ad after a short delay
    const timer = setTimeout(() => {
      const popupAd = selectRandomAd("popup");
      if (popupAd) {
        setShowPopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [ads]);

  const bannerAds = ads?.filter(ad => ad.display_type === "banner") || [];
  const popupAd = selectRandomAd("popup");

  return (
    <>
      {showPopup && popupAd && (
        <PopupAd
          imageUrl={popupAd.image_url}
          targetUrl={popupAd.target_url}
          countdownSeconds={popupAd.countdown_seconds || 30}
          onClose={() => setShowPopup(false)}
          title={popupAd.title}
          description={popupAd.description}
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
