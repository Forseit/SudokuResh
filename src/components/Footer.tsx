import React, { useEffect, useState } from 'react';
import { Users, Play, RefreshCw, Calendar } from 'lucide-react';

const Footer = () => {
  const [daysFromStart, setDaysFromStart] = useState(0);
  const [gamesCount, setGamesCount] = useState(144);
  const [updatesCount, setUpdatesCount] = useState(13);

  useEffect(() => {
    const startDate = new Date('2025-01-10');
    const calculateDays = () => {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysFromStart(diffDays);
    };

    calculateDays();
    const timer = setInterval(calculateDays, 1000 * 60 * 60 * 24);

    const storedGamesCount = localStorage.getItem('gamesCount') || '0';
    setGamesCount(parseInt(storedGamesCount));

    return () => clearInterval(timer);
  }, []);

  const incrementGamesCount = () => {
    const newCount = gamesCount + 1;
    setGamesCount(newCount);
    localStorage.setItem('gamesCount', newCount.toString());
  };

  (window as any).incrementGamesCount = incrementGamesCount;

  return (
    <footer className="mt-auto">
      <div className="bg-background border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">101</div>
                <div className="text-sm text-muted-foreground">Пользователей</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Play className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{gamesCount}</div>
                <div className="text-sm text-muted-foreground">Игр решено</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{updatesCount}</div>
                <div className="text-sm text-muted-foreground">Обновлений сделано</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{daysFromStart}</div>
                <div className="text-sm text-muted-foreground">Дней с открытия</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">SudokuResh</h2>
          <p className="text-muted-foreground mb-4">
            Почта для связи: dkorostelev1308@gmail.com
          </p>
          <p className="text-sm text-muted-foreground">
            Copyright © SudokuResh 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
