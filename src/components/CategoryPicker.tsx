import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { CategoryKey } from '@/types';

interface CategoryPickerProps {
  selected: CategoryKey | null;
  onSelect: (category: CategoryKey) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.key}
          label={cat.label}
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
