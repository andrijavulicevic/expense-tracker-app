import { useCallback, useState } from 'react';

export function useMonthNavigation() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const goToPreviousMonth = useCallback(() => {
    setMonth((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    setMonth((prev) => {
      const nextMonth = prev === 11 ? 0 : prev + 1;
      const nextYear = prev === 11 ? year + 1 : year;

      // Don't go beyond current month
      if (nextYear > currentYear || (nextYear === currentYear && nextMonth > currentMonth)) {
        return prev;
      }

      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, [year]);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return {
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    isCurrentMonth,
  };
}
