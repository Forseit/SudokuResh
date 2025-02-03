import { Card } from "@/components/ui/card";

interface BannerAdProps {
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
}

const BannerAd = ({ title, description, imageUrl, targetUrl }: BannerAdProps) => {
  const handleClick = () => {
    window.open(targetUrl, '_blank');
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
        <a 
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline mt-2 block"
          onClick={(e) => e.stopPropagation()}
        >
          {targetUrl}
        </a>
      </div>
    </Card>
  );
};

export default BannerAd;
