import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  duration: number; // 지속 시간 (초)
  onTimeout: () => void;
  isRunning: boolean;
  onReset?: number;
}

export function Timer({ duration, onTimeout, isRunning, onReset }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, onReset]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isRunning]);

  const percentage = (timeLeft / duration) * 100;
  const isLow = percentage < 30;
  const isCritical = percentage < 10;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">⏱️ 남은 시간</span>
        <span className={`text-lg font-bold ${isCritical ? 'text-red-600 animate-pulse' : isLow ? 'text-lime-600' : 'text-emerald-600'}`}>
          {timeLeft}초
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-lime-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
