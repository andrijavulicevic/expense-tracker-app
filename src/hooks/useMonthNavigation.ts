import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

export function useMonthNavigation() {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());

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
    const current = dayjs();
    const currentYear = current.year();
    const currentMonth = current.month();

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

  const isCurrentMonth = year === now.year() && month === now.month();

  return {
    year,
    month,
    goToPreviousMonth,
    goToNextMonth,
    isCurrentMonth,
  };
}
