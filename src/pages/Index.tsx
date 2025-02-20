
import { useState, useEffect } from "react";
import SudokuGrid from "@/components/SudokuGrid";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Keyboard, Printer, Languages } from "lucide-react";
import { translations } from "@/utils/translations";
import Footer from "@/components/Footer";
import { AdManager } from "@/components/Advertisement/AdManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [useKeyboard, setUseKeyboard] = useState(true);
  const [language, setLanguage] = useState<"en" | "ru">(() => {
    return localStorage.getItem("language") as "en" | "ru" || "ru";
  });

  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (newLang: "en" | "ru") => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-4xl px-4 mx-auto flex-grow">
        <div className="flex justify-between items-center mb-8 pt-6">
          <div className="flex items-center gap-4">
            <img src="https://i.imgur.com/qGmOQDj.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
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
                <DropdownMenuItem onClick={() => handleLanguageChange("ru")}>
                  Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mb-8">
          <SudokuGrid useKeyboard={useKeyboard} t={t} />
          
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              variant="outline"
              onClick={() => setUseKeyboard(!useKeyboard)}
              className={useKeyboard ? "bg-primary text-primary-foreground" : ""}
            >
              <Keyboard className="mr-2 h-4 w-4" />
              {t.keyboard} {useKeyboard ? "ON" : "OFF"}
            </Button>
            
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {t.print}
            </Button>
          </div>
        </div>

        <AdManager />
      </div>
      <Footer t={t} />
    </div>
  );
};

export default Index;
