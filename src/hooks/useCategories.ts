import { useMemo } from 'react';

import { getAllCategories, getCategoryMap, FALLBACK_CATEGORY } from '@/constants/categories';
import { useStore } from '@/store/useStore';
import { Category } from '@/types';

export function useCategories() {
  const customCategories = useStore((s) => s.customCategories);

  return useMemo(() => {
    const allCategories = getAllCategories(customCategories);
    const categoryMap = getCategoryMap(customCategories);

    const getCategory = (key: string): Category =>
      categoryMap[key] ?? FALLBACK_CATEGORY;

    return { allCategories, categoryMap, getCategory };
  }, [customCategories]);
}
