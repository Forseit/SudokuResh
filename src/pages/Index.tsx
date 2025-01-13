import { useState } from "react";
import SudokuGrid from "@/components/SudokuGrid";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Keyboard, Printer } from "lucide-react";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [useKeyboard, setUseKeyboard] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Решатель Судоку</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <SudokuGrid useKeyboard={useKeyboard} />
          
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              variant="outline"
              onClick={() => setUseKeyboard(!useKeyboard)}
              className={useKeyboard ? "bg-primary text-primary-foreground" : ""}
            >
              <Keyboard className="mr-2 h-4 w-4" />
              Клавиатура {useKeyboard ? "ON" : "OFF"}
            </Button>
            
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Распечатать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;