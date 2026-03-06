import { ScrollView, StyleSheet, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import { Spacing } from "@/constants/theme";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "@/locales/i18n";
import { CategoryKey } from "@/types";

interface CategoryPickerProps {
  selected: CategoryKey | null;
  onSelect: (category: CategoryKey) => void;
}

const DEFAULT_KEYS = new Set(DEFAULT_CATEGORIES.map((c) => c.key));

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const { t } = useTranslation();
  const { allCategories } = useCategories();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <View style={styles.chipsContainer}>
        {allCategories.map((cat) => (
          <Chip
            key={cat.key}
            label={
              DEFAULT_KEYS.has(cat.key) ? t(`categories.${cat.key}`) : cat.label
            }
            icon={cat.icon}
            color={cat.color}
            selected={selected === cat.key}
            onPress={() => onSelect(cat.key)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: 60,
  },
  container: {
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
  },
  chipsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingRight: Spacing.one,
  },
});
