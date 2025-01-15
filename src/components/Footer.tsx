import React, { useEffect, useState } from 'react';
import { Users, Play, RefreshCw, Calendar } from 'lucide-react';

const Footer = () => {
  const [daysFromStart, setDaysFromStart] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [updatesCount, setUpdatesCount] = useState(11); // Fixed at 11 as requested

  useEffect(() => {
    // Calculate days since start
    const startDate = new Date('2025-01-10');
    const calculateDays = () => {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysFromStart(diffDays);
    };

    calculateDays();
    const timer = setInterval(calculateDays, 1000 * 60 * 60 * 24);

    // Initialize user count from localStorage or set to 0
    const storedUserCount = localStorage.getItem('userCount') || '0';
    setUserCount(parseInt(storedUserCount));

    // If this is a new user (no userCount in localStorage), increment the count
    if (!localStorage.getItem('userCount')) {
      const newUserCount = parseInt(storedUserCount) + 1;
      localStorage.setItem('userCount', newUserCount.toString());
      setUserCount(newUserCount);
    }

    // Initialize games count from localStorage
    const storedGamesCount = localStorage.getItem('gamesCount') || '0';
    setGamesCount(parseInt(storedGamesCount));

    // Cleanup interval
    return () => clearInterval(timer);
  }, []);

  // Function to increment games count (will be called from SudokuGrid)
  const incrementGamesCount = () => {
    const newCount = gamesCount + 1;
    setGamesCount(newCount);
    localStorage.setItem('gamesCount', newCount.toString());
  };

  // Add to window object so it can be called from SudokuGrid
  (window as any).incrementGamesCount = incrementGamesCount;

  return (
    <footer className="mt-auto">
      <div className="bg-background border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{userCount}</div>
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
