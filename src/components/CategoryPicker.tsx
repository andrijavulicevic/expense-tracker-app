import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/locales/i18n';
import { CategoryKey } from '@/types';

interface CategoryPickerProps {
  selected: CategoryKey | null;
  onSelect: (category: CategoryKey) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.key}
          label={t(`categories.${cat.key}`)}
          icon={cat.icon}
          color={cat.color}
          selected={selected === cat.key}
          onPress={() => onSelect(cat.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
});
