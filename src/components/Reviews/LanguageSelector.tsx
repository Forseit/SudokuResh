
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
  language: "en" | "ru";
  onLanguageChange: (lang: "en" | "ru") => void;
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 text-xs font-medium">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onLanguageChange("ru")}>
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLanguageChange("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
